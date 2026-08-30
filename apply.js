import fs from 'fs';
let code = fs.readFileSync('src/main.js', 'utf8');

// Add getRedirectResult to imports
code = code.replace(
  'createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider,',
  'createUserWithEmailAndPassword, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider,'
);

// Add googleUser global
code = code.replace(
  'let currentUser = null;',
  'let currentUser = null;\nlet googleUser = null;'
);
code = code.replace('  let googleUser = null;\n', '');

// Add getRedirectResult handling
const authListenerStart = '// -- Auth Listener ------------------------------------------------------------\n';
const redirectHandler = 
getRedirectResult(auth).catch(err => {
  console.error("Redirect Error:", err);
  const errorEl = document.getElementById('landing-login-error') || document.getElementById('login-error');
  if (errorEl && err.code !== 'auth/redirect-cancelled-by-user') {
    errorEl.textContent = err.message || 'Google login failed.';
    errorEl.classList.remove('hidden');
  }
});
;
code = code.replace(authListenerStart, authListenerStart + redirectHandler + '\n');

// Replace Landing Google Login
const oldLandingGoogle =     try {
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
    };
const newLandingGoogle =     try {
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        errorEl.textContent = err.message || 'Google login failed.';
        show(errorEl);
      }
    };
code = code.replace(oldLandingGoogle, newLandingGoogle);

// Replace Register Google Login
const oldRegisterGoogle =     try {
      const result = await signInWithPopup(auth, googleProvider);
      const res = await getUser(dc, { id: result.user.uid }, SERVER_ONLY);
      if (res.data.user) {
        return;
      }
      googleUser = result.user;
      hide(#register-email-group);
      hide(#register-password-row);
      hide(#register-divider);
      hide(googleBtn);
      show(#register-google-status);
      #register-google-email.textContent = googleUser.email;
      #register-fullname.value = googleUser.displayName || '';
    } catch (err) {
      errorEl.textContent = err.message || 'Google link failed.';
      show(errorEl);
    };
const newRegisterGoogle =     try {
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        errorEl.textContent = err.message || 'Google link failed.';
        show(errorEl);
      }
    };
code = code.replace(oldRegisterGoogle, newRegisterGoogle);

// Update onAuthStateChanged logic
const oldAuthLogic =       if (res.data.user) {
        userData = { id: user.uid, ...res.data.user };
        if (userData.verificationStatus === 'pending') {
          showAuth('pending');
        } else {
          showApp();
        }
      } else {
        userData = null;
        showAuth('register');
      };
const newAuthLogic =       if (res.data.user) {
        userData = { id: user.uid, ...res.data.user };
        googleUser = null;
        if (userData.verificationStatus === 'pending') {
          showAuth('pending');
        } else {
          showApp();
        }
      } else {
        userData = null;
        googleUser = user;
        showAuth('register');
        
        setTimeout(() => {
          const emailGroup = document.getElementById('register-email-group');
          const passRow = document.getElementById('register-password-row');
          const div = document.getElementById('register-divider');
          const gbtn = document.getElementById('register-google-btn');
          const gstatus = document.getElementById('register-google-status');
          
          if (emailGroup) emailGroup.classList.add('hidden');
          if (passRow) passRow.classList.add('hidden');
          if (div) div.classList.add('hidden');
          if (gbtn) gbtn.classList.add('hidden');
          if (gstatus) gstatus.classList.remove('hidden');
          
          const gemail = document.getElementById('register-google-email');
          const gname = document.getElementById('register-fullname');
          if (gemail) gemail.textContent = user.email;
          if (gname) gname.value = user.displayName || '';
        }, 100);
      };
code = code.replace(oldAuthLogic, newAuthLogic);

// Change button text in HTML
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('Continue with Google', 'Sign in to Google');
fs.writeFileSync('index.html', html);

fs.writeFileSync('src/main.js', code);
