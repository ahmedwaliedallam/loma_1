/* ============================================================
   Lo'ma — Auth Modal (Login / Sign Up popup)
   Include this script in every page AFTER main.js
   ============================================================ */

(function () {
  // ── 1. Inject modal HTML into every page ─────────────────
  const modalHTML = `
  <div class="modal-backdrop" id="authModal" role="dialog" aria-modal="true" aria-label="Authentication">
    <div class="modal-box">
      <button class="modal-close" id="modalClose" aria-label="Close"><i class="fas fa-times"></i></button>

      <div class="modal-logo"><a href="index.html">Lo'<span>ma</span></a></div>

      <!-- Tabs -->
      <div class="modal-tabs">
        <button class="modal-tab active" data-tab="login">Log In</button>
        <button class="modal-tab"        data-tab="signup">Sign Up</button>
      </div>

      <!-- ── LOGIN FORM ── -->
      <div class="modal-form active" id="modal-login">
        <form id="loginForm" novalidate>
          <div class="modal-form-group">
            <label for="m-email">Email address</label>
            <div class="modal-input-wrap">
              <input type="email" id="m-email" class="modal-input" placeholder="you@example.com" required/>
              <i class="fas fa-envelope"></i>
            </div>
          </div>
          <div class="modal-form-group">
            <label for="m-pwd">Password</label>
            <div class="modal-input-wrap">
              <input type="password" id="m-pwd" class="modal-input" placeholder="Enter your password" required/>
              <i class="fas fa-eye" id="m-togglePwd"></i>
            </div>
          </div>
          <div class="modal-row">
            <label class="modal-check"><input type="checkbox"/> Remember me</label>
            <a href="#" class="modal-forgot">Forgot password?</a>
          </div>
          <button type="submit" class="modal-btn">Log In</button>
        </form>
        <div class="modal-divider">or continue with</div>
        <div class="modal-social">
          <button class="modal-social-btn"><i class="fab fa-google" style="color:#ea4335"></i> Google</button>
          <button class="modal-social-btn"><i class="fab fa-facebook" style="color:#1877f2"></i> Facebook</button>
        </div>
        <p class="modal-switch">Don't have an account? <button class="modal-switch-link" data-open="signup">Sign Up</button></p>
      </div>

      <!-- ── SIGNUP FORM ── -->
      <div class="modal-form" id="modal-signup">
        <form id="signupForm" novalidate>
          <div class="modal-form-group">
            <label for="m-name">Full Name</label>
            <div class="modal-input-wrap">
              <input type="text" id="m-name" class="modal-input" placeholder="John Doe" required/>
              <i class="fas fa-user"></i>
            </div>
          </div>
          <div class="modal-form-group">
            <label for="m-semail">Email address</label>
            <div class="modal-input-wrap">
              <input type="email" id="m-semail" class="modal-input" placeholder="you@example.com" required/>
              <i class="fas fa-envelope"></i>
            </div>
          </div>
          <div class="modal-form-group">
            <label for="m-spwd">Password</label>
            <div class="modal-input-wrap">
              <input type="password" id="m-spwd" class="modal-input" placeholder="Create a strong password" required/>
              <i class="fas fa-eye" id="m-toggleSpwd"></i>
            </div>
          </div>
          <div class="modal-form-group">
            <label for="m-cpwd">Confirm Password</label>
            <div class="modal-input-wrap">
              <input type="password" id="m-cpwd" class="modal-input" placeholder="Repeat your password" required/>
              <i class="fas fa-eye" id="m-toggleCpwd"></i>
            </div>
          </div>
          <div class="modal-form-group" style="margin-bottom:20px">
            <label class="modal-check"><input type="checkbox" required/> I agree to the <a href="#" style="color:var(--green-mid);font-weight:600">Terms &amp; Privacy</a></label>
          </div>
          <button type="submit" class="modal-btn">Create Account</button>
        </form>
        <div class="modal-divider">or sign up with</div>
        <div class="modal-social">
          <button class="modal-social-btn"><i class="fab fa-google" style="color:#ea4335"></i> Google</button>
          <button class="modal-social-btn"><i class="fab fa-facebook" style="color:#1877f2"></i> Facebook</button>
        </div>
        <p class="modal-switch">Already have an account? <button class="modal-switch-link" data-open="login">Log In</button></p>
      </div>

      <!-- ── SUCCESS ── -->
      <div class="modal-success" id="modal-success">
        <div class="modal-success-icon"><i class="fas fa-check"></i></div>
        <h3 id="success-title">Welcome back!</h3>
        <p id="success-msg">You've successfully logged in.</p>
      </div>
    </div>
  </div>`;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // ── 2. Helper refs ────────────────────────────────────────
  const backdrop  = document.getElementById('authModal');
  const box       = backdrop.querySelector('.modal-box');
  const closeBtn  = document.getElementById('modalClose');
  const tabs      = backdrop.querySelectorAll('.modal-tab');
  const forms     = backdrop.querySelectorAll('.modal-form');
  const successEl = document.getElementById('modal-success');

  // ── 3. Open / Close ──────────────────────────────────────
  function openModal(tab = 'login') {
    switchTab(tab);
    successEl.classList.remove('show');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    // focus first input
    setTimeout(() => {
      const first = backdrop.querySelector('.modal-form.active .modal-input');
      if (first) first.focus();
    }, 350);
  }

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── 4. Tab switching ─────────────────────────────────────
  function switchTab(name) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
    forms.forEach(f => f.classList.toggle('active', f.id === `modal-${name}`));
    successEl.classList.remove('show');
  }

  tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));

  // Switch links inside forms
  backdrop.querySelectorAll('.modal-switch-link').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.open));
  });

  // ── 5. Close triggers ────────────────────────────────────
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // ── 6. Show/hide password ────────────────────────────────
  function bindToggle(inputId, iconId) {
    const icon = document.getElementById(iconId);
    if (!icon) return;
    icon.addEventListener('click', () => {
      const inp = document.getElementById(inputId);
      const isHidden = inp.type === 'password';
      inp.type = isHidden ? 'text' : 'password';
      icon.classList.toggle('fa-eye',      !isHidden);
      icon.classList.toggle('fa-eye-slash', isHidden);
    });
  }
  bindToggle('m-pwd',  'm-togglePwd');
  bindToggle('m-spwd', 'm-toggleSpwd');
  bindToggle('m-cpwd', 'm-toggleCpwd');

  // ── 7. Form submissions ──────────────────────────────────
  function showSuccess(title, msg) {
    forms.forEach(f => f.classList.remove('active'));
    tabs.forEach(t => t.style.display = 'none');
    successEl.querySelector('#success-title').textContent = title;
    successEl.querySelector('#success-msg').textContent   = msg;
    successEl.classList.add('show');
    setTimeout(closeModal, 2200);
  }

  document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    showSuccess('Welcome back! 👋', "You've successfully logged in to Lo'ma.");
  });

  document.getElementById('signupForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('m-name').value.split(' ')[0];
    showSuccess(`Welcome, ${name}! 🎉`, "Your Lo'ma account has been created successfully.");
  });

  // ── 8. Wire up ALL login/signup triggers on the page ─────
  function wireButtons() {
    document.querySelectorAll('[data-modal]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        openModal(el.dataset.modal);
      });
    });
  }

  // ── 9. Replace existing login/signup links globally ───────
  function patchLinks() {
    document.querySelectorAll('a').forEach(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href === 'login.html' || href === 'signup.html') {
        const tab = href === 'login.html' ? 'login' : 'signup';
        a.setAttribute('href', '#');
        a.setAttribute('data-modal', tab);
        a.addEventListener('click', e => { e.preventDefault(); openModal(tab); });
      }
    });
  }

  // Re-hide tabs when modal re-opens
  backdrop.addEventListener('transitionend', () => {
    if (!backdrop.classList.contains('open')) {
      tabs.forEach(t => t.style.display = '');
    }
  });

  wireButtons();
  patchLinks();

  // Expose globally so other scripts can open the modal
  window.lomaModal = { open: openModal, close: closeModal };
})();
