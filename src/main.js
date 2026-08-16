// ── Imports ──────────────────────────────────────────────────────────────────
import { initializeApp } from 'firebase/app';
import { 
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, 
  signOut, sendPasswordResetEmail 
} from 'firebase/auth';
import { getDataConnect } from 'firebase/data-connect';
import {
  connectorConfig, getUser, createUser, listHelpRequests, createHelpRequest,
  listApplicationsByApplicant, listMyHelpRequestsWithApplications,
  createApplication, updateApplicationStatus, updateHelpRequestStatus,
  createConversation, createMessage, listConversations, listMessages,
  listPendingUsers, updateUserStatus, terminateJob, completeJob, createReview
} from '@work4abit/dataconnect';

// ── Firebase Config ──────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyAu53ZLxN_6p_BKZUWSE6R8aMbn_iKP91s",
  authDomain: "work4abit.firebaseapp.com",
  projectId: "work4abit",
  storageBucket: "work4abit.firebasestorage.app",
  messagingSenderId: "1019650332467",
  appId: "1:1019650332467:web:70a55093445cbf4689d046",
  measurementId: "G-3CD953WGTS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const dc = getDataConnect(app, connectorConfig);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ── Constants ────────────────────────────────────────────────────────────────
const ADMIN_EMAIL = 'charlesjanparaggua@gmail.com';

// ── State ────────────────────────────────────────────────────────────────────
let currentUser = null;    // Firebase Auth user
let userData = null;       // PostgreSQL user record
let activeSection = 'dashboard';
let messagesInterval = null;
let activeConvId = null;
let isDarkTheme = true;

// ── DOM Helpers ──────────────────────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const peso = (n) => '₱' + Number(n || 0).toLocaleString('en-PH', { maximumFractionDigits: 0 });
const initials = (name = '') => name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const hide = (el) => el?.classList.add('hidden');
const show = (el) => el?.classList.remove('hidden');

function showToast(message, type = 'success') {
  const container = $('#toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const max = 800;
        let w = img.width, h = img.height;
        if (w > max || h > max) {
          if (w > h) { h = Math.round(h * max / w); w = max; }
          else { w = Math.round(w * max / h); h = max; }
        }
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ── Navigation ───────────────────────────────────────────────────────────────
function navigateTo(section) {
  activeSection = section;
  $$('.content-section').forEach(s => s.classList.add('hidden'));
  const target = $(`#section-${section}`);
  if (target) {
    target.classList.remove('hidden');
  }
  $$('.nav-btn[data-target]').forEach(b => b.classList.remove('active'));
  const activeBtn = $(`.nav-btn[data-target="${section}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  // Load section specific data
  if (section === 'dashboard') loadDashboard();
  else if (section === 'requests') loadRequests();
  else if (section === 'applications') loadApplications();
  else if (section === 'messages') loadMessages();
  else if (section === 'profile') loadProfile();
  else if (section === 'admin') loadAdmin();
}

function showAuth(section = 'login') {
  hide($('#app-views'));
  hide($('#loading-screen'));
  show($('#auth-views'));
  $$('#auth-views section').forEach(s => s.classList.add('hidden'));
  const target = $(`#section-${section}`);
  if (target) target.classList.remove('hidden');
}

function showApp() {
  hide($('#auth-views'));
  hide($('#loading-screen'));
  show($('#app-views'));

  // Admin visibility
  const adminNav = $('#nav-admin');
  if (adminNav) {
    if (userData?.email === ADMIN_EMAIL) show(adminNav);
    else hide(adminNav);
  }

  // Sidebar info
  const nameEl = $('#sidebar-user-name');
  if (nameEl) nameEl.textContent = userData?.fullName || currentUser?.displayName || 'User';
  const avatarEl = $('#sidebar-user-avatar');
  if (avatarEl) avatarEl.textContent = initials(userData?.fullName || currentUser?.displayName || 'U');

  navigateTo('dashboard');
}

// ── Auth Listener ────────────────────────────────────────────────────────────
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    try {
      const res = await getUser(dc, { id: user.uid });
      if (res.data.user) {
        userData = { id: user.uid, ...res.data.user };
        if (userData.verificationStatus === 'pending') {
          showAuth('pending');
        } else {
          showApp();
        }
      } else {
        userData = null;
        showAuth('register');
      }
    } catch (err) {
      console.error('Error fetching user from Data Connect:', err);
      userData = null;
      showAuth('register');
    }
  } else {
    currentUser = null;
    userData = null;
    showAuth('login');
  }
});

