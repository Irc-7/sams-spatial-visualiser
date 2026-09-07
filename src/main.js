/**
 * SAMS Spatial Agentic Visualiser - Main Application Entry Point
 * Orchestrates Canvas 2D render loop, isometric projection, entity simulation,
 * telemetry ingestion, and user interface.
 */

import { IsometricEngine } from './core/IsometricEngine.js';
import { Camera } from './core/Camera.js';
import { RoomArchitecture } from './world/RoomArchitecture.js';
import { PropsRegistry } from './world/PropsRegistry.js';
import { WORKSTATION_ZONES, getZoneAtGrid, getWaypointForZone } from './world/Workstations.js';
import { RobotAgent, AGENT_PALETTES } from './entities/RobotAgent.js';
import { EventBridge } from './network/EventBridge.js';
import { HUDOverlay } from './ui/HUDOverlay.js';
import { DockControls } from './ui/DockControls.js';

class SamsVisualiserApp {
  constructor() {
    this.container = document.getElementById('app-container');
    if (!this.container) {
      throw new Error('Element #app-container not found in DOM.');
    }

    // 1. Create and setup HTML5 Canvas 2D
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'viewportCanvas';
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d', { alpha: false });

    // 2. Core Engines
    this.engine = new IsometricEngine({
      tileWidth: 54,
      tileHeight: 27,
      elevationFactor: 16
    });

    this.camera = new Camera(this.canvas, {
      zoom: 1.15,
      minZoom: 0.45,
      maxZoom: 2.8
    });

    // 3. World & Props
    this.room = new RoomArchitecture(this.engine, { gridSize: 12 });
    this.propsRegistry = new PropsRegistry(this.engine);
    this.props = this.propsRegistry.getAllProps();

    // 4. Agents Pool
    this.agents = new Map();
    this.initAgents();

    // 5. User Interface (HUD & Controls)
    this.activeFilter = 'all';
    this.fpsCap = 60;
    this.hoveredEntity = null;
    this.hoveredTile = null;

    this.hud = new HUDOverlay(this.container, {
      onAgentSelect: (agentId) => this.focusAgent(agentId)
    });

    this.dock = new DockControls(this.container, {
      onThemeChange: (theme) => this.handleThemeChange(theme),
      onFilterChange: (filter) => this.handleFilterChange(filter),
      onTriggerEvent: (state, zone, summary) => this.triggerManualSimEvent(state, zone, summary),
      onResetCamera: () => this.centerWorkspace(),
      onFpsToggle: (fps) => { this.fpsCap = fps; }
    });

    // 6. Network Telemetry Bridge
    // Detects query param ?ws= or ?sse=, else runs transparent mock fallback
    const urlParams = new URLSearchParams(window.location.search);
    const customEndpoint = urlParams.get('ws') || urlParams.get('sse') || null;

    this.bridge = new EventBridge({
      url: customEndpoint,
      enableMockFallback: true
    });

    this.setupNetworkEvents();

    // 7. Render Loop and Timing
    this.lastFrameTime = performance.now();
    this.elapsedTime = 0;
    this.fpsAccumulator = 0;
    this.frameCount = 0;
    this.lastFpsUpdate = performance.now();

    // 8. Event Listeners (Resize, Picking)
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
    this.setupPickingEvents();

    // Initial Center
    this.centerWorkspace();

    // Start Loop
    this.tick = this.tick.bind(this);
    requestAnimationFrame(this.tick);
  }

  /**
   * Initializes baseline agent roster.
   */
  initAgents() {
    const defaultRoster = [
      {
        id: 'agent_coder_01',
        name: 'Coder 01',
        role: 'Core Backend Engineer',
        gridX: 3.0,
        gridY: 5.0,
        palette: AGENT_PALETTES[0],
        state: 'active'
      },
      {
        id: 'agent_researcher_02',
        name: 'Research 02',
        role: 'Vector RAG Specialist',
        gridX: 9.0,
        gridY: 1.5,
        palette: AGENT_PALETTES[1],
        state: 'researching'
      },
      {
        id: 'agent_reviewer_03',
        name: 'Reviewer 03',
        role: 'QA & Security Sentinel',
        gridX: 5.0,
        gridY: 7.0,
        palette: AGENT_PALETTES[2],
        state: 'idle'
      },
      {
        id: 'agent_sre_04',
        name: 'SRE 04',
        role: 'Infra & Turnstile Gatekeeper',
        gridX: 1.5,
        gridY: 1.5,
        palette: AGENT_PALETTES[3],
        state: 'success'
      }
    ];

    defaultRoster.forEach(cfg => {
      const agent = new RobotAgent({
        id: cfg.id,
        name: cfg.name,
        role: cfg.role,
        gridX: cfg.gridX,
        gridY: cfg.gridY,
        primaryColor: cfg.palette.primary,
        darkColor: cfg.palette.dark,
        initialState: cfg.state
      });
      this.agents.set(cfg.id, agent);
    });
  }

