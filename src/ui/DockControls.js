/**
 * SAMS Spatial Agentic Visualiser - Dock Controls
 * Frosted glass 6-avatar expression dock matching reference diorama:
 * 1. Blue Helmet (Neutral Round Cyan Eyes)
 * 2. Orange Helmet (Horizontal Slit Eyes)
 * 3. White/Orange Helmet (Vertical Pill Eyes)
 * 4. Dark Screen (Cyan X X Error Eyes)
 * 5. Dark Screen (Cyan — — Sleep Eyes)
 * 6. Teal Helmet (Happy ^ ^ Smile Eyes)
 */

export class DockControls {
  /**
   * @param {HTMLElement} rootContainer
   * @param {Object} actions
   * @param {Function} actions.onSelectExpression
   * @param {Function} actions.onRecenter
   * @param {Function} actions.onFpsToggle
   */
  constructor(rootContainer, actions = {}) {
    this.root = rootContainer;
    this.actions = actions;
    this.activeSlot = 0;
    this.fpsCap = 60;

    this.createDom();
  }

  createDom() {
    this.wrapper = document.createElement('nav');
    this.wrapper.className = 'bottom-dock-wrapper';

    // 1. Upper Card: 6 Robot Face Avatars
    this.expressionCard = document.createElement('div');
    this.expressionCard.className = 'dock-expression-card';

    // 6 SVG Avatars recreating the screenshot icons
    const avatars = [
      {
        id: 'slot_blue_neutral',
        state: 'active',
        name: 'Director Active',
        svg: `<svg viewBox="0 0 48 40" class="avatar-preview">
          <rect width="48" height="40" rx="12" fill="#2563eb"/>
          <rect x="6" y="8" width="36" height="24" rx="8" fill="#090d16"/>
          <circle cx="17" cy="20" r="4.5" fill="#38bdf8"/>
          <circle cx="31" cy="20" r="4.5" fill="#38bdf8"/>
        </svg>`
      },
      {
        id: 'slot_orange_focused',
        state: 'researching',
        name: 'Calculating / Focus',
        svg: `<svg viewBox="0 0 48 40" class="avatar-preview">
          <rect width="48" height="40" rx="12" fill="#f97316"/>
          <rect x="6" y="8" width="36" height="24" rx="8" fill="#090d16"/>
          <rect x="13" y="18" width="8" height="4" rx="1.5" fill="#38bdf8"/>
          <rect x="27" y="18" width="8" height="4" rx="1.5" fill="#38bdf8"/>
        </svg>`
      },
      {
        id: 'slot_white_orange_standby',
        state: 'idle',
        name: 'Vertical Pill Eyes',
        svg: `<svg viewBox="0 0 48 40" class="avatar-preview">
          <rect width="48" height="40" rx="12" fill="#ffffff" stroke="#e2e8f0"/>
          <rect x="6" y="8" width="36" height="24" rx="8" fill="#090d16"/>
          <rect x="15" y="14" width="4.5" height="12" rx="2.2" fill="#38bdf8"/>
          <rect x="28.5" y="14" width="4.5" height="12" rx="2.2" fill="#38bdf8"/>
        </svg>`
      },
      {
        id: 'slot_dark_error',
        state: 'error',
        name: 'Fault X X',
        svg: `<svg viewBox="0 0 48 40" class="avatar-preview">
          <rect width="48" height="40" rx="12" fill="#090d16" stroke="#ef4444" stroke-width="1.5"/>
          <text x="17" y="24" fill="#38bdf8" font-family="monospace" font-weight="900" font-size="14" text-anchor="middle">X</text>
          <text x="31" y="24" fill="#38bdf8" font-family="monospace" font-weight="900" font-size="14" text-anchor="middle">X</text>
        </svg>`
      },
      {
        id: 'slot_dark_sleep',
        state: 'offline',
        name: 'Sleep / Dash',
        svg: `<svg viewBox="0 0 48 40" class="avatar-preview">
          <rect width="48" height="40" rx="12" fill="#090d16" stroke="#475569" stroke-width="1.5"/>
          <rect x="12" y="19" width="9" height="2.5" rx="1" fill="#38bdf8"/>
          <rect x="27" y="19" width="9" height="2.5" rx="1" fill="#38bdf8"/>
        </svg>`
      },
      {
        id: 'slot_teal_happy',
        state: 'success',
        name: 'Happy ^ ^',
        svg: `<svg viewBox="0 0 48 40" class="avatar-preview">
          <rect width="48" height="40" rx="12" fill="#14b8a6"/>
          <rect x="6" y="8" width="36" height="24" rx="8" fill="#090d16"/>
          <path d="M13 22 Q17 15 21 22" stroke="#38bdf8" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M27 22 Q31 15 35 22" stroke="#38bdf8" stroke-width="3" fill="none" stroke-linecap="round"/>
        </svg>`
      }
    ];

    avatars.forEach((av, idx) => {
      const btn = document.createElement('button');
      btn.className = `avatar-btn ${idx === 0 ? 'active' : ''}`;
      btn.title = av.name;
      btn.innerHTML = av.svg;

      btn.addEventListener('click', () => {
        this.expressionCard.querySelectorAll('.avatar-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeSlot = idx;
        if (this.actions.onSelectExpression) {
          this.actions.onSelectExpression(av.state);
        }
      });

      this.expressionCard.appendChild(btn);
    });

    this.wrapper.appendChild(this.expressionCard);

    // 2. Lower Pill Navigation Bar
    this.navBar = document.createElement('div');
    this.navBar.className = 'dock-nav-bar';
    this.navBar.innerHTML = `
      <div class="logo-eye-icon" style="width:28px;height:18px;cursor:pointer;" id="btnDockBrand">
        <div class="logo-dot" style="width:4px;height:4px;"></div>
        <div class="logo-dot" style="width:4px;height:4px;"></div>
      </div>
      <button class="dock-nav-btn" id="btnRecenter">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        Recenter
      </button>
      <button class="dock-nav-btn" id="btnToggleFps">
        60 FPS
      </button>
    `;

    this.wrapper.appendChild(this.navBar);
    this.root.appendChild(this.wrapper);

    this.bindEvents();
  }

  bindEvents() {
    const btnRecenter = this.navBar.querySelector('#btnRecenter');
    const btnFps = this.navBar.querySelector('#btnToggleFps');

    btnRecenter.addEventListener('click', () => {
      if (this.actions.onRecenter) this.actions.onRecenter();
    });

    btnFps.addEventListener('click', () => {
      this.fpsCap = (this.fpsCap === 60) ? 30 : 60;
      btnFps.textContent = `${this.fpsCap} FPS`;
      if (this.actions.onFpsToggle) this.actions.onFpsToggle(this.fpsCap);
    });
  }
}