// ── Login ────────────────────────────────────────────────────────────────────
function setupLogin() {
  const form = $('#login-form');
  const googleBtn = $('#login-google-btn');
  const errorEl = $('#login-error');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hide(errorEl);
    const email = $('#login-email').value.trim();
    const password = $('#login-password').value;
    const btn = $('#login-submit-btn');
    btn.disabled = true; btn.textContent = 'Logging in...';
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      errorEl.textContent = err.message || 'Invalid email or password.';
      show(errorEl);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Log in';
    }
  });

  googleBtn?.addEventListener('click', async () => {
    hide(errorEl);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const res = await getUser(dc, { id: result.user.uid });
      if (!res.data.user) {
        await signOut(auth);
        errorEl.textContent = 'Account not found. Please register first.';
        show(errorEl);
      }
    } catch (err) {
      errorEl.textContent = err.message || 'Google login failed.';
      show(errorEl);
    }
  });

  $('#login-link-register')?.addEventListener('click', (e) => { e.preventDefault(); showAuth('register'); });
  $('#login-link-forgot')?.addEventListener('click', (e) => { e.preventDefault(); showAuth('forgot-password'); });
}

// ── Register ─────────────────────────────────────────────────────────────────
function setupRegister() {
  const form = $('#register-form');
  const googleBtn = $('#register-google-btn');
  const errorEl = $('#register-error');
  let googleUser = null;
  const certInput = $('#register-certificate');
  const certPreview = $('#register-cert-preview');
  const certDropzone = $('#register-cert-dropzone');

  certDropzone?.addEventListener('click', () => certInput?.click());

  certInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      certPreview.src = url;
      show(certPreview);
      certDropzone.querySelector('p').textContent = `Selected: ${file.name}`;
    }
  });

  googleBtn?.addEventListener('click', async () => {
    hide(errorEl);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const res = await getUser(dc, { id: result.user.uid });
      if (res.data.user) {
        // Already registered
        return;
      }
      googleUser = result.user;
      hide($('#register-email-group'));
      hide($('#register-password-row'));
      hide($('#register-divider'));
      hide(googleBtn);
      show($('#register-google-status'));
      $('#register-google-email').textContent = googleUser.email;
      $('#register-fullname').value = googleUser.displayName || '';
    } catch (err) {
      errorEl.textContent = err.message || 'Google link failed.';
      show(errorEl);
    }
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hide(errorEl);
    const fullName = $('#register-fullname').value.trim();
    const studentId = $('#register-studentid').value.trim();
    const gender = $('#register-gender').value;
    const role = $('#register-role').value;
    const faculty = $('#register-faculty').value;
    const btn = $('#register-submit-btn');

    if (!fullName || !studentId) {
      errorEl.textContent = 'Please complete all required fields.';
      show(errorEl);
      return;
    }

    btn.disabled = true; btn.textContent = 'Creating account...';

    try {
      let uid, email;
      if (googleUser) {
        uid = googleUser.uid;
        email = googleUser.email;
      } else {
        email = $('#register-email').value.trim();
        const password = $('#register-password').value;
        const confirm = $('#register-confirm-password').value;
        if (!email || !password) {
          errorEl.textContent = 'Please enter an email and password.';
          show(errorEl);
          btn.disabled = false; btn.textContent = 'Create account';
          return;
        }
        if (password !== confirm) {
          errorEl.textContent = 'Passwords do not match.';
          show(errorEl);
          btn.disabled = false; btn.textContent = 'Create account';
          return;
        }
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        uid = cred.user.uid;
      }

      // Compress certificate
      let certUrl = 'none';
      const certFile = certInput?.files?.[0];
      if (certFile) {
        certUrl = await compressImage(certFile);
      }

      await createUser(dc, {
        id: uid, email, fullName,
        studentId: studentId || null,
        facultyReference: faculty || null,
        certificateUrl: certUrl,
        gender: gender || null
      });

      showAuth('pending');
    } catch (err) {
      errorEl.textContent = err.message || 'Registration failed.';
      show(errorEl);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Create account';
    }
  });

  $('#register-link-login')?.addEventListener('click', (e) => { e.preventDefault(); showAuth('login'); });
}

