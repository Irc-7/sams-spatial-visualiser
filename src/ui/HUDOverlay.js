/**
 * SAMS Spatial Agentic Visualiser - HUD Overlay & Floating Station Badges
 * Floating frosted station tags: Vault, Whiteboard, Kanban Wall, Desk 01, Security Gate.
 * Top-left pill brand logo and real-time metrics.
 */

export class HUDOverlay {
  /**
   * @param {HTMLElement} rootContainer
   * @param {Object} [callbacks]
   * @param {Function} [callbacks.onStationSelect]
   */
  constructor(rootContainer, callbacks = {}) {
    this.root = rootContainer;
    this.callbacks = callbacks;
    this.badges = new Map();

    this.createDom();
  }

  createDom() {
    // 1. Top-Left Brand Logo (Blue Pill with Two White Eyes)
    this.brandLogo = document.createElement('div');
    this.brandLogo.className = 'brand-pill-logo';
    this.brandLogo.innerHTML = `
      <div class="logo-eye-icon">
        <div class="logo-dot"></div>
        <div class="logo-dot"></div>
      </div>
      <div>
        <span class="brand-text">SAMS</span>
        <span class="brand-badge-mini">WORKSPACE</span>
      </div>
    `;
    this.root.appendChild(this.brandLogo);

    // 2. Top-Right Metrics Pill
    this.topMetrics = document.createElement('div');
    this.topMetrics.className = 'top-metrics';
    this.topMetrics.innerHTML = `
      <div class="metric-card">
        <div class="metric-dot" id="metricConnDot"></div>
        <span id="metricConnText">ONLINE</span>
      </div>
      <div class="metric-card">
        <span>FPS:</span>
        <span id="metricFpsText">60</span>
      </div>
    `;
    this.root.appendChild(this.topMetrics);

    // 3. Floating Station Badges Container
    this.badgesLayer = document.createElement('div');
    this.badgesLayer.id = 'floating-badges-layer';
    this.root.appendChild(this.badgesLayer);

    // 4. Spatial Tooltip
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'spatial-tooltip';
    this.tooltip.innerHTML = `
      <div class="tooltip-title" id="ttTitle">Station</div>
      <div class="tooltip-meta" id="ttMeta">Zone</div>
      <div class="tooltip-desc" id="ttDesc">Description</div>
    `;
    this.root.appendChild(this.tooltip);

    this.initStationBadges();
  }

  initStationBadges() {
    const stations = [
      {
        id: 'vault',
        label: 'Vault',
        iconSvg: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
        gridX: 0.8,
        gridY: 2.5,
        elevation: 62
      },
      {
        id: 'whiteboard',
        label: 'Whiteboard',
        iconSvg: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="14" rx="2"></rect><line x1="8" y1="2" x2="8" y2="4"></line><line x1="16" y1="2" x2="16" y2="4"></line></svg>`,
        gridX: 4.2,
        gridY: 0.5,
        elevation: 74
      },
      {
        id: 'kanban_wall',
        label: 'Kanban Wall',
        iconSvg: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>`,
        gridX: 7.8,
        gridY: 0.3,
        elevation: 78
      },
      {
        id: 'desk_01',
        label: 'Desk 01',
        iconSvg: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
        gridX: 4.4,
        gridY: 5.6,
        elevation: 58
      },
      {
        id: 'security_gate',
        label: 'Security Gate',
        iconSvg: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
        gridX: 8.6,
        gridY: 5.2,
        elevation: 48
      }
    ];

    stations.forEach(st => {
      const el = document.createElement('div');
      el.className = 'floating-badge';
      el.dataset.stationId = st.id;
      el.innerHTML = `
        <span class="badge-icon">${st.iconSvg}</span>
        <span class="badge-label">${st.label}</span>
      `;

      el.addEventListener('click', () => {
        if (this.callbacks.onStationSelect) {
          this.callbacks.onStationSelect(st.id);
        }
      });

      this.badgesLayer.appendChild(el);
      this.badges.set(st.id, { el, config: st });
    });
  }

  /**
   * Updates floating badge positions in viewport screen coordinates.
   * @param {import('../core/IsometricEngine.js').IsometricEngine} engine
   * @param {import('../core/Camera.js').Camera} camera
   */
  updateBadgePositions(engine, camera) {
    this.badges.forEach((item) => {
      const st = item.config;
      const worldPos = engine.gridToScreen(st.gridX, st.gridY, 0);

      // Apply camera transformation to find client screen coordinates
      const screenX = worldPos.x * camera.zoom + camera.x;
      const screenY = (worldPos.y - st.elevation) * camera.zoom + camera.y;

      item.el.style.left = `${Math.round(screenX)}px`;
      item.el.style.top = `${Math.round(screenY)}px`;
    });
  }

  setFps(fps) {
    const el = document.getElementById('metricFpsText');
    if (el) el.textContent = Math.round(fps).toString();
  }

  setConnectionStatus(state, text) {
    const txt = document.getElementById('metricConnText');
    const dot = document.getElementById('metricConnDot');
    if (txt) txt.textContent = text || state.toUpperCase();
    if (dot) {
      dot.style.background = (state === 'connected') ? '#10b981' : '#38bdf8';
    }
  }

  showTooltip(clientX, clientY, data) {
    if (!this.tooltip) return;
    this.tooltip.querySelector('#ttTitle').textContent = data.title;
    this.tooltip.querySelector('#ttMeta').textContent = data.meta;
    this.tooltip.querySelector('#ttDesc').textContent = data.desc;

    this.tooltip.style.left = `${clientX}px`;
    this.tooltip.style.top = `${clientY}px`;
    this.tooltip.classList.add('visible');
  }

  hideTooltip() {
    if (this.tooltip) {
      this.tooltip.classList.remove('visible');
    }
  }
}
