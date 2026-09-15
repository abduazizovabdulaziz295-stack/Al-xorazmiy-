/**
 * MAKTAB CRM - AUTHENTICATION SERVICE
 * Login: admin
 * Parol: 12345
 */

const CRM_Auth = {
  // Standart kirish ma'lumotlari
  CREDENTIALS: {
    username: 'admin',
    password: '12345'
  },

  init() {
    this.bindEvents();
    this.checkSession();
  },

  bindEvents() {
    const loginForm = document.getElementById('login-form');
    const togglePassBtn = document.getElementById('btn-toggle-password');
    const quickFillBtn = document.getElementById('btn-quick-fill');
    const logoutBtn = document.getElementById('btn-logout');
    const logoutBtnMini = document.getElementById('btn-logout-mini');

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    if (togglePassBtn) {
      togglePassBtn.addEventListener('click', () => {
        this.togglePasswordVisibility();
      });
    }

    if (quickFillBtn) {
      quickFillBtn.addEventListener('click', () => {
        this.quickFill();
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }

    if (logoutBtnMini) {
      logoutBtnMini.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  },

  handleLogin() {
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const rememberMe = document.getElementById('remember-me');
    const loginCard = document.querySelector('.auth-card');

    const username = usernameInput ? usernameInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';

    // Tekshirish
    if (username === this.CREDENTIALS.username && password === this.CREDENTIALS.password) {
      // Muvaffaqiyatli kirish
      const sessionData = {
        loggedIn: true,
        user: 'Administrator',
        role: 'Super Admin',
        loginTime: new Date().toISOString()
      };

      if (rememberMe && rememberMe.checked) {
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(sessionData));
      } else {
        sessionStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(sessionData));
      }

      showToast('Xush kelibsiz! Maktab CRM boshqaruv paneliga kirdingiz.', 'success');
      this.showDashboard();
    } else {
      // Xatolik - shake animatsiyasi
      if (loginCard) {
        loginCard.classList.remove('shake-error');
        void loginCard.offsetWidth; // trigger reflow
        loginCard.classList.add('shake-error');
      }

      showToast('Login yoki parol noto\'g\'ri! (Login: admin, Parol: 12345)', 'error');
      if (passwordInput) {
        passwordInput.value = '';
        passwordInput.focus();
      }
    }
  },

  togglePasswordVisibility() {
    const passInput = document.getElementById('login-password');
    const icon = document.querySelector('#btn-toggle-password i');
    if (!passInput) return;

    if (passInput.type === 'password') {
      passInput.type = 'text';
      if (icon) {
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      }
    } else {
      passInput.type = 'password';
      if (icon) {
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    }
  },

  quickFill() {
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    if (usernameInput) usernameInput.value = 'admin';
    if (passwordInput) passwordInput.value = '12345';
    showToast('Login va parol avtomatik to\'ldirildi!', 'info');
  },

  checkSession() {
    const localSession = localStorage.getItem(STORAGE_KEYS.AUTH);
    const sessionSession = sessionStorage.getItem(STORAGE_KEYS.AUTH);

    if (localSession || sessionSession) {
      this.showDashboard();
    } else {
      this.showAuth();
    }
  },

  showDashboard() {
    const authView = document.getElementById('auth-view');
    const dashView = document.getElementById('dashboard-view');

    if (authView) authView.style.display = 'none';
    if (dashView) {
      dashView.style.display = 'flex';
      // Ilovani yangilash va grafiklarni ishga tushirish
      if (window.CRM_App) {
        CRM_App.refreshAllViews();
      }
    }
  },

  showAuth() {
    const authView = document.getElementById('auth-view');
    const dashView = document.getElementById('dashboard-view');

    if (dashView) dashView.style.display = 'none';
    if (authView) authView.style.display = 'flex';
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    showToast('Tizimdan muvaffaqiyatli chiqdingiz.', 'info');
    this.showAuth();
  }
};