// ── Forgot Password ──────────────────────────────────────────────────────────
function setupForgotPassword() {
  const form = $('#forgot-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('#forgot-email').value.trim();
    const btn = $('#forgot-submit-btn');
    btn.disabled = true;
    try {
      await sendPasswordResetEmail(auth, email);
    } catch { /* Ignore */ }
    finally {
      btn.disabled = false;
      showToast('If an account exists, a reset link has been sent.');
    }
  });
  $('#forgot-link-login')?.addEventListener('click', (e) => { e.preventDefault(); showAuth('login'); });
  $('#pending-logout-btn')?.addEventListener('click', () => signOut(auth));
}

// ── Dashboard ────────────────────────────────────────────────────────────────
async function loadDashboard() {
  const welcomeEl = $('#dashboard-welcome');
  if (welcomeEl) {
    const firstName = (userData?.fullName || 'User').split(' ')[0];
    welcomeEl.textContent = `Welcome back, ${firstName}! 👋`;
  }

  try {
    const [reqRes, appRes] = await Promise.all([
      listHelpRequests(dc),
      userData?.id ? listApplicationsByApplicant(dc, { userId: userData.id }) : { data: { applications: [] } }
    ]);
    const requests = reqRes.data.helpRequests || [];
    const applications = appRes.data.applications || [];

    $('#stat-applied').textContent = applications.length;
    $('#stat-completed').textContent = '0';
    $('#stat-earnings').textContent = peso(0);
    $('#stat-rating').textContent = '0.0 ★';

    const listEl = $('#dashboard-listings');
    listEl.innerHTML = '';
    const recent = requests.slice(0, 6);
    if (recent.length === 0) {
      listEl.innerHTML = '<div class="empty-state">No listings found.</div>';
    } else {
      recent.forEach(r => {
        const row = document.createElement('div');
        row.className = 'listing-row';
        row.innerHTML = `
          <span class="listing-title">${r.title}</span>
          <span class="badge badge-normal">${r.category || 'General'}</span>
          <span class="listing-price">${peso(r.budget)}</span>
        `;
        row.addEventListener('click', () => navigateTo('requests'));
        listEl.appendChild(row);
      });
    }
  } catch (err) {
    console.error('Dashboard load error:', err);
  }
}

// ── Service Requests ─────────────────────────────────────────────────────────
let allRequests = [];
let requestFilters = { q: '', category: '', maxPrice: 20000, sort: 'newest' };

async function loadRequests() {
  const grid = $('#requests-grid');
  grid.innerHTML = '<div class="loader"></div>';
  try {
    const [reqRes, appRes] = await Promise.all([
      listHelpRequests(dc),
      userData?.id ? listApplicationsByApplicant(dc, { userId: userData.id }) : { data: { applications: [] } }
    ]);
    allRequests = reqRes.data.helpRequests || [];
    const appliedIds = new Set((appRes.data.applications || []).map(a => a.helpRequest?.id));
    renderRequests(allRequests, appliedIds);
  } catch (err) {
    grid.innerHTML = '<div class="empty-state">Error loading requests.</div>';
    console.error(err);
  }
}