  /**
   * Subscribes to EventBridge telemetry events.
   */
  setupNetworkEvents() {
    this.bridge.on('connection_change', (conn) => {
      this.hud.setConnectionStatus(conn.state, conn.isMock ? 'MOCK TELEMETRY' : 'LIVE WS');
    });

    this.bridge.on('agent_event', (evt) => {
      this.handleAgentTelemetry(evt);
    });
  }

  /**
   * Handles an incoming standardized telemetry packet.
   * @param {Object} evt
   */
  handleAgentTelemetry(evt) {
    let agent = this.agents.get(evt.agent_id);

    // Dynamic agent registration if incoming agent is not yet in pool
    if (!agent) {
      const palette = AGENT_PALETTES[this.agents.size % AGENT_PALETTES.length];
      agent = new RobotAgent({
        id: evt.agent_id,
        name: evt.agent_id.replace('agent_', '').replace('_', ' ').toUpperCase(),
        gridX: 6,
        gridY: 6,
        primaryColor: palette.primary,
        darkColor: palette.dark,
        initialState: evt.state
      });
      this.agents.set(evt.agent_id, agent);
    }

    // Update state and task
    agent.setExecutionState(evt.state, evt.target_zone, evt.task_summary);

    // Move to target waypoint if zone specified
    if (evt.target_zone) {
      const wp = getWaypointForZone(evt.target_zone);
      if (wp) {
        agent.moveTo(wp.x, wp.y);
      }
    }

    // Feed HUD
    this.hud.pushTelemetryEvent(evt);
    this.updateHudMetrics();
  }

  /**
   * Updates HUD metric labels.
   */
  updateHudMetrics() {
    let activeCount = 0;
    this.agents.forEach(a => {
      const st = a.visor.currentState;
      if (st === 'active' || st === 'researching') activeCount++;
    });
    this.hud.setAgentCounts(activeCount, this.agents.size);
  }

  /**
   * Handles window resize and canvas pixel density scaling.
   */
  handleResize() {
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;

    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);

