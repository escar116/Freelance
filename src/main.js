// ── Imports ──────────────────────────────────────────────────────────────────
import { initializeApp } from 'firebase/app';
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider,
  signOut, sendPasswordResetEmail
} from 'firebase/auth';
import { getDataConnect, subscribe } from 'firebase/data-connect';
import { getDatabase, ref, push, onChildAdded, serverTimestamp, off, get } from 'firebase/database';
import { getFirestore, collection, addDoc, getDocs, query, where, serverTimestamp as firestoreTimestamp } from 'firebase/firestore';
import {
  connectorConfig, getUser, createUser, listHelpRequests, createHelpRequest,
  listApplicationsByApplicant, listMyHelpRequestsWithApplications,
  createApplication, updateApplicationStatus, updateHelpRequestStatus,
  createConversation, listConversations,
  listConversationsRef,
  listPendingUsers, listAllUsers, listAllHelpRequestsAdmin, listAllApplicationsAdmin,
  updateUserStatus, terminateJob, completeJob, getUserProfile,
  deleteUser, deleteApplication
} from '@work4abit/dataconnect';

// ── Firebase Config ──────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyAu53ZLxN_6p_BKZUWSE6R8aMbn_iKP91s",
  authDomain: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "work4abit.firebaseapp.com" : window.location.hostname,
  projectId: "work4abit",
  storageBucket: "work4abit.firebasestorage.app",
  messagingSenderId: "1019650332467",
  appId: "1:1019650332467:web:70a55093445cbf4689d046",
  measurementId: "G-3CD953WGTS",
  databaseURL: "https://work4abit-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const dc = getDataConnect(app, connectorConfig);
const db = getDatabase(app);
const firestore = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ── Constants ────────────────────────────────────────────────────────────────
const ADMIN_EMAILS = [
  'charlesjanparaggua@gmail.com',
  'anryurmanita@gmail.com',
  'taguinodanathasia@gmail.com'
  // Add new admin emails here separated by commas:
  // 'anotheradmin@email.com'
];
const SERVER_ONLY = { fetchPolicy: 'SERVER_ONLY' };

// ── State ────────────────────────────────────────────────────────────────────
let currentUser = null;
let googleUser = null;


let userData = null;
let activeSection = sessionStorage.getItem('active_section') || 'dashboard';
let autoRefreshTimer = null;
let chatPollTimer = null;
let activeConvId = null;
let messageSubscription = null;
let conversationsSubscription = null;
let renderedMsgIds = new Set();
let pendingTempMessages = [];
let lastConversationsDigest = '';

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
  toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
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

// ── Realtime Multi-Client Synchronization Engine ─────────────────────────────
function startBackgroundSync() {
  if (autoRefreshTimer) clearInterval(autoRefreshTimer);

  // Background view synchronization
  // Increased interval to 60 seconds to prevent quota exhaustion
  autoRefreshTimer = setInterval(() => {
    if (!userData) return;
    if (activeSection === 'messages') {
      loadMessages(true);
    } else if (activeSection === 'dashboard') {
      loadDashboard(true);
    } else if (activeSection === 'applications') {
      loadApplications(true);
    } else if (activeSection === 'services') {
      loadServices(true);
    }
  }, 60000);
}

// Instant sync when tab gains focus
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && userData) {
    if (activeSection === 'messages') {
      loadMessages(true);
      
    } else if (activeSection === 'dashboard') {
      loadDashboard(true);
    } else if (activeSection === 'applications') {
      loadApplications(true);
    } else if (activeSection === 'services') {
      loadServices(true);
    }
  }
});

// ── Navigation ───────────────────────────────────────────────────────────────
function navigateTo(section) {
  activeSection = section;
  sessionStorage.setItem('active_section', section);

  $$('.content-section').forEach(s => s.classList.add('hidden'));
  const target = $(`#section-${section}`);
  if (target) {
    target.classList.remove('hidden');
  }

  $$('.nav-btn[data-target]').forEach(b => {
    b.classList.toggle('active', b.dataset.target === section);
  });

  if (section === 'dashboard') loadDashboard();
  else if (section === 'services') loadServices();
  else if (section === 'applications') loadApplications();
  else if (section === 'messages') loadMessages();
  else if (section === 'transactions') loadTransactions();
  else if (section === 'ratings') loadRatings();
  else if (section === 'profile') loadProfile();
  else if (section === 'admin') loadAdmin();
}

function showAuth(section = 'landing') {
  if (autoRefreshTimer) { clearInterval(autoRefreshTimer); autoRefreshTimer = null; }
  if (chatPollTimer) { clearInterval(chatPollTimer); chatPollTimer = null; }
  if (messageSubscription) { 
    if (typeof messageSubscription === 'function') messageSubscription();
    else off(messageSubscription);
    messageSubscription = null; 
  }
  if (conversationsSubscription) { conversationsSubscription(); conversationsSubscription = null; }
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

  // Admin button visibility
  const adminNav = $('#nav-admin');
  if (adminNav) {
    if (ADMIN_EMAILS.includes(userData?.email)) show(adminNav);
    else hide(adminNav);
  }

  // User Profile in Sidebar Footer & Header
  const userName = userData?.fullName || currentUser?.displayName || 'Student User';
  const userInitials = initials(userName);

  const sidebarName = $('#sidebar-user-name');
  if (sidebarName) sidebarName.textContent = userName;
  const sidebarAvatar = $('#sidebar-user-avatar');
  if (sidebarAvatar) sidebarAvatar.textContent = userInitials;

  const topAvatar = $('#dashboard-user-avatar');
  if (topAvatar) topAvatar.textContent = userInitials;

  navigateTo(activeSection || 'dashboard');
  startBackgroundSync();
}

// ── Auth Listener ────────────────────────────────────────────────────────────
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    try {
      const res = await getUser(dc, { id: user.uid }, SERVER_ONLY);
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
      console.error('Data Connect user fetch error:', err);
      userData = null;
      showAuth('register');
    }
  } else {
    currentUser = null;
    userData = null;
    showAuth('landing');
  }
});