function renderRequests(requests, appliedIds = new Set()) {
  const grid = $('#requests-grid');
  let filtered = requests.filter(r => {
    if (requestFilters.q) {
      const hay = `${r.title} ${r.description} ${r.category}`.toLowerCase();
      if (!hay.includes(requestFilters.q.toLowerCase())) return false;
    }
    if (requestFilters.category && r.category !== requestFilters.category) return false;
    if (requestFilters.maxPrice && Number(r.budget) > requestFilters.maxPrice) return false;
    return true;
  });

  if (requestFilters.sort === 'price_asc') filtered.sort((a, b) => a.budget - b.budget);
  else if (requestFilters.sort === 'price_desc') filtered.sort((a, b) => b.budget - a.budget);

  $('#requests-count').textContent = `${filtered.length} request${filtered.length !== 1 ? 's' : ''} available`;

  grid.innerHTML = '';
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-state">No matching requests found.</div>';
    return;
  }

  filtered.forEach(r => {
    const isMine = r.requester?.id === userData?.id;
    const hasApplied = appliedIds.has(r.id);
    const card = document.createElement('article');
    card.className = 'request-card';
    const urgencyClass = r.urgency === 'Urgent' ? 'badge-urgent' : r.urgency === 'Low' ? 'badge-low' : 'badge-normal';

    card.innerHTML = `
      <div class="request-card-header">
        <div class="avatar avatar-sm">${initials(r.requester?.fullName || 'S')}</div>
        <span class="request-card-name truncate">${r.requester?.fullName || 'Student'}</span>
        <span class="badge ${urgencyClass}">${r.urgency === 'Urgent' ? '🔥 ' : ''}${r.urgency || 'Normal'}</span>
      </div>
      <h3 class="request-card-title">${r.title}</h3>
      <p class="request-card-desc line-clamp-3">${r.description || 'No description provided.'}</p>
      <div class="request-card-meta">
        <span class="badge">${r.category || 'General'}</span>
        ${r.deadline ? `<span class="request-card-deadline">📅 Due ${r.deadline}</span>` : ''}
      </div>
      <div class="request-card-footer">
        <div>
          <small class="text-muted">Budget</small>
          <div class="request-card-price">${peso(r.budget)}</div>
        </div>
        <button class="btn ${isMine ? 'btn-ghost' : hasApplied ? 'btn-outline' : 'btn-primary'} btn-sm apply-btn"
                ${isMine || hasApplied ? 'disabled' : ''}>
          ${isMine ? 'Your Post' : hasApplied ? 'Applied' : 'Apply'}
        </button>
      </div>
    `;

    if (!isMine && !hasApplied) {
      card.querySelector('.apply-btn').addEventListener('click', () => openApplyDialog(r));
    }
    grid.appendChild(card);
  });
}

function setupRequestFilters() {
  $('#filter-search')?.addEventListener('input', (e) => { requestFilters.q = e.target.value; renderRequests(allRequests); });
  $('#filter-category')?.addEventListener('change', (e) => { requestFilters.category = e.target.value; renderRequests(allRequests); });
  $('#filter-sort')?.addEventListener('change', (e) => { requestFilters.sort = e.target.value; renderRequests(allRequests); });
  $('#filter-budget')?.addEventListener('input', (e) => {
    requestFilters.maxPrice = Number(e.target.value);
    $('#filter-budget-value').textContent = peso(requestFilters.maxPrice);
    renderRequests(allRequests);
  });
}

// ── New Request Dialog ───────────────────────────────────────────────────────
function setupNewRequestDialog() {
  $('#btn-post-request')?.addEventListener('click', () => {
    $('#dialog-new-request').showModal();
  });

  $('#new-request-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $('#new-request-submit');
    btn.disabled = true; btn.textContent = 'Posting...';
    try {
      await createHelpRequest(dc, {
        title: $('#nr-title').value.trim(),
        description: $('#nr-description').value.trim(),
        budget: Number($('#nr-budget').value),
        requesterId: userData.id,
        category: $('#nr-category').value || null,
        urgency: $('#nr-urgency').value || null,
        deadline: $('#nr-deadline').value || null
      });
      showToast('Request posted successfully!');
      $('#dialog-new-request').close();
      e.target.reset();
      loadRequests();
    } catch (err) {
      showToast('Could not post request: ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Post request';
    }
  });
}

// ── Apply Dialog ─────────────────────────────────────────────────────────────
let applyTarget = null;

function openApplyDialog(request) {
  applyTarget = request;
  $('#apply-job-title').textContent = request.title;
  $('#apply-amount').value = request.budget || '';
  $('#apply-message').value = '';
  $('#dialog-apply').showModal();
}

function setupApplyDialog() {
  $('#apply-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $('#apply-submit');
    btn.disabled = true; btn.textContent = 'Applying...';
    try {
      await createApplication(dc, {
        helpRequestId: applyTarget.id,
        applicantId: userData.id,
        priceOffer: Number($('#apply-amount').value),
        message: $('#apply-message').value.trim()
      });
      showToast(`Application sent! Offer: ${peso($('#apply-amount').value)}`);
      $('#dialog-apply').close();
      loadRequests();
    } catch (err) {
      showToast('Could not apply: ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Submit Application';
    }
  });
}

