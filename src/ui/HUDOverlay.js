/**
 * SAMS Spatial Agentic Visualiser - Floating Station Badges
 * Exact recreation of Gambar 2 floating badges:
 * - [Shield Icon] Vault
 * - [Board Icon] Whiteboard
 * - [Grid Icon] Kanban Wall
 * - [Monitor Icon] Desk 01
 * - [Lock Icon] Security Gate
 * Minimal, delicate frosted pill labels. Zero titles, zero logos.
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
    this.badgesLayer = document.createElement('div');
    this.badgesLayer.id = 'floating-badges-layer';
    this.root.appendChild(this.badgesLayer);

    // Minimal Hover Tooltip
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'spatial-tooltip';
    this.tooltip.innerHTML = `
      <div class="tooltip-title" id="ttTitle">Station</div>
      <div class="tooltip-meta" id="ttMeta">Task</div>
      <div class="tooltip-desc" id="ttDesc">Details</div>
    `;
    this.root.appendChild(this.tooltip);

    this.initStationBadges();
  }

  initStationBadges() {
    // Exact 5 stations from Gambar 2
    const stations = [
      {
        id: 'vault',
        label: 'Vault',
        taskText: 'Secure Storage',
        iconSvg: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
        gridX: 0.8,
        gridY: 2.5,
        elevation: 64
      },
      {
        id: 'whiteboard',
        label: 'Whiteboard',
        taskText: 'Plans & Architecture',
        iconSvg: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="14" rx="2"></rect><line x1="8" y1="2" x2="8" y2="4"></line><line x1="16" y1="2" x2="16" y2="4"></line></svg>`,
        gridX: 4.2,
        gridY: 0.5,
        elevation: 74
      },
      {
        id: 'kanban_wall',
        label: 'Kanban Wall',
        taskText: 'Work Items',
        iconSvg: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>`,
        gridX: 7.8,
        gridY: 0.3,
        elevation: 78
      },
      {
        id: 'desk_01',
        label: 'Desk 01',
        taskText: 'Active Compute',
        iconSvg: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
        gridX: 4.4,
        gridY: 5.6,
        elevation: 62
      },
      {
        id: 'security_gate',
        label: 'Security Gate',
        taskText: 'Access Control',
        iconSvg: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
        gridX: 8.6,
        gridY: 5.2,
        elevation: 50
      }
    ];

    stations.forEach(st => {
      const el = document.createElement('div');
      el.className = 'station-badge-pill';
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
