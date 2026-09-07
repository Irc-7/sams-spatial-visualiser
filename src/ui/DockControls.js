/**
 * SAMS Spatial Agentic Visualiser - Dock Controls
 * Interactive bottom control dock: theme toggle, agent filters, manual event triggers,
 * camera re-centering, and 30/60 FPS limiter.
 */

export class DockControls {
  /**
   * @param {HTMLElement} rootContainer
   * @param {Object} actions
   * @param {Function} actions.onThemeChange
   * @param {Function} actions.onFilterChange
   * @param {Function} actions.onTriggerEvent
   * @param {Function} actions.onResetCamera
   * @param {Function} actions.onFpsToggle
   */
  constructor(rootContainer, actions = {}) {
    this.root = rootContainer;
    this.actions = actions;
    this.currentTheme = 'dark';
    this.currentFpsCap = 60;

    this.createDom();
  }

  createDom() {
    this.dock = document.createElement('nav');
    this.dock.className = 'dock-container';
    this.dock.innerHTML = `
      <!-- Camera Reset -->
      <div class="dock-group">
        <button class="dock-btn" id="btnResetCam" title="Center Workspace (Space)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12h18M12 3v18"></path>
          </svg>
          Recenter
        </button>
      </div>

      <div class="dock-divider"></div>

      <!-- State Filter Selector -->
      <div class="dock-group">
        <select class="filter-select" id="selectStateFilter" title="Filter Agent Visibility">
          <option value="all">All States (6)</option>
          <option value="active">Active only</option>
          <option value="researching">Researching</option>
          <option value="idle">Idle only</option>
          <option value="error">Error faults</option>
          <option value="success">Success</option>
        </select>
      </div>

      <div class="dock-divider"></div>

      <!-- Manual Simulation Triggers -->
      <div class="dock-group">
        <button class="dock-btn" id="btnTriggerError" title="Simulate Fault Event">
          ⚠️ Fault
        </button>
        <button class="dock-btn" id="btnTriggerSuccess" title="Simulate Deployment Success">
          ⚡ Deploy
        </button>
        <button class="dock-btn" id="btnTriggerResearch" title="Simulate Vector Search">
          🔍 Research
        </button>
      </div>

      <div class="dock-divider"></div>

      <!-- Performance & Theme Controls -->
      <div class="dock-group">
        <button class="dock-btn" id="btnFpsCap" title="Toggle 30 FPS / 60 FPS Cap">
          60 FPS
        </button>
        <button class="dock-btn" id="btnThemeToggle" title="Toggle Light/Dark Theme">
          🌙 Dark
        </button>
      </div>
    `;

    this.root.appendChild(this.dock);
    this.bindEvents();
  }

  bindEvents() {
    const btnResetCam = this.dock.querySelector('#btnResetCam');
    const selectFilter = this.dock.querySelector('#selectStateFilter');
    const btnTriggerError = this.dock.querySelector('#btnTriggerError');
    const btnTriggerSuccess = this.dock.querySelector('#btnTriggerSuccess');
    const btnTriggerResearch = this.dock.querySelector('#btnTriggerResearch');
    const btnFpsCap = this.dock.querySelector('#btnFpsCap');
    const btnThemeToggle = this.dock.querySelector('#btnThemeToggle');

    btnResetCam.addEventListener('click', () => {
      if (this.actions.onResetCamera) this.actions.onResetCamera();
    });

    selectFilter.addEventListener('change', (e) => {
      if (this.actions.onFilterChange) this.actions.onFilterChange(e.target.value);
    });

    btnTriggerError.addEventListener('click', () => {
      if (this.actions.onTriggerEvent) {
        this.actions.onTriggerEvent('error', 'vault_enclave', 'Critical TLS certificate expiration caught');
      }
    });

    btnTriggerSuccess.addEventListener('click', () => {
      if (this.actions.onTriggerEvent) {
        this.actions.onTriggerEvent('success', 'compute_pod_a', 'Distributed consensus ratified by quorum');
      }
    });

    btnTriggerResearch.addEventListener('click', () => {
      if (this.actions.onTriggerEvent) {
        this.actions.onTriggerEvent('researching', 'strategy_wall', 'Cross-referencing telemetry vector topology');
      }
    });

    btnFpsCap.addEventListener('click', () => {
      this.currentFpsCap = (this.currentFpsCap === 60) ? 30 : 60;
      btnFpsCap.textContent = `${this.currentFpsCap} FPS`;
      if (this.actions.onFpsToggle) {
        this.actions.onFpsToggle(this.currentFpsCap);
      }
    });

    btnThemeToggle.addEventListener('click', () => {
      this.currentTheme = (this.currentTheme === 'dark') ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', this.currentTheme);
      btnThemeToggle.textContent = (this.currentTheme === 'dark') ? '🌙 Dark' : '☀️ Light';
      if (this.actions.onThemeChange) {
        this.actions.onThemeChange(this.currentTheme);
      }
    });

    // Keyboard shortcut (Space bar to recenter)
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT') {
        e.preventDefault();
        if (this.actions.onResetCamera) this.actions.onResetCamera();
      }
    });
  }
}
