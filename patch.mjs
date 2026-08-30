import fs from 'fs';

let code = fs.readFileSync('src/main.js', 'utf8');

// Change authDomain to proxy
code = code.replace(
  'authDomain: "work4abit.firebaseapp.com",',
  'authDomain: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "work4abit.firebaseapp.com" : window.location.hostname,'
);

// Change signInWithRedirect to signInWithPopup
code = code.replaceAll(
  'await signInWithRedirect(auth, googleProvider);',
  'await signInWithPopup(auth, googleProvider);'
);

// Remove redirect_started
code = code.replaceAll(
  'sessionStorage.setItem(''redirect_started'', ''true''); dbg("Starting redirect...");',
  ''
);
code = code.replaceAll(
  'sessionStorage.setItem(''redirect_started'', ''true'');',
  ''
);

// We need to restore the full logic for the popups!
const oldLanding = \    try {
      
      await signInWithPopup(auth, googleProvider);
    } catch (err) {\;
    
const newLanding = \    try {
      const result = await signInWithPopup(auth, googleProvider);
      const res = await getUser(dc, { id: result.user.uid }, SERVER_ONLY);
      if (!res.data.user) {
        googleUser = result.user;
        showAuth('register');
        setTimeout(() => {
          const eg = document.getElementById('register-email-group');
          const pr = document.getElementById('register-password-row');
          const d = document.getElementById('register-divider');
          const gb = document.getElementById('register-google-btn');
          const gs = document.getElementById('register-google-status');
          if (eg) eg.classList.add('hidden');
          if (pr) pr.classList.add('hidden');
          if (d) d.classList.add('hidden');
          if (gb) gb.classList.add('hidden');
          if (gs) gs.classList.remove('hidden');
          const gem = document.getElementById('register-google-email');
          const gna = document.getElementById('register-fullname');
          if (gem) gem.textContent = result.user.email;
          if (gna) gna.value = result.user.displayName || '';
        }, 100);
      }
    } catch (err) {\;

code = code.replace(oldLanding, newLanding);

fs.writeFileSync('src/main.js', code);
