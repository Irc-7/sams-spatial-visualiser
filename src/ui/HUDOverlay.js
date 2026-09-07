/**
 * SAMS Spatial Agentic Visualiser - Floating Job Callouts & Workspace Labels
 * Minimalist, precision floating badges indicating each robot's specific job & station.
 * Zero titles, zero logos, zero headers - pure workspace diorama.
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
    // Floating Station / Job Badges Container
    this.badgesLayer = document.createElement('div');
    this.badgesLayer.id = 'floating-badges-layer';
    this.root.appendChild(this.badgesLayer);

    // Minimal Hover Tooltip
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'spatial-tooltip';
    this.tooltip.innerHTML = `
      <div class="tooltip-title" id="ttTitle">Station</div>
      <div class="tooltip-meta" id="ttMeta">Zone</div>
      <div class="tooltip-desc" id="ttDesc">Description</div>
    `;
    this.root.appendChild(this.tooltip);

    this.initJobCallouts();
  }

  initJobCallouts() {
    // The exact 5 workstation jobs from the reference infographic
    const stationJobs = [
      {
        id: 'desk_01',
        name: 'Desk 01',
        subtitle: 'Active Compute',
        dotColor: '#2563eb', // Blue dot
        iconSvg: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
        gridX: 4.4,
        gridY: 5.6,
        elevation: 64
      },
      {
        id: 'vault',
        name: 'Vault',
        subtitle: 'Secure Storage',
        dotColor: '#10b981', // Green dot
        iconSvg: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
        gridX: 0.8,
        gridY: 2.5,
        elevation: 64
      },
      {
        id: 'whiteboard',
        name: 'Whiteboard',
        subtitle: 'Plans & Architecture',
        dotColor: '#f97316', // Orange dot
        iconSvg: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="14" rx="2"></rect><line x1="8" y1="2" x2="8" y2="4"></line><line x1="16" y1="2" x2="16" y2="4"></line></svg>`,
        gridX: 4.2,
        gridY: 0.5,
        elevation: 74
      },
      {
        id: 'kanban_wall',
        name: 'Kanban Wall',
        subtitle: 'Work Items',
        dotColor: '#f97316', // Orange dot
        iconSvg: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>`,
        gridX: 7.8,
        gridY: 0.3,
        elevation: 78
      },
      {
        id: 'security_gate',
        name: 'Security Gate',
        subtitle: 'Access Control',
        dotColor: '#10b981', // Green dot
        iconSvg: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
        gridX: 8.6,
        gridY: 5.2,
        elevation: 50
      }
    ];

    stationJobs.forEach(job => {
      const el = document.createElement('div');
      el.className = 'job-callout-pill';
      el.dataset.stationId = job.id;
      el.innerHTML = `
        <span class="callout-dot" style="background:${job.dotColor};"></span>
        <span class="callout-icon">${job.iconSvg}</span>
        <div class="callout-texts">
          <span class="callout-name">${job.name}</span>
          <span class="callout-sep">/</span>
          <span class="callout-sub">${job.subtitle}</span>
        </div>
      `;

      el.addEventListener('click', () => {
        if (this.callbacks.onStationSelect) {
          this.callbacks.onStationSelect(job.id);
        }
      });

      this.badgesLayer.appendChild(el);
      this.badges.set(job.id, { el, config: job });
    });
  }

  /**
   * Syncs floating badge positions in viewport screen coordinates.
   * @param {import('../core/IsometricEngine.js').IsometricEngine} engine
   * @param {import('../core/Camera.js').Camera} camera
   */
  updateBadgePositions(engine, camera) {
    this.badges.forEach((item) => {
      const st = item.config;
      const worldPos = engine.gridToScreen(st.gridX, st.gridY, 0);

      const screenX = worldPos.x * camera.zoom + camera.x;
      const screenY = (worldPos.y - st.elevation) * camera.zoom + camera.y;

      item.el.style.left = `${Math.round(screenX)}px`;
      item.el.style.top = `${Math.round(screenY)}px`;
    });
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