// ── Applications Hub ─────────────────────────────────────────────────────────
let appTab = 'posted';

async function loadApplications() {
  if (appTab === 'posted') await loadPostedJobs();
  else await loadMyApplications();
}

async function loadPostedJobs() {
  const container = $('#posted-jobs-list');
  container.innerHTML = '<div class="loader"></div>';
  try {
    const res = await listMyHelpRequestsWithApplications(dc, { userId: userData.id });
    const jobs = (res.data.helpRequests || []).filter(j => j.status === 'OPEN' || !j.status);
    container.innerHTML = '';
    if (jobs.length === 0) {
      container.innerHTML = '<div class="empty-state">No posted services with pending candidates.</div>';
      return;
    }
    jobs.forEach(job => {
      const pending = (job.applications_on_helpRequest || []).filter(a => a.status === 'PENDING');
      if (pending.length === 0) return;
      const jobEl = document.createElement('div');
      jobEl.className = 'job-card';
      jobEl.innerHTML = `
        <div class="job-card-header">
          <h3>${job.title}</h3>
          <span class="badge">${peso(job.budget)}</span>
          <span class="badge badge-normal">${pending.length} candidate${pending.length > 1 ? 's' : ''}</span>
        </div>
        <div class="candidates-list"></div>
      `;
      const candList = jobEl.querySelector('.candidates-list');
      pending.forEach(app => {
        const row = document.createElement('div');
        row.className = 'candidate-row';
        row.innerHTML = `
          <div class="avatar avatar-sm">${initials(app.applicant?.fullName || '')}</div>
          <div class="candidate-info">
            <strong>${app.applicant?.fullName || 'Applicant'}</strong>
            <small class="text-muted ml-2">${app.applicant?.studentId || ''}</small>
            <div class="candidate-message">"${app.message}"</div>
          </div>
          <div class="candidate-price">${peso(app.priceOffer)}</div>
          <div class="candidate-actions">
            <button class="btn btn-outline btn-sm btn-danger reject-btn">Reject</button>
            <button class="btn btn-primary btn-sm approve-btn">Approve</button>
          </div>
        `;
        row.querySelector('.approve-btn').addEventListener('click', () => handleApprove(app, job));
        row.querySelector('.reject-btn').addEventListener('click', () => handleReject(app));
        candList.appendChild(row);
      });
      container.appendChild(jobEl);
    });
    if (container.children.length === 0) {
      container.innerHTML = '<div class="empty-state">No pending candidates.</div>';
    }
  } catch (err) {
    container.innerHTML = '<div class="empty-state">Error loading applications.</div>';
    console.error(err);
  }
}