    this.camera.resize(w, h);
  }

  /**
   * Centers the camera on the middle of the 12x12 isometric room.
   */
  centerWorkspace() {
    const centerScreen = this.engine.gridToScreen(6, 6, 0);
    this.camera.centerOn(centerScreen.x, centerScreen.y);
  }

  /**
   * Focuses the camera on a specific agent.
   * @param {string} agentId
   */
  focusAgent(agentId) {
    const agent = this.agents.get(agentId);
    if (agent) {
      this.agents.forEach(a => { a.selected = false; });
      agent.selected = true;
      const screenPos = this.engine.gridToScreen(agent.gridX, agent.gridY, agent.gridZ);
      this.camera.centerOn(screenPos.x, screenPos.y, 1.4);
    }
  }

  /**
   * Sets up mouse interaction for entity picking and hover tooltips.
   */
  setupPickingEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      // Inverse projection to grid coordinates
      const worldPos = this.camera.screenToWorld(clientX, clientY);
      const gridPos = this.engine.screenToGrid(worldPos.x, worldPos.y);
      const gx = Math.floor(gridPos.x);
      const gy = Math.floor(gridPos.y);

      if (gx >= 0 && gx < 12 && gy >= 0 && gy < 12) {
        this.hoveredTile = { x: gx, y: gy };
      } else {
        this.hoveredTile = null;
      }

      // Check agent hover (proximity test in screen space)
      let foundAgent = null;
      for (const agent of this.agents.values()) {
        const agentScreen = this.engine.gridToScreen(agent.gridX, agent.gridY, agent.gridZ);
        const dist = Math.hypot(worldPos.x - agentScreen.x, worldPos.y - (agentScreen.y - 30));
        if (dist < 28) {
          foundAgent = agent;
          break;
        }
      }

      if (foundAgent) {
        this.hoveredEntity = foundAgent;
        this.hud.showTooltip(clientX, clientY, {
          title: `${foundAgent.name} (${foundAgent.visor.currentState.toUpperCase()})`,
          meta: foundAgent.role,
          desc: `Task: ${foundAgent.taskSummary} | Zone: ${foundAgent.targetZone}`
        });
        return;
      }

      // Check prop / zone hover
      const zone = getZoneAtGrid(gridPos.x, gridPos.y);
      if (zone) {
        this.hud.showTooltip(clientX, clientY, {
          title: zone.name,
          meta: `ZONE TYPE: ${zone.type.toUpperCase()}`,
          desc: zone.description
        });
        return;
      }

      this.hud.hideTooltip();
    });

    this.canvas.addEventListener('click', (e) => {
      if (this.camera.isDragging) return;
      const rect = this.canvas.getBoundingClientRect();
      const worldPos = this.camera.screenToWorld(e.clientX - rect.left, e.clientY - rect.top);

      for (const agent of this.agents.values()) {
        const agentScreen = this.engine.gridToScreen(agent.gridX, agent.gridY, agent.gridZ);
        const dist = Math.hypot(worldPos.x - agentScreen.x, worldPos.y - (agentScreen.y - 30));
        if (dist < 32) {
          this.focusAgent(agent.id);
          break;
        }
      }
    });
  }

  handleThemeChange(theme) {
    // Canvas background clears appropriately in render loop
  }

  handleFilterChange(filter) {
    this.activeFilter = filter;
  }

  triggerManualSimEvent(state, zone, summary) {
    const agentList = Array.from(this.agents.keys());
    const randomAgent = agentList[Math.floor(Math.random() * agentList.length)];
    this.bridge.sendManualEvent(randomAgent, state, zone, summary);
  }

  /**
   * Main render tick with delta-time and FPS throttling.
   * @param {number} timestamp
   */
  tick(timestamp) {
    requestAnimationFrame(this.tick);

    const elapsedDelta = (timestamp - this.lastFrameTime) / 1000;
    const minFrameInterval = 1 / this.fpsCap;

    if (elapsedDelta < minFrameInterval) {
      return; // Cap frame rate to 30 or 60 FPS
    }

    this.lastFrameTime = timestamp;
    const dt = Math.min(elapsedDelta, 0.1); // Guard against tab freeze bursts
    this.elapsedTime += dt;

    // FPS calculation
    this.frameCount++;
    if (timestamp - this.lastFpsUpdate >= 1000) {
      const currentFps = (this.frameCount * 1000) / (timestamp - this.lastFpsUpdate);
      this.hud.setFps(currentFps);
      this.frameCount = 0;
      this.lastFpsUpdate = timestamp;
    }

    // 1. Update Camera & Entities
    this.camera.update(dt);
    for (const agent of this.agents.values()) {
      agent.update(dt);
    }

    // 2. Render Frame
    this.render();
  }

  /**
   * Renders the complete isometric frame.
   */
  render() {
    const ctx = this.ctx;
    const w = this.camera.width;
    const h = this.camera.height;

    // Clear background
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    ctx.fillStyle = isLight ? '#f1f5f9' : '#090d16';
    ctx.fillRect(0, 0, w, h);

    // Apply Camera transform
    this.camera.applyTransform(ctx);

    // 1. Render Floor Grid and perimeter cutaway walls
    this.room.renderPerimeterWalls(ctx);
    this.room.renderFloor(ctx, this.hoveredTile);

    // 2. Collect Renderables for Depth Sorting (Props + Robot Agents)
    const renderQueue = [];

    // Add Props
    for (const prop of this.props) {
      const screenPos = this.engine.gridToScreen(prop.gridX, prop.gridY, prop.gridZ || 0);
      renderQueue.push({
        type: 'prop',
        depthKey: this.engine.getDepthKey(prop.gridX, prop.gridY, prop.gridZ || 0, 1),
        draw: () => prop.render(ctx, screenPos, this.elapsedTime)
      });
    }

    // Add Agents (filtered by activeFilter)
    for (const agent of this.agents.values()) {
      if (this.activeFilter !== 'all' && agent.visor.currentState !== this.activeFilter) {
        continue;
      }
      const screenPos = this.engine.gridToScreen(agent.gridX, agent.gridY, agent.gridZ);
      renderQueue.push({
        type: 'agent',
        depthKey: this.engine.getDepthKey(agent.gridX, agent.gridY, agent.gridZ, 2),
        draw: () => agent.render(ctx, screenPos, this.elapsedTime)
      });
    }

    // Depth sort: back-to-front drawing order
    this.engine.sortDepth(renderQueue);

    // Draw all depth-sorted renderables
    for (let i = 0; i < renderQueue.length; i++) {
      renderQueue[i].draw();
    }

    // Restore Camera transform
    this.camera.restoreTransform(ctx);
  }
}

// Bootstrap on DOM readiness
window.addEventListener('DOMContentLoaded', () => {
  window.__samsApp = new SamsVisualiserApp();
});