// ── Landing Page ─────────────────────────────────────────────────────────────
function setupLanding() {
  const form = $('#landing-quick-login-form');
  const googleBtn = $('#landing-google-btn');
  const errorEl = $('#landing-login-error');
  const registerBtn = $('#landing-register-btn');
  const topRegisterBtn = $('#landing-top-register-btn');
  const topLoginBtn = $('#landing-top-login-btn');
  const forgotLink = $('#landing-forgot-link');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hide(errorEl);
    const email = $('#landing-login-email').value.trim();
    const password = $('#landing-login-password').value;
    const btn = $('#landing-login-btn');
    btn.disabled = true; btn.textContent = 'Signing in...';
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      errorEl.textContent = err.code === 'auth/invalid-credential' ? 'Invalid email or password.' : (err.message || 'Login failed.');
      show(errorEl);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Sign In';
    }
  });

  googleBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    hide(errorEl);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const res = await getUser(dc, { id: result.user.uid }, SERVER_ONLY);
      if (!res.data.user) {
        await signOut(auth);
        errorEl.textContent = 'Account not found. Please click Sign Up to register.';
        show(errorEl);
      }
    } catch (err) {
      errorEl.textContent = err.message || 'Google login failed.';
      show(errorEl);
    }
  });

  registerBtn?.addEventListener('click', (e) => { e.preventDefault(); showAuth('register'); });
  topRegisterBtn?.addEventListener('click', (e) => { e.preventDefault(); showAuth('register'); });
  topLoginBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    $('#landing-login-email')?.focus();
  });
  forgotLink?.addEventListener('click', (e) => { e.preventDefault(); showAuth('forgot-password'); });
  $('#login-link-home')?.addEventListener('click', (e) => { e.preventDefault(); showAuth('landing'); });
  $('#register-link-home')?.addEventListener('click', (e) => { e.preventDefault(); showAuth('landing'); });
}

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
      errorEl.textContent = err.code === 'auth/invalid-credential' ? 'Invalid email or password.' : (err.message || 'Login failed.');
      show(errorEl);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Login';
    }
  });

  googleBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    hide(errorEl);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const res = await getUser(dc, { id: result.user.uid }, SERVER_ONLY);
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
  
  const certInput = $('#register-certificate');
  const certPreview = $('#register-cert-preview');
  const certDropzone = $('#register-cert-dropzone');
  
  const facultySelect = $('#register-faculty');
  const facultyOtherGroup = $('#register-faculty-other-group');

  facultySelect?.addEventListener('change', (e) => {
    if (e.target.value === 'Others') {
      show(facultyOtherGroup);
    } else {
      hide(facultyOtherGroup);
    }
  });

  certDropzone?.addEventListener('click', () => { certInput?.click(); });

  // Global drag, drop and paste for the register page
  document.addEventListener('dragover', (e) => {
    const regSec = document.querySelector('#section-register');
    if (regSec && !regSec.classList.contains('hidden')) {
      e.preventDefault();
      if (certDropzone) certDropzone.style.borderColor = 'var(--primary-purple)';
    }
  });
  document.addEventListener('dragleave', (e) => {
    const regSec = document.querySelector('#section-register');
    if (regSec && !regSec.classList.contains('hidden')) {
      e.preventDefault();
      if (certDropzone) certDropzone.style.borderColor = '';
    }
  });
  document.addEventListener('drop', (e) => {
    const regSec = document.querySelector('#section-register');
    if (regSec && !regSec.classList.contains('hidden')) {
      e.preventDefault();
      if (certDropzone) certDropzone.style.borderColor = '';
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && certInput) {
        certInput.files = e.dataTransfer.files;
        certInput.dispatchEvent(new Event('change'));
      }
    }
  });
  
  document.addEventListener('paste', (e) => {
    const regSec = document.querySelector('#section-register');
    if (regSec && !regSec.classList.contains('hidden')) {
      if (e.clipboardData.files && e.clipboardData.files.length > 0 && certInput) {
        certInput.files = e.clipboardData.files;
        certInput.dispatchEvent(new Event('change'));
      }
    }
  });

  certInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      certPreview.src = url;
      show(certPreview);
      hide(certDropzone);
    }
  });

  certPreview?.addEventListener('click', () => {
    certInput?.click();
  });

  googleBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    hide(errorEl);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const res = await getUser(dc, { id: result.user.uid }, SERVER_ONLY);
      if (res.data.user) {
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
    let faculty = $('#register-faculty').value;
    const btn = $('#register-submit-btn');

    if (faculty === 'Others') {
      faculty = $('#register-faculty-other').value.trim();
      if (!faculty) {
        errorEl.textContent = 'Please specify your faculty reference.';
        show(errorEl);
        return;
      }
    }

    if (!fullName || !studentId) {
      errorEl.textContent = 'Please complete all required fields.';
      show(errorEl);
      return;
    }

    const certFile = certInput?.files?.[0];
    if (!certFile) {
      errorEl.textContent = 'Please upload your COE (Certificate of Enrollment).';
      show(errorEl);
      return;
    }

    btn.disabled = true; btn.textContent = 'Creating Account...';

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
          btn.disabled = false; btn.textContent = 'Create Account';
          return;
        }
        if (password !== confirm) {
          errorEl.textContent = 'Passwords do not match.';
          show(errorEl);
          btn.disabled = false; btn.textContent = 'Create Account';
          return;
        }
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        uid = cred.user.uid;
      }

      let certUrl = 'none';
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
      btn.textContent = 'Create Account';
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
  $('#pending-logout-btn')?.addEventListener('click', (e) => { e.preventDefault(); signOut(auth); });
}