async function loadMyApplications() {
  const container = $('#my-applications-list');
  container.innerHTML = '<div class="loader"></div>';
  try {
    const res = await listApplicationsByApplicant(dc, { userId: userData.id });
    const apps = (res.data.applications || []).filter(a => a.status !== 'REJECTED');
    container.innerHTML = '';
    if (apps.length === 0) {
      container.innerHTML = '<div class="empty-state">No applications submitted yet.</div>';
      return;
    }
    apps.forEach(app => {
      const card = document.createElement('div');
      card.className = 'application-card';
      const statusClass = app.status === 'APPROVED' ? 'badge-approved' : app.status === 'COMPLETED' ? 'badge-completed' : 'badge-pending';
      card.innerHTML = `
        <div>
          <h4>${app.helpRequest?.title || 'Job'}</h4>
          <small class="text-muted">Your offer: ${peso(app.priceOffer)}</small>
        </div>
        <span class="badge ${statusClass}">${app.status === 'PENDING' ? '⏳ Pending Review' : app.status === 'APPROVED' ? '✅ Approved' : app.status}</span>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = '<div class="empty-state">Error loading applications.</div>';
    console.error(err);
  }
}

async function handleApprove(application, job) {
  try {
    await updateApplicationStatus(dc, { id: application.id, status: 'APPROVED' });
    await updateHelpRequestStatus(dc, { id: job.id, status: 'CLOSED' });
    const convRes = await createConversation(dc, {
      applicationId: application.id,
      posterId: userData.id,
      applicantId: application.applicant.id
    });
    const convId = convRes.data.conversation_insert?.id;
    if (convId) {
      await createMessage(dc, {
        conversationId: convId,
        senderId: application.applicant.id,
        content: `📋 Application Offer Accepted\n\nPrice: ${peso(application.priceOffer)}\nMessage: ${application.message}`
      });
    }
    showToast('Application approved! Chat created.');
    navigateTo('messages');
  } catch (err) {
    showToast('Error approving: ' + err.message, 'error');
  }
}

async function handleReject(application) {
  try {
    await updateApplicationStatus(dc, { id: application.id, status: 'REJECTED' });
    showToast('Application rejected.');
    loadApplications();
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  }
}

function setupApplicationTabs() {
  $$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      appTab = btn.dataset.tab;
      $$('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (appTab === 'posted') {
        show($('#posted-jobs-list'));
        hide($('#my-applications-list'));
      } else {
        hide($('#posted-jobs-list'));
        show($('#my-applications-list'));
      }
      loadApplications();
    });
  });
}

// ── Messages ─────────────────────────────────────────────────────────────────
let conversations = [];
let reviewTarget = null;

async function loadMessages() {
  if (messagesInterval) clearInterval(messagesInterval);
  const convList = $('#conversations-list');
  convList.innerHTML = '<div class="loader"></div>';
  try {
    const res = await listConversations(dc, { userId: userData.id });
    conversations = (res.data.conversations || []).filter(c =>
      c.application?.status !== 'TERMINATED' && c.application?.helpRequest?.status !== 'COMPLETED'
    );
    renderConversationList();
    if (conversations.length > 0 && !activeConvId) {
      selectConversation(conversations[0].id);
    } else if (activeConvId) {
      selectConversation(activeConvId);
    } else {
      $('#chat-panel').innerHTML = '<div class="empty-state">No conversations yet.</div>';
    }
  } catch (err) {
    convList.innerHTML = '<div class="empty-state">Error loading conversations.</div>';
    console.error(err);
  }
}

function renderConversationList() {
  const convList = $('#conversations-list');
  convList.innerHTML = '';
  conversations.forEach(conv => {
    const isPoster = conv.poster?.id === userData?.id;
    const otherName = isPoster ? conv.applicant?.fullName : conv.poster?.fullName;
    const item = document.createElement('div');
    item.className = `conversation-item ${conv.id === activeConvId ? 'active' : ''}`;
    item.innerHTML = `
      <div class="avatar avatar-sm">${initials(otherName || '')}</div>
      <div class="conv-info flex-1 truncate">
        <strong class="truncate block">${otherName || 'User'}</strong>
        <small class="text-muted truncate block">${conv.application?.helpRequest?.title || ''}</small>
      </div>
    `;
    item.addEventListener('click', () => selectConversation(conv.id));
    convList.appendChild(item);
  });
}

async function selectConversation(convId) {
  activeConvId = convId;
  renderConversationList();
  if (messagesInterval) clearInterval(messagesInterval);

  const conv = conversations.find(c => c.id === convId);
  if (!conv) return;

  const isPoster = conv.poster?.id === userData?.id;
  const otherUser = isPoster ? conv.applicant : conv.poster;

  const chatHeader = $('#chat-header-content');
  chatHeader.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="avatar avatar-sm">${initials(otherUser?.fullName || '')}</div>
      <div class="chat-header-info">
        <strong>${otherUser?.fullName || 'User'}</strong>
        <small class="text-muted">${conv.application?.helpRequest?.title || ''}</small>
      </div>
    </div>
    <div class="chat-header-actions">
      <button class="btn btn-outline btn-sm btn-danger" id="btn-terminate">Terminate</button>
      ${isPoster ? '<button class="btn btn-success btn-sm" id="btn-complete">Complete</button>' : ''}
    </div>
  `;

  $('#btn-terminate')?.addEventListener('click', async () => {
    if (!confirm('Are you sure you want to terminate this job?')) return;
    try {
      await terminateJob(dc, { applicationId: conv.application.id, helpRequestId: conv.application.helpRequest.id });
      showToast('Job terminated.');
      activeConvId = null;
      loadMessages();
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    }
  });

  $('#btn-complete')?.addEventListener('click', async () => {
    try {
      await completeJob(dc, { applicationId: conv.application.id, helpRequestId: conv.application.helpRequest.id });
      showToast('Job completed!');
      reviewTarget = { convId, otherUser };
      $('#dialog-review').showModal();
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    }
  });

  $('#messages-container')?.classList.add('chat-open');

  await loadChatMessages(convId);
  messagesInterval = setInterval(() => loadChatMessages(convId), 3000);
}

async function loadChatMessages(convId) {
  const msgArea = $('#chat-messages');
  try {
    const res = await listMessages(dc, { conversationId: convId });
    const messages = res.data.messages || [];
    msgArea.innerHTML = '';
    messages.forEach(msg => {
      const isMe = msg.sender?.id === userData?.id;
      const div = document.createElement('div');
      div.className = `message ${isMe ? 'outgoing' : 'incoming'}`;
      div.innerHTML = `
        <div class="message-bubble">${msg.content}</div>
        <small class="message-time">${new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
      `;
      msgArea.appendChild(div);
    });
    msgArea.scrollTop = msgArea.scrollHeight;
  } catch (err) {
    console.error('Messages load error:', err);
  }
}

function setupChat() {
  const input = $('#chat-input');
  const sendBtn = $('#chat-send-btn');

  const send = async () => {
    const content = input.value.trim();
    if (!content || !activeConvId) return;
    input.value = '';
    sendBtn.disabled = true;
    try {
      await createMessage(dc, { conversationId: activeConvId, senderId: userData.id, content });
      await loadChatMessages(activeConvId);
    } catch (err) {
      showToast('Error sending message', 'error');
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  };

  sendBtn?.addEventListener('click', send);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  $('#chat-back-btn')?.addEventListener('click', () => {
    $('#messages-container')?.classList.remove('chat-open');
  });
}

// ── Review Dialog ────────────────────────────────────────────────────────────
function setupReviewDialog() {
  let selectedRating = 5;
  $$('#review-stars .star').forEach(star => {
    star.addEventListener('click', () => {
      selectedRating = Number(star.dataset.value);
      $$('#review-stars .star').forEach((s, i) => {
        s.classList.toggle('filled', i < selectedRating);
      });
    });
  });

  $('#review-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!selectedRating || !reviewTarget) return;
    try {
      await createReview(dc, {
        rating: selectedRating,
        comment: $('#review-comment').value.trim(),
        reviewerId: userData.id,
        targetUserId: reviewTarget.otherUser.id
      });
      showToast('Review submitted!');
      $('#dialog-review').close();
      activeConvId = null;
      loadMessages();
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    }
  });
}

// ── Profile ──────────────────────────────────────────────────────────────────
async function loadProfile() {
  if (!userData) return;
  $('#profile-avatar').textContent = initials(userData.fullName);
  $('#profile-name').textContent = userData.fullName || 'User';
  $('#profile-role').textContent = userData.preferredRole || 'Student';
  $('#profile-email').textContent = userData.email || '';
  $('#profile-student-id').textContent = userData.studentId || 'N/A';
  $('#profile-gender').textContent = userData.gender || 'N/A';
  $('#profile-faculty').textContent = userData.facultyReference || 'N/A';

  const vBadge = $('#profile-verification');
  vBadge.textContent = userData.verificationStatus || 'unverified';
  vBadge.className = `badge ${userData.verificationStatus === 'verified' ? 'badge-approved' : 'badge-pending'}`;

  try {
    const res = await listApplicationsByApplicant(dc, { userId: userData.id });
    $('#profile-stat-applications').textContent = (res.data.applications || []).length;
  } catch {
    $('#profile-stat-applications').textContent = '0';
  }
}

function setupEditProfile() {
  $('#btn-edit-profile')?.addEventListener('click', () => {
    $('#dialog-edit-profile').showModal();
  });
  $('#edit-profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Profile updated locally.');
    $('#dialog-edit-profile').close();
  });
}

// ── Admin Dashboard ──────────────────────────────────────────────────────────
async function loadAdmin() {
  if (userData?.email !== ADMIN_EMAIL) {
    navigateTo('dashboard');
    return;
  }
  const container = $('#admin-list');
  container.innerHTML = '<div class="loader"></div>';
  try {
    const res = await listPendingUsers(dc);
    const users = res.data.users || [];
    container.innerHTML = '';
    if (users.length === 0) {
      container.innerHTML = '<div class="empty-state">✅ All caught up! No pending registrations.</div>';
      return;
    }
    users.forEach(u => {
      const card = document.createElement('div');
      card.className = 'admin-card';
      card.innerHTML = `
        <div class="admin-card-info">
          <div class="avatar">${initials(u.fullName)}</div>
          <div>
            <strong>${u.fullName}</strong>
            <div class="text-muted">${u.email}</div>
            <small class="text-muted">ID: ${u.studentId || 'N/A'} • Faculty: ${u.facultyReference || 'N/A'}</small>
          </div>
        </div>
        ${u.certificateUrl && u.certificateUrl !== 'none'
          ? `<img class="admin-cert-thumb" src="${u.certificateUrl}" alt="Certificate" />`
          : '<span class="text-muted">No certificate</span>'}
        <div class="admin-card-actions">
          <button class="btn btn-outline btn-sm btn-danger reject-btn">Reject</button>
          <button class="btn btn-success btn-sm approve-btn">Approve</button>
        </div>
      `;
      card.querySelector('.approve-btn').addEventListener('click', async () => {
        await updateUserStatus(dc, { id: u.id, status: 'verified' });
        showToast(`${u.fullName} approved!`);
        card.remove();
      });
      card.querySelector('.reject-btn').addEventListener('click', async () => {
        await updateUserStatus(dc, { id: u.id, status: 'rejected' });
        showToast(`${u.fullName} rejected.`);
        card.remove();
      });
      card.querySelector('.admin-cert-thumb')?.addEventListener('click', () => {
        $('#cert-preview-img').src = u.certificateUrl;
        $('#dialog-certificate').showModal();
      });
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = '<div class="empty-state">Error loading pending users.</div>';
    console.error(err);
  }
}

// ── Theme Toggle ─────────────────────────────────────────────────────────────
function setupTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.body.classList.add('light-theme');
    isDarkTheme = false;
    $('#theme-icon').textContent = '☀️';
  } else {
    document.body.classList.remove('light-theme');
    isDarkTheme = true;
    $('#theme-icon').textContent = '🌙';
  }

  $('#theme-toggle')?.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('light-theme', !isDarkTheme);
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    $('#theme-icon').textContent = isDarkTheme ? '🌙' : '☀️';
  });
}

