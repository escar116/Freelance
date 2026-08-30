const fs = require('fs');
let code = fs.readFileSync('src/main.js', 'utf8');

// 1. Clear forms on logout
const oldLogout = \unction setupLogout() {
  #btn-logout?.addEventListener('click', async (e) => {
    e.preventDefault();\;
const newLogout = \unction setupLogout() {
  #btn-logout?.addEventListener('click', async (e) => {
    e.preventDefault();
    const forms = ['#landing-quick-login-form', '#login-form', '#register-form'];
    forms.forEach(sel => { const f = document.querySelector(sel); if (f) f.reset(); });\;
code = code.replace(oldLogout, newLogout);

// 2. Empty state for convList
const oldConvList = \convList.innerHTML = '';
    conversations.forEach(conv => {\;
const newConvList = \convList.innerHTML = '';
    if (conversations.length === 0) {
      convList.innerHTML = '<div style="padding:2rem; text-align:center; color:var(--text-muted);">No conversations yet.<br><br><button onclick="navigateTo(\\'dashboard\\')" class="btn btn-outline-purple btn-sm">Browse Jobs</button></div>';
      return;
    }
    conversations.forEach(conv => {\;
code = code.replace(oldConvList, newConvList);

// 3. Empty state for chat panel
const oldChatEmpty = \style="padding: 2rem;">No conversations yet.</div>\;
const newChatEmpty = \style="padding: 2rem;">No conversations yet.<br><br><a href="#" onclick="navigateTo(\\'dashboard\\')" class="btn btn-purple">Find Jobs</a></div>\;
code = code.replace(oldChatEmpty, newChatEmpty);

// 4. Empty state for transactions
const oldTransEmpty = \No transaction records found.</td></tr>\;
const newTransEmpty = \No transaction records found.<br><br><button class="btn btn-purple btn-sm" onclick="navigateTo(\\'dashboard\\')">Find Work</button></td></tr>\;
code = code.replace(oldTransEmpty, newTransEmpty);

fs.writeFileSync('src/main.js', code);