// ── Dashboard (Dynamic Live Data) ────────────────────────────────────────────
async function loadDashboard(isSilent = false) {
  const welcomeEl = $('#dashboard-welcome');
  if (welcomeEl) {
    const firstName = (userData?.fullName || 'Student').split(' ')[0];
    welcomeEl.textContent = `Welcome back, ${firstName}! 👋`;
  }

  try {
    const [reqRes, appRes, myPostRes, convRes] = await Promise.all([
      listHelpRequests(dc, SERVER_ONLY),
      userData?.id ? listApplicationsByApplicant(dc, { userId: userData.id }, SERVER_ONLY) : { data: { applications: [] } },
      userData?.id ? listMyHelpRequestsWithApplications(dc, { userId: userData.id }, SERVER_ONLY) : { data: { helpRequests: [] } },
      userData?.id ? listConversations(dc, { userId: userData.id }, SERVER_ONLY) : { data: { conversations: [] } }
    ]);
    const requests = reqRes.data.helpRequests || [];
    const applications = appRes.data.applications || [];
    const myPostedJobs = myPostRes.data.helpRequests || [];
    const conversations = convRes.data.conversations || [];

    const activeApps = applications.filter(a => a.status === 'PENDING' || a.status === 'APPROVED').length;
    const posterCompleted = myPostedJobs.filter(j => j.status === 'COMPLETED').length;
    const completedJobs = applications.filter(a => a.status === 'COMPLETED').length + posterCompleted;
    
    // Total Transactions (Earnings from freelance + Spending from hiring)
    const totalEarnings = applications
      .filter(a => a.status === 'COMPLETED')
      .reduce((sum, a) => sum + (Number(a.priceOffer) || 0), 0);
    const totalSpent = myPostedJobs
      .filter(j => j.status === 'COMPLETED')
      .reduce((sum, j) => {
        const approvedApp = (j.applications_on_helpRequest || []).find(a => a.status === 'COMPLETED');
        return sum + (approvedApp ? (Number(approvedApp.priceOffer) || 0) : 0);
      }, 0);

    $('#stat-applied').textContent = activeApps;
    $('#stat-completed').textContent = completedJobs;
    $('#stat-earnings').textContent = totalSpent > 0 ? `${peso(totalEarnings)} Earned / ${peso(totalSpent)} Spent` : peso(totalEarnings);
    
    // Fetch real rating from Firestore
    let realRating = '0.0';
    if (userData?.id) {
      try {
        const q = query(collection(firestore, "reviews"), where("targetUserId", "==", userData.id));
        const revSnap = await getDocs(q);
        if (!revSnap.empty) {
          let sum = 0;
          revSnap.forEach(doc => sum += doc.data().rating);
          realRating = (sum / revSnap.size).toFixed(1);
        }
      } catch (e) {
        console.warn("Could not fetch ratings for dashboard", e);
      }
    }
    $('#stat-rating').innerHTML = `${realRating} <span class="text-amber">★</span>`;

    // Recommended Services Feed
    const listEl = $('#dashboard-listings');
    if (!isSilent) listEl.innerHTML = '';
    if (requests.length === 0) {
      listEl.innerHTML = '<div class="empty-state text-center text-muted" style="padding: 1.5rem;">No services available right now. Be the first to post!</div>';
    } else {
      listEl.innerHTML = '';
      const colors = ['job-icon-green', 'job-icon-purple', 'job-icon-cyan'];
      requests.slice(0, 3).forEach((r, idx) => {
        const item = document.createElement('div');
        item.className = 'job-list-item';
        item.innerHTML = `
          <div class="job-icon-box ${colors[idx % colors.length]}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          </div>
          <div class="job-item-info">
            <h3 class="job-item-title">${r.title}</h3>
            <p class="job-item-subtext">${peso(r.budget)} · ${r.category || 'General'}</p>
          </div>
          <button type="button" class="bookmark-btn" title="View details">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          </button>
        `;
        item.addEventListener('click', (e) => { e.preventDefault(); navigateTo('services'); });
        listEl.appendChild(item);
      });
    }

    // Recent Applications Feed
    const recentAppsEl = $('#dashboard-recent-apps');
    if (!isSilent) recentAppsEl.innerHTML = '';
    if (applications.length === 0) {
      recentAppsEl.innerHTML = '<div class="empty-state text-center text-muted" style="padding: 1rem;">No applications submitted yet.</div>';
    } else {
      recentAppsEl.innerHTML = '';
      applications.slice(0, 3).forEach(app => {
        const row = document.createElement('div');
        row.className = 'app-row-item';
        const isPending = app.status === 'PENDING';
        row.innerHTML = `
          <div class="avatar avatar-sm">${initials(app.helpRequest?.title || 'AP')}</div>
          <div class="app-row-info">
            <h4 class="app-row-title">${app.helpRequest?.title || 'Service Request'}</h4>
            <p class="app-row-meta"><span class="${isPending ? 'text-amber font-semibold' : 'text-green font-semibold'}">${app.status || 'Pending'}</span> · ${peso(app.priceOffer)}</p>
          </div>
        `;
        row.addEventListener('click', () => navigateTo('applications'));
        recentAppsEl.appendChild(row);
      });
    }

    // Recent Messages Feed
    const recentMsgEl = $('#dashboard-recent-messages');
    if (!isSilent) recentMsgEl.innerHTML = '';
    if (conversations.length === 0) {
      recentMsgEl.innerHTML = '<div class="empty-state text-center text-muted" style="padding: 1rem;">No active chats yet.</div>';
    } else {
      recentMsgEl.innerHTML = '';
      conversations.slice(0, 2).forEach(conv => {
        const isPoster = conv.poster?.id === userData?.id;
        const otherUser = isPoster ? conv.applicant : conv.poster;
        const row = document.createElement('div');
        row.className = 'message-row-item';
        row.innerHTML = `
          <div class="avatar avatar-sm">${initials(otherUser?.fullName || '')}</div>
          <div class="message-row-info">
            <div class="flex-between">
              <h4 class="message-row-name">${otherUser?.fullName || 'Peer'}</h4>
              <span class="message-row-time">Active</span>
            </div>
            <p class="message-row-text truncate">${conv.application?.helpRequest?.title || 'Chat conversation'}</p>
          </div>
        `;
        row.addEventListener('click', () => {
          activeConvId = conv.id;
          navigateTo('messages');
        });
        recentMsgEl.appendChild(row);
      });
    }

  } catch (err) {
    console.error('Dashboard load error:', err);
  }
}

function setupDashboardLinks() {
  $('#dash-view-all-jobs')?.addEventListener('click', (e) => { e.preventDefault(); navigateTo('services'); });
  $('#dash-view-all-apps')?.addEventListener('click', (e) => { e.preventDefault(); navigateTo('applications'); });
  $('#dash-view-all-messages')?.addEventListener('click', (e) => { e.preventDefault(); navigateTo('messages'); });
  $('#dashboard-avatar-btn')?.addEventListener('click', (e) => { e.preventDefault(); navigateTo('profile'); });
}

// ── Find Services ────────────────────────────────────────────────────────────
let allRequests = [];
let requestFilters = { q: '', category: '', maxPrice: 20000, sort: 'newest' };