// ── Logout ───────────────────────────────────────────────────────────────────
function setupLogout() {
  $('#btn-logout')?.addEventListener('click', async () => {
    if (messagesInterval) clearInterval(messagesInterval);
    await signOut(auth);
  });
}

// ── Dialog Helpers ───────────────────────────────────────────────────────────
function setupDialogCloseButtons() {
  $$('.dialog-close-btn').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('dialog')?.close());
  });
  $$('dialog').forEach(dialog => {
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
  });
}

// ── Mobile Sidebar ───────────────────────────────────────────────────────────
function setupMobileSidebar() {
  $('#mobile-menu-btn')?.addEventListener('click', () => {
    $('#sidebar').classList.add('sidebar-open');
    show($('#sidebar-overlay'));
  });
  const closeSidebar = () => {
    $('#sidebar').classList.remove('sidebar-open');
    hide($('#sidebar-overlay'));
  };
  $('#sidebar-overlay')?.addEventListener('click', closeSidebar);
  $('#sidebar-close-btn')?.addEventListener('click', closeSidebar);
  $$('.nav-btn').forEach(btn => btn.addEventListener('click', closeSidebar));
}

// ── Initialization ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupLogin();
  setupRegister();
  setupForgotPassword();
  setupRequestFilters();
  setupNewRequestDialog();
  setupApplyDialog();
  setupApplicationTabs();
  setupChat();
  setupReviewDialog();
  setupEditProfile();
  setupTheme();
  setupLogout();
  setupDialogCloseButtons();
  setupMobileSidebar();

  $$('.nav-btn[data-target]').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.target));
  });
});
