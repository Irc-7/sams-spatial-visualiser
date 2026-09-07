/**
 * SAMS Spatial Agentic Visualiser - HUD Overlay
 * Telemetry HUD metrics, station spatial tooltips, and real-time event feed.
 */

export class HUDOverlay {
  /**
   * @param {HTMLElement} rootContainer
   * @param {Object} [callbacks]
   * @param {Function} [callbacks.onAgentSelect]
   */
  constructor(rootContainer, callbacks = {}) {
    this.root = rootContainer;
    this.callbacks = callbacks;
    this.eventsHistory = [];
    this.maxHistory = 15;

    this.createDom();
  }

  /**
   * Builds the DOM structure for HUD elements.
   */
  createDom() {
    // 1. Top HUD Bar
    this.topBar = document.createElement('header');
    this.topBar.className = 'hud-topbar';
    this.topBar.innerHTML = `
      <div class="hud-brand">
        <div class="brand-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        </div>
        <div>
          <div class="brand-title">
            SAMS SPATIAL VISUALISER
            <span class="brand-badge">2D-ISO</span>
          </div>
          <div class="brand-sub">Autonomous Multi-Agent Workspace</div>
        </div>
      </div>

      <div class="hud-metrics">
        <div class="metric-pill" id="metricConnection">
          <div class="metric-dot mock" id="connDot"></div>
          <span class="metric-label">TRANSPORT:</span>
          <span class="metric-value" id="connText">STANDBY</span>
        </div>

        <div class="metric-pill">
          <span class="metric-label">AGENTS:</span>
          <span class="metric-value" id="activeAgentsCount">0/0</span>
        </div>

        <div class="metric-pill">
          <span class="metric-label">FPS:</span>
          <span class="metric-value" id="fpsCounter">60</span>
        </div>
      </div>
    `;
    this.root.appendChild(this.topBar);

    // 2. Left Telemetry Feed
    this.feedContainer = document.createElement('aside');
    this.feedContainer.className = 'hud-telemetry-feed';
    this.feedContainer.innerHTML = `
      <div class="telemetry-header">
        <div class="telemetry-title">
          <div class="pulse-indicator"></div>
          Agent Stream Telemetry
        </div>
        <span class="brand-badge" id="feedCount">0 EVT</span>
      </div>
      <div class="telemetry-list" id="telemetryList"></div>
    `;
    this.root.appendChild(this.feedContainer);

    // 3. Spatial Tooltip Element
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'spatial-tooltip';
    this.tooltip.innerHTML = `
      <div class="tooltip-title" id="ttTitle">Workstation</div>
      <div class="tooltip-meta" id="ttMeta">Zone 01</div>
      <div class="tooltip-desc" id="ttDesc">Station description</div>
    `;
    this.root.appendChild(this.tooltip);

    this.cacheElements();
  }

  /**
   * Caches commonly referenced element handles.
   */
  cacheElements() {
    this.connDot = this.topBar.querySelector('#connDot');
    this.connText = this.topBar.querySelector('#connText');
    this.activeAgentsCount = this.topBar.querySelector('#activeAgentsCount');
    this.fpsCounter = this.topBar.querySelector('#fpsCounter');
    this.feedList = this.feedContainer.querySelector('#telemetryList');
    this.feedCount = this.feedContainer.querySelector('#feedCount');
    this.ttTitle = this.tooltip.querySelector('#ttTitle');
    this.ttMeta = this.tooltip.querySelector('#ttMeta');
    this.ttDesc = this.tooltip.querySelector('#ttDesc');
  }

  /**
   * Updates network indicator status.
   * @param {string} state - 'connected' | 'connecting' | 'fallback_mock' | 'disconnected'
   * @param {string} [label]
   */
  setConnectionStatus(state, label) {
    if (!this.connDot || !this.connText) return;
    this.connDot.className = 'metric-dot';

    if (state === 'connected') {
      this.connDot.classList.add('connected');
      this.connText.textContent = label || 'LIVE WS';
    } else if (state === 'connecting') {
      this.connDot.classList.add('connecting');
      this.connText.textContent = 'CONNECTING';
    } else if (state === 'fallback_mock') {
      this.connDot.classList.add('mock');
      this.connText.textContent = 'MOCK TELEMETRY';
    } else {
      this.connText.textContent = 'OFFLINE';
    }
  }

  /**
   * Updates agent count counters in HUD.
   * @param {number} active
   * @param {number} total
   */
  setAgentCounts(active, total) {
    if (this.activeAgentsCount) {
      this.activeAgentsCount.textContent = `${active}/${total}`;
    }
  }

  /**
   * Updates FPS reading.
   * @param {number} fps
   */
  setFps(fps) {
    if (this.fpsCounter) {
      this.fpsCounter.textContent = Math.round(fps).toString();
    }
  }

  /**
   * Pushes a new telemetry event into the feed list.
   * @param {Object} event
   */
  pushTelemetryEvent(event) {
    this.eventsHistory.unshift(event);
    if (this.eventsHistory.length > this.maxHistory) {
      this.eventsHistory.pop();
    }

    if (this.feedCount) {
      this.feedCount.textContent = `${this.eventsHistory.length} EVT`;
    }

    if (!this.feedList) return;

    const itemEl = document.createElement('div');
    itemEl.className = 'telemetry-item';
    const stateClass = `state-${event.state || 'idle'}`;

    itemEl.innerHTML = `
      <div class="telemetry-item-top">
        <span class="agent-tag">${event.agent_id}</span>
        <span class="state-badge ${stateClass}">${event.state}</span>
      </div>
      <div class="task-desc" title="${event.task_summary}">${event.task_summary}</div>
      <div class="task-zone">📍 ${event.target_zone}</div>
    `;

    itemEl.addEventListener('click', () => {
      if (this.callbacks.onAgentSelect) {
        this.callbacks.onAgentSelect(event.agent_id);
      }
    });

    this.feedList.prepend(itemEl);

    // Prune DOM nodes
    while (this.feedList.children.length > this.maxHistory) {
      this.feedList.removeChild(this.feedList.lastChild);
    }
  }

  /**
   * Shows or repositions spatial tooltip at client screen coordinates.
   * @param {number} clientX
   * @param {number} clientY
   * @param {Object} data
   */
  showTooltip(clientX, clientY, data) {
    if (!this.tooltip) return;
    this.ttTitle.textContent = data.title || 'Target';
    this.ttMeta.textContent = data.meta || '';
    this.ttDesc.textContent = data.desc || '';

    this.tooltip.style.left = `${clientX}px`;
    this.tooltip.style.top = `${clientY}px`;
    this.tooltip.classList.add('visible');
  }

  /**
   * Hides spatial tooltip.
   */
  hideTooltip() {
    if (this.tooltip) {
      this.tooltip.classList.remove('visible');
    }
  }
}