async function loadServices(isSilent = false) {
  const grid = $('#requests-grid');
  if (!isSilent) grid.innerHTML = '<div class="loader"></div>';
  try {
    const [reqRes, appRes] = await Promise.all([
      listHelpRequests(dc, SERVER_ONLY),
      userData?.id ? listApplicationsByApplicant(dc, { userId: userData.id }, SERVER_ONLY) : { data: { applications: [] } }
    ]);
    allRequests = reqRes.data.helpRequests || [];
    const appliedIds = new Set((appRes.data.applications || []).map(a => a.helpRequest?.id));
    renderServices(allRequests, appliedIds);
  } catch (err) {
    if (!isSilent) grid.innerHTML = '<div class="empty-state">Error loading services.</div>';
  }
}

function renderServices(requests, appliedIds = new Set()) {
  const grid = $('#requests-grid');
  let filtered = requests.filter(r => {
    if (requestFilters.q) {
      const hay = `${r.title} ${r.description} ${r.category} ${r.requester?.fullName}`.toLowerCase();
      if (!hay.includes(requestFilters.q.toLowerCase())) return false;
    }
    if (requestFilters.category && r.category !== requestFilters.category) return false;
    if (requestFilters.maxPrice && Number(r.budget) > requestFilters.maxPrice) return false;
    return true;
  });

  if (requestFilters.sort === 'price_asc') filtered.sort((a, b) => a.budget - b.budget);
  else if (requestFilters.sort === 'price_desc') filtered.sort((a, b) => b.budget - a.budget);

  $('#requests-count').textContent = `${filtered.length} service(s) found`;

  grid.innerHTML = '';
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-state text-center text-muted" style="grid-column: 1/-1; padding: 2rem;">No matching services found.</div>';
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
        <div class="avatar avatar-sm cursor-pointer" onclick="openViewProfileDialog('${r.requester?.id}')">${initials(r.requester?.fullName || 'S')}</div>
        <span class="request-card-name cursor-pointer hover:underline" onclick="openViewProfileDialog('${r.requester?.id}')">${r.requester?.fullName || 'Student Client'}</span>
        <span class="${urgencyClass}">${r.urgency === 'Urgent' ? '🔥 ' : ''}${r.urgency || 'Normal'}</span>
      </div>
      <h3 class="request-card-title">${r.title}</h3>
      <p class="request-card-desc line-clamp-3">${r.description || 'No description provided.'}</p>
      <div class="request-card-meta">
        <span class="badge badge-normal">${r.category || 'General'}</span>
        ${r.deadline ? `<span class="request-card-deadline">📅 Due ${r.deadline}</span>` : ''}
      </div>
      <div class="request-card-footer">
        <div>
          <small class="text-muted">Budget</small>
          <div class="request-card-price">${peso(r.budget)}</div>
        </div>
        <button type="button" class="btn ${isMine ? 'btn-outline' : hasApplied ? 'btn-outline' : 'btn-purple'} btn-sm apply-btn"
                ${isMine || hasApplied ? 'disabled' : ''}>
          ${isMine ? 'Your Post' : hasApplied ? 'Applied' : 'Apply Now'}
        </button>
      </div>
    `;

    if (!isMine && !hasApplied) {
      card.querySelector('.apply-btn').addEventListener('click', (e) => {
        e.preventDefault();
        openApplyDialog(r);
      });
    }
    grid.appendChild(card);
  });
}

function setupServiceFilters() {
  $('#filter-search')?.addEventListener('input', (e) => {
    requestFilters.q = e.target.value;
    renderServices(allRequests);
  });

  $('#filter-category')?.addEventListener('change', (e) => {
    requestFilters.category = e.target.value;
    renderServices(allRequests);
  });

  $('#filter-sort')?.addEventListener('change', (e) => {
    requestFilters.sort = e.target.value;
    renderServices(allRequests);
  });

  $('#filter-budget')?.addEventListener('input', (e) => {
    requestFilters.maxPrice = Number(e.target.value);
    $('#filter-budget-value').textContent = peso(requestFilters.maxPrice);
    renderServices(allRequests);
  });

  $('#btn-reset-filters')?.addEventListener('click', (e) => {
    e.preventDefault();
    requestFilters = { q: '', category: '', maxPrice: 20000, sort: 'newest' };
    $('#filter-search').value = '';
    $('#filter-category').value = '';
    $('#filter-sort').value = 'newest';
    $('#filter-budget').value = 20000;
    $('#filter-budget-value').textContent = '₱20,000';
    renderServices(allRequests);
  });
}

// ── New Request Dialog ───────────────────────────────────────────────────────
function setupNewRequestDialog() {
  $('#btn-post-request')?.addEventListener('click', (e) => {
    e.preventDefault();
    $('#dialog-new-request').showModal();
  });

  $('#new-request-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $('#new-request-submit');
    btn.disabled = true; btn.textContent = 'Publishing...';
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
      showToast('Job published successfully!');
      $('#dialog-new-request').close();
      e.target.reset();
      loadServices();
      loadDashboard(true);
    } catch (err) {
      showToast('Could not post job: ' + err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Publish Job';
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
    btn.disabled = true; btn.textContent = 'Submitting...';
    try {
      await createApplication(dc, {
        helpRequestId: applyTarget.id,
        applicantId: userData.id,
        priceOffer: Number($('#apply-amount').value),
        message: $('#apply-message').value.trim()
      });
      showToast(`Application sent! Proposed rate: ${peso($('#apply-amount').value)}`);
      $('#dialog-apply').close();
      loadServices();
      loadDashboard(true);
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

async function loadApplications(isSilent = false) {
  if (appTab === 'posted') await loadPostedJobs(isSilent);
  else await loadMyApplications(isSilent);
}

async function loadPostedJobs(isSilent = false) {
  const container = $('#posted-jobs-list');
  if (!isSilent) container.innerHTML = '<div class="loader"></div>';
  try {
    const res = await listMyHelpRequestsWithApplications(dc, { userId: userData.id }, SERVER_ONLY);
    const jobs = (res.data.helpRequests || []).filter(j => j.status === 'OPEN' || !j.status);
    container.innerHTML = '';
    if (jobs.length === 0) {
      container.innerHTML = '<div class="empty-state text-center text-muted" style="padding: 2rem;">You have not posted any open jobs.</div>';
      return;
    }
    jobs.forEach(job => {
      const pending = (job.applications_on_helpRequest || []).filter(a => a.status === 'PENDING');
      
      const jobEl = document.createElement('div');
      jobEl.className = 'job-card';
      jobEl.innerHTML = `
        <div class="job-card-header">
          <h3>${job.title}</h3>
          <span class="badge badge-normal">${peso(job.budget)}</span>
          <span class="badge badge-pending">${pending.length} candidate(s)</span>
        </div>
        <div class="candidates-list"></div>
      `;
      const candList = jobEl.querySelector('.candidates-list');
      
      if (pending.length === 0) {
        candList.innerHTML = `<div class="text-sm text-muted italic" style="padding: 1rem 0;">No applicants yet.</div>`;
      } else {
        pending.forEach(app => {
          const row = document.createElement('div');
          row.className = 'candidate-row';
          row.innerHTML = `
            <div class="avatar avatar-sm cursor-pointer" onclick="openViewProfileDialog('${app.applicant?.id}')">${initials(app.applicant?.fullName || '')}</div>
            <div class="candidate-info">
              <strong class="cursor-pointer hover:underline" onclick="openViewProfileDialog('${app.applicant?.id}')">${app.applicant?.fullName || 'Applicant'}</strong>
            <small class="text-muted">${app.applicant?.studentId || ''}</small>
            <div class="candidate-message">"${app.message}"</div>
          </div>
          <div class="candidate-price">${peso(app.priceOffer)}</div>
          <div class="candidate-actions">
            <button type="button" class="btn btn-outline btn-sm reject-btn">Reject</button>
            <button type="button" class="btn btn-purple btn-sm approve-btn">Approve</button>
          </div>
        `;
        row.querySelector('.approve-btn').addEventListener('click', (e) => { e.preventDefault(); handleApprove(app, job); });
        row.querySelector('.reject-btn').addEventListener('click', (e) => { e.preventDefault(); handleReject(app); });
        candList.appendChild(row);
        });
      }
      container.appendChild(jobEl);
    });
    if (container.children.length === 0) {
      container.innerHTML = '<div class="empty-state text-center text-muted" style="padding: 2rem;">No pending candidates.</div>';
    }
  } catch (err) {
    if (!isSilent) container.innerHTML = '<div class="empty-state">Error loading applications.</div>';
  }
}

async function loadMyApplications(isSilent = false) {
  const container = $('#my-applications-list');
  if (!isSilent) container.innerHTML = '<div class="loader"></div>';
  try {
    const res = await listApplicationsByApplicant(dc, { userId: userData.id }, SERVER_ONLY);
    const apps = (res.data.applications || []).filter(a => a.status !== 'REJECTED');
    container.innerHTML = '';
    if (apps.length === 0) {
      container.innerHTML = '<div class="empty-state text-center text-muted" style="padding: 2rem;">No applications submitted yet.</div>';
      return;
    }
    apps.forEach(app => {
      const card = document.createElement('div');
      card.className = 'application-card';
      const statusClass = app.status === 'APPROVED' ? 'badge-approved' : app.status === 'COMPLETED' ? 'badge-normal' : 'badge-pending';
      card.innerHTML = `
        <div>
          <h4>${app.helpRequest?.title || 'Job'}</h4>
          <small class="text-muted">Your offer: ${peso(app.priceOffer)}</small>
        </div>
        <span class="badge ${statusClass}">${app.status === 'PENDING' ? '⏳ Pending' : app.status}</span>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    if (!isSilent) container.innerHTML = '<div class="empty-state">Error loading applications.</div>';
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
      await push(ref(db, `conversations/${convId}/messages`), {
        senderId: application.applicant.id,
        content: `📋 Application Offer Accepted\n\nProposed Rate: ${peso(application.priceOffer)}\nMessage: ${application.message}`,
        timestamp: serverTimestamp()
      });
      activeConvId = convId;
    }
    showToast('Application approved! Chat created.');
    navigateTo('messages');
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
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
  $$('.tab-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      appTab = btn.dataset.tab;
      $$('.tab-btn[data-tab]').forEach(b => b.classList.remove('active'));
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

// ── Messages & Realtime Chat Engine ──────────────────────────────────────────
let conversations = [];
let reviewTarget = null;

async function loadMessages(isSilent = false) {
  const convList = $('#conversations-list');
  if (!isSilent && convList.children.length === 0) convList.innerHTML = '<div class="loader"></div>';
  try {
    const res = await listConversations(dc, { userId: userData.id }, SERVER_ONLY);
    conversations = (res.data.conversations || []).filter(c =>
      c.application?.status !== 'TERMINATED' && c.application?.helpRequest?.status !== 'COMPLETED'
    );
    renderConversationList();
    if (conversations.length > 0 && !activeConvId) {
      selectConversation(conversations[0].id);
    } else if (activeConvId) {
      const exists = conversations.some(c => c.id === activeConvId);
      if (!exists && conversations.length > 0) {
        selectConversation(conversations[0].id);
      } else if (exists) {
        selectConversation(activeConvId);
      }
    } else {
      $('#chat-panel').innerHTML = '<div class="empty-state text-center text-muted" style="padding: 2rem;">No conversations yet.<br><br><a href="#" onclick="navigateTo(\'dashboard\')" class="btn btn-purple">Find Jobs</a></div>';
    }
  } catch (err) {
    if (!isSilent) convList.innerHTML = '<div class="empty-state">Error loading conversations.</div>';
  }
}

function renderConversationList() {
  const convList = $('#conversations-list');
  const digest = conversations.map(c => c.id).join(',') + '|' + activeConvId;
  if (digest === lastConversationsDigest && convList.children.length > 0) return;
  lastConversationsDigest = digest;

  convList.innerHTML = '';
  if (conversations.length === 0) {
    convList.innerHTML = '<div style="padding:2rem; text-align:center; color:var(--text-muted);">No conversations yet.<br><br><button onclick="navigateTo(\'dashboard\')" class="btn btn-outline-purple btn-sm">Browse Jobs</button></div>';
    return;
  }
  conversations.forEach(conv => {
    const isPoster = conv.poster?.id === userData?.id;
    const otherName = isPoster ? conv.applicant?.fullName : conv.poster?.fullName;
    const item = document.createElement('div');
    item.className = `conversation-item ${conv.id === activeConvId ? 'active' : ''}`;
    item.innerHTML = `
      <div class="avatar avatar-sm">${initials(otherName || '')}</div>
      <div class="flex-1 truncate">
        <strong class="truncate block">${otherName || 'User'}</strong>
        <small class="text-muted truncate block">${conv.application?.helpRequest?.title || ''}</small>
      </div>
    `;
    item.addEventListener('click', (e) => { e.preventDefault(); selectConversation(conv.id); });
    convList.appendChild(item);
  });
}

async function selectConversation(convId) {
  const isNewSelection = (activeConvId !== convId) || !messageSubscription;
  if (isNewSelection) {
    renderedMsgIds.clear();
    pendingTempMessages = [];
    const msgArea = $('#chat-messages');
    if (msgArea) msgArea.innerHTML = '<div class="loader"></div>';
  }
  activeConvId = convId;
  renderConversationList();
  
  // Add class for mobile messenger-style view
  $('#messages-container')?.classList.add('chat-open');

  const conv = conversations.find(c => c.id === convId);
  if (!conv) return;

  const isPoster = conv.poster?.id === userData?.id;
  const otherUser = isPoster ? conv.applicant : conv.poster;

  const chatHeader = $('#chat-header-content');
  chatHeader.innerHTML = `
    <div class="flex items-center gap-3">
      <div class="avatar avatar-sm cursor-pointer" onclick="openViewProfileDialog('${otherUser?.id}')">${initials(otherUser?.fullName || '')}</div>
      <div>
        <strong class="block cursor-pointer hover:underline" onclick="openViewProfileDialog('${otherUser?.id}')">${otherUser?.fullName || 'User'}</strong>
        <small class="text-muted">${conv.application?.helpRequest?.title || ''}</small>
      </div>
    </div>
    <div class="chat-header-actions">
      <button type="button" class="btn btn-terminate" id="btn-terminate">Terminate</button>
      ${isPoster ? '<button type="button" class="btn btn-complete" id="btn-complete">Complete</button>' : ''}
    </div>
  `;

  $('#btn-terminate')?.addEventListener('click', async (e) => {
    e.preventDefault();
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

  $('#btn-complete')?.addEventListener('click', async (e) => {
    e.preventDefault();
    reviewTarget = { conv, otherUser };
    $('#dialog-review').showModal();
  });

  if (isNewSelection) {
    if (messageSubscription) {
      off(messageSubscription);
      messageSubscription = null;
    }
    try {
      const msgArea = $('#chat-messages');
      if (msgArea) msgArea.innerHTML = '';
      
      const messagesRef = ref(db, `conversations/${convId}/messages`);
      messageSubscription = messagesRef;
      onChildAdded(messagesRef, (snapshot) => {
        const msg = snapshot.val();
        msg.id = snapshot.key;
        renderIncomingMessages([msg]);
      });
    } catch (err) {
      console.warn('Subscription fallback to SERVER_ONLY polling:', err);
    }
  }
}

function renderIncomingMessages(messages) {
  const msgArea = $('#chat-messages');
  if (!msgArea) return;

  if (messages.length > 0 || pendingTempMessages.length > 0) {
    const emptyState = msgArea.querySelector('.empty-state');
    if (emptyState) emptyState.remove();
  }

  let hasNew = false;
  messages.forEach(msg => {
    if (!renderedMsgIds.has(msg.id)) {
      renderedMsgIds.add(msg.id);
      hasNew = true;

      const tempIdx = pendingTempMessages.findIndex(t => t.content === msg.content);
      if (tempIdx !== -1) {
        const tempEl = pendingTempMessages[tempIdx].el;
        if (tempEl && tempEl.parentNode) {
          tempEl.dataset.msgId = msg.id;
          tempEl.removeAttribute('data-temp');
          pendingTempMessages.splice(tempIdx, 1);
          return;
        }
      }

      const senderId = msg.sender?.id || msg.senderId;
      const isMe = senderId === userData?.id;
      const div = document.createElement('div');
      div.className = `message ${isMe ? 'outgoing' : 'incoming'}`;
      div.dataset.msgId = msg.id;
      div.innerHTML = `<div class="message-bubble">${msg.content}</div>`;
      msgArea.appendChild(div);
    }
  });

  if (hasNew) {
    msgArea.scrollTop = msgArea.scrollHeight;
  }
}

function setupChat() {
  const input = $('#chat-input');
  const sendBtn = $('#chat-send-btn');

  const send = async () => {
    const content = input.value.trim();
    if (!content || !activeConvId) return;
    input.value = '';

    const msgArea = $('#chat-messages');
    const emptyState = msgArea.querySelector('.empty-state');
    if (emptyState) emptyState.remove();

    // Instant local outgoing bubble
    const tempDiv = document.createElement('div');
    tempDiv.className = 'message outgoing';
    tempDiv.dataset.temp = 'true';
    tempDiv.innerHTML = `<div class="message-bubble">${content}</div>`;
    msgArea.appendChild(tempDiv);
    msgArea.scrollTop = msgArea.scrollHeight;

    const tempObj = { content, el: tempDiv, time: Date.now() };
    pendingTempMessages.push(tempObj);

    sendBtn.disabled = true;
    try {
      await push(ref(db, `conversations/${activeConvId}/messages`), {
        senderId: userData.id,
        content: content,
        timestamp: serverTimestamp()
      });
    } catch (err) {
      showToast('Error sending message: ' + err.message, 'error');
      tempDiv.remove();
      const idx = pendingTempMessages.indexOf(tempObj);
      if (idx !== -1) pendingTempMessages.splice(idx, 1);
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  };

  sendBtn?.addEventListener('click', (e) => { e.preventDefault(); send(); });
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  $('#chat-back-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    $('#messages-container')?.classList.remove('chat-open');
  });
}

// ── Transactions (Real Dynamic Data) ─────────────────────────────────────────
let allTransactions = [];
async function loadTransactions() {
  const tbody = $('#transactions-tbody');
  tbody.innerHTML = '<tr><td colspan="4" class="text-center"><div class="loader"></div></td></tr>';
  try {
    const res = await listApplicationsByApplicant(dc, { userId: userData.id }, SERVER_ONLY);
    const apps = res.data.applications || [];
    allTransactions = apps;

    const completed = apps.filter(a => a.status === 'COMPLETED');
    const pending = apps.filter(a => a.status === 'PENDING' || a.status === 'APPROVED');

    const completedTotal = completed.reduce((sum, a) => sum + (Number(a.priceOffer) || 0), 0);
    const pendingTotal = pending.reduce((sum, a) => sum + (Number(a.priceOffer) || 0), 0);
    const grandTotal = completedTotal + pendingTotal;

    $('#trans-total-earnings').textContent = peso(grandTotal);
    $('#trans-pending-earnings').textContent = peso(pendingTotal);
    $('#trans-completed-earnings').textContent = peso(completedTotal);

    renderTransactionsTable('all');
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted" style="padding: 2rem;">Error loading transactions.</td></tr>';
  }
}

function renderTransactionsTable(filter = 'all') {
  const tbody = $('#transactions-tbody');
  let list = allTransactions;
  if (filter === 'pending') list = list.filter(a => a.status === 'PENDING' || a.status === 'APPROVED');
  else if (filter === 'completed') list = list.filter(a => a.status === 'COMPLETED');

  tbody.innerHTML = '';
  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted" style="padding: 2rem;">No transaction records found.<br><br><button class="btn btn-purple btn-sm" onclick="navigateTo(\'dashboard\')">Find Work</button></td></tr>';
    return;
  }

  list.forEach(item => {
    const tr = document.createElement('tr');
    const isCompleted = item.status === 'COMPLETED';
    tr.innerHTML = `
      <td><strong>${item.helpRequest?.title || 'Service Request'}</strong></td>
      <td>Recently</td>
      <td><strong>${peso(item.priceOffer)}</strong></td>
      <td><span class="badge ${isCompleted ? 'badge-approved' : 'badge-pending'}">${item.status || 'Pending'}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function setupTransactionTabs() {
  $$('.trans-tab').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      $$('.trans-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTransactionsTable(btn.dataset.filter);
    });
  });
}

// ── Ratings & Feedback ───────────────────────────────────────────────────────
async function loadRatings() {
  const score = '5.0';
  $('#ratings-avg-score').textContent = score;
  $('#ratings-total-count').textContent = 'Based on reviews';
}

function setupInlineRatingForm() {
  $('#inline-rating-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Feedback submitted! Thank you.');
    $('#inline-feedback-text').value = '';
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
    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitting...'; }
    try {
      // 1. Complete the job
      await completeJob(dc, { applicationId: reviewTarget.conv.application.id, helpRequestId: reviewTarget.conv.application.helpRequest.id });
      
      // 2. Submit the review
      const revData = {
          rating: selectedRating,
          comment: document.getElementById('review-comment').value.trim(),
          reviewerId: userData.id,
          reviewerName: userData.fullName,
          targetUserId: reviewTarget.otherUser.id,
          createdAt: firestoreTimestamp()
        };
      await addDoc(collection(firestore, "reviews"), revData);
      
      showToast('Job completed and review submitted!');
      $('#dialog-review').close();
      
      // 3. Clear chat UI
      activeConvId = null;
      $('#messages-container')?.classList.remove('chat-open');
      loadMessages();
      loadDashboard(true);
    } catch (err) {
      showToast('Error: ' + err.message, 'error');
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit Rating'; }
    }
  });
}

// ── Profile ──────────────────────────────────────────────────────────────────
function renderReviews(reviews, prefix) {
  if (!reviews || reviews.length === 0) {
    $(`#${prefix}-avg`).textContent = '0.0';
    $(`#${prefix}-count`).textContent = 'Based on 0 reviews';
    $(`#${prefix}-list`).innerHTML = '<div class="empty-state text-center text-muted">No reviews yet.</div>';
    [1,2,3,4,5].forEach(r => {
      if ($(`#pb-${r}`)) $(`#pb-${r}`).style.width = '0%';
      if ($(`#pc-${r}`)) $(`#pc-${r}`).textContent = '0';
    });
    return;
  }
  
  let sum = 0;
  const counts = {1:0, 2:0, 3:0, 4:0, 5:0};
  reviews.forEach(r => {
    sum += r.rating;
    counts[r.rating] = (counts[r.rating] || 0) + 1;
  });
  
  const avg = sum / reviews.length;
  $(`#${prefix}-avg`).textContent = avg.toFixed(1);
  $(`#${prefix}-count`).textContent = `Based on ${reviews.length} review${reviews.length > 1 ? 's' : ''}`;
  
  [1,2,3,4,5].forEach(r => {
    const pct = (counts[r] / reviews.length) * 100;
    if ($(`#pb-${r}`)) $(`#pb-${r}`).style.width = pct + '%';
    if ($(`#pc-${r}`)) $(`#pc-${r}`).textContent = counts[r];
  });
  
  $(`#${prefix}-list`).innerHTML = reviews.map(r => `
    <div class="feedback-item">
      <div class="flex justify-between items-start">
        <strong class="text-white">${r.reviewerName || 'Anonymous'}</strong>
        <span class="text-yellow-400 font-bold">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
      </div>
      <p class="text-sm text-gray-300 mt-2">${r.comment || ''}</p>
    </div>
  `).join('');
}

async function loadProfile() {
  if (!userData) return;
  $('#profile-avatar').textContent = initials(userData.fullName);
  $('#profile-name').textContent = userData.fullName || 'Student User';
  $('#profile-faculty').textContent = userData.facultyReference || 'Not provided';
  $('#profile-student-id').textContent = userData.studentId || '—';

  try {
    const resUser = await getUserProfile(dc, { id: userData.id }, SERVER_ONLY);
    const userProfile = resUser.data.user;
    if (!userProfile) return;

    // Set stats
    const apps = userProfile.applications_on_applicant || [];
    $('#stat-app-pending').textContent = apps.filter(a => a.status === 'PENDING').length;
    $('#stat-app-completed').textContent = apps.filter(a => a.status === 'COMPLETED').length;
    $('#stat-app-terminated').textContent = apps.filter(a => a.status === 'TERMINATED').length;

    const reqs = userProfile.helpRequests_on_requester || [];
    $('#stat-emp-pending').textContent = reqs.filter(r => r.status === 'OPEN').length;
    $('#stat-emp-completed').textContent = reqs.filter(r => r.status === 'COMPLETED').length;
    $('#stat-emp-terminated').textContent = reqs.filter(r => r.status === 'TERMINATED').length;

    const reviewsSnap = await getDocs(query(collection(firestore, "reviews"), where("targetUserId", "==", userData.id)));
    const reviews = reviewsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderReviewsProfile(reviews);
  } catch (err) {
    console.error('Error loading profile:', err);
  }
}

function renderReviewsProfile(reviews) {
  if (!reviews || reviews.length === 0) {
    if (document.getElementById('ratings-avg-score')) document.getElementById('ratings-avg-score').textContent = '0.0';
    if (document.getElementById('ratings-total-count')) document.getElementById('ratings-total-count').textContent = 'Based on 0 reviews';
    if (document.getElementById('profile-feedback-list')) document.getElementById('profile-feedback-list').innerHTML = '<div class="empty-state text-center text-muted">No reviews yet.</div>';
    if (document.getElementById('ratings-feedback-list')) document.getElementById('ratings-feedback-list').innerHTML = '<div class="empty-state text-center text-muted">No reviews yet.</div>';
    [1,2,3,4,5].forEach(r => {
      const pb = document.getElementById('pb-' + r);
      if (pb) pb.style.width = '0%';
      const pc = document.getElementById('pc-' + r);
      if (pc) pc.textContent = '0';
    });
    return;
  }

window.openViewProfileDialog = async function(userId) {
  try {
    const res = await getUserProfile(dc, { id: userId }, SERVER_ONLY);
    const user = res.data.user;
    if (!user) return;
    
    document.getElementById('vp-avatar').textContent = initials(user.fullName);
    document.getElementById('vp-name').textContent = user.fullName;
    document.getElementById('vp-program').textContent = user.facultyReference || 'Student';
    document.getElementById('vp-faculty').textContent = user.facultyReference || 'Not provided';
    document.getElementById('vp-student-id').textContent = user.studentId || '?';

    // Set stats
    const apps = user.applications_on_applicant || [];
    document.getElementById('vp-app-pending').textContent = apps.filter(a => a.status === 'PENDING').length;
    document.getElementById('vp-app-completed').textContent = apps.filter(a => a.status === 'COMPLETED').length;
    document.getElementById('vp-app-terminated').textContent = apps.filter(a => a.status === 'TERMINATED').length;

    const reqs = user.helpRequests_on_requester || [];
    document.getElementById('vp-emp-pending').textContent = reqs.filter(r => r.status === 'OPEN').length;
    document.getElementById('vp-emp-completed').textContent = reqs.filter(r => r.status === 'COMPLETED').length;
    document.getElementById('vp-emp-terminated').textContent = reqs.filter(r => r.status === 'TERMINATED').length;
    
    // Fetch reviews from Firestore
    const reviewsSnap = await getDocs(query(collection(firestore, "reviews"), where("targetUserId", "==", userId)));
    const reviews = reviewsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    let sum = 0;
    reviews.forEach(r => sum += r.rating);
    const avg = reviews.length > 0 ? (sum / reviews.length).toFixed(1) : '0.0';
    
    document.getElementById('vp-ratings-avg').textContent = avg;
    document.getElementById('vp-ratings-count').textContent = 'Based on ' + reviews.length + ' reviews';
    
    if (reviews.length === 0) {
      document.getElementById('vp-ratings-list').innerHTML = '<div class="empty-state text-center text-muted">No reviews yet.</div>';
    } else {
      document.getElementById('vp-ratings-list').innerHTML = reviews.map(r => {
        const stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
        const name = r.reviewerName || (r.reviewer ? r.reviewer.fullName : 'Anonymous');
        return '<div class="feedback-item mb-3 pb-3" style="border-bottom: 1px solid var(--border-card);"><div class="flex justify-between items-start"><strong class="text-sm" style="color: var(--text-heading);">' + name + '</strong><span class="text-xs" style="color: var(--color-amber);">' + stars + '</span></div><p class="text-xs mt-1 text-muted">' + (r.comment || '') + '</p></div>';
      }).join('');
    }
    
    document.getElementById('dialog-view-profile').showModal();
  } catch (err) {
    console.error('Profile Dialog Error:', err);
    showToast('Failed to load profile', 'error');
  }
};
  $('#sidebar-overlay')?.addEventListener('click', closeMobileSidebar);
  $('#sidebar-close-btn')?.addEventListener('click', closeMobileSidebar);
}

// ── Logout ───────────────────────────────────────────────────────────────────
function setupLogout() {
  $('#btn-logout')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const forms = ['#landing-quick-login-form', '#login-form', '#register-form'];
    forms.forEach(sel => { const f = document.querySelector(sel); if (f) f.reset(); });
    hide($('#register-faculty-other-group'));
    if (autoRefreshTimer) { clearInterval(autoRefreshTimer); autoRefreshTimer = null; }
    if (chatPollTimer) { clearInterval(chatPollTimer); chatPollTimer = null; }
    if (messageSubscription) { 
    if (typeof messageSubscription === 'function') messageSubscription();
    else off(messageSubscription);
    messageSubscription = null; 
  }
    if (conversationsSubscription) { conversationsSubscription(); conversationsSubscription = null; }
    sessionStorage.removeItem('active_section');
    await signOut(auth);
  });
}

// ── Dialog Helpers ───────────────────────────────────────────────────────────
function setupDialogCloseButtons() {
  $$('.dialog-close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.closest('dialog')?.close();
    });
  });
  $$('dialog').forEach(dialog => {
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
  });
}

// ── Initialization ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupLanding();
  setupLogin();
  setupRegister();
  setupForgotPassword();
  setupDashboardLinks();
  setupServiceFilters();
  setupNewRequestDialog();
  setupApplyDialog();
  setupApplicationTabs();
  setupChat();
  setupTransactionTabs();
  setupInlineRatingForm();
  setupReviewDialog();
  setupEditProfile();
  setupMobileSidebar();
  setupLogout();
  setupAdminTabs();
  setupAdminSearch();
  setupDialogCloseButtons();

  $$('.nav-btn[data-target]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(btn.dataset.target);
      $('#sidebar')?.classList.remove('sidebar-open');
      hide($('#sidebar-overlay'));
    });
  });

  $('.user-footer-profile')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('profile');
  });
});







