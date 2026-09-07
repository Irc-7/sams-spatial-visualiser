/**
 * SAMS Spatial Agentic Visualiser - Main Orchestrator
 * Recreates the exact isometric pixel-art diorama from reference screenshot:
 * - Tall Humanoid Director Robot (Desk 01)
 * - Seated Coral Robot (Lounge Armchair)
 * - 4 Specialized Chibi Worker Robots (Vault, Whiteboard, Kanban, Security Gate)
 * - Floating Frosted Station Badges
 * - 6-Avatar Expression Dock & Telemetry Bridge
 */

import { IsometricEngine } from './core/IsometricEngine.js';
import { Camera } from './core/Camera.js';
import { RoomArchitecture } from './world/RoomArchitecture.js';
import { PropsRegistry } from './world/PropsRegistry.js';
import { WORKSTATION_ZONES, getZoneAtGrid, getWaypointForZone } from './world/Workstations.js';
import { RobotAgent } from './entities/RobotAgent.js';
import { EventBridge } from './network/EventBridge.js';
import { HUDOverlay } from './ui/HUDOverlay.js';
import { DockControls } from './ui/DockControls.js';

class SamsVisualiserApp {
  constructor() {
    this.container = document.getElementById('app-container');
    if (!this.container) {
      throw new Error('Element #app-container not found');
    }

    // 1. Create HTML5 Canvas 2D
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'viewportCanvas';
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d', { alpha: false });

    // 2. Isometric Projection & Camera Engine
    this.engine = new IsometricEngine({
      tileWidth: 54,
      tileHeight: 27,
      elevationFactor: 16
    });

    this.camera = new Camera(this.canvas, {
      zoom: 1.45,
      minZoom: 0.6,
      maxZoom: 3.0
    });

    // 3. Room & Reference Diorama Props
    this.room = new RoomArchitecture(this.engine, { gridSize: 10, wallHeight: 80 });
    this.propsRegistry = new PropsRegistry(this.engine);
    this.props = this.propsRegistry.getAllProps();

    // 4. Roster: Tall Director Robot + Seated Lounge + Chibi Drone Crew
    this.agents = new Map();
    this.initReferenceRoster();

    // 5. User Interface: Floating Station Badges & 6-Avatar Dock
    this.fpsCap = 60;
    this.hoveredTile = null;

    this.hud = new HUDOverlay(this.container, {
      onStationSelect: (stationId) => this.focusStation(stationId)
    });

    this.dock = new DockControls(this.container, {
      onSelectExpression: (state) => this.applyExpressionToAll(state),
      onRecenter: () => this.centerWorkspace(),
      onFpsToggle: (fps) => { this.fpsCap = fps; }
    });

    // 6. Network Bridge & Telemetry
    const urlParams = new URLSearchParams(window.location.search);
    const customEndpoint = urlParams.get('ws') || urlParams.get('sse') || null;

    this.bridge = new EventBridge({
      url: customEndpoint,
      enableMockFallback: true
    });

    this.setupNetworkEvents();

    // 7. Loop Timing & Resize
    this.lastFrameTime = performance.now();
    this.elapsedTime = 0;
    this.frameCount = 0;
    this.lastFpsUpdate = performance.now();

    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());
    this.setupPickingEvents();

    this.centerWorkspace();

    // Start Rendering Loop
    this.tick = this.tick.bind(this);
    requestAnimationFrame(this.tick);
  }

  /**
   * Initializes the exact 6 robot characters from reference mockup.
   */
  initReferenceRoster() {
    // 1. TALL DIRECTOR ROBOT (Desk 01)
    const director = new RobotAgent({
      id: 'director_blue',
      name: 'Lead Director',
      role: 'System Architect & Operator',
      gridX: 4.4,
      gridY: 5.6,
      isDirector: true, // Only director has the tall body
      variant: 'director',
      primaryColor: '#2563eb',
      darkColor: '#1d4ed8',
      initialState: 'active'
    });
    this.agents.set(director.id, director);

    // 2. RED / CORAL SUPERVISOR (Relaxing in Armchair)
    const coral = new RobotAgent({
      id: 'supervisor_coral',
      name: 'Advisor Coral',
      role: 'Relaxed Supervisor',
      gridX: 1.0,
      gridY: 6.8,
      isDirector: false,
      variant: 'seated_lounge',
      primaryColor: '#ef4444',
      darkColor: '#b91c1c',
      initialState: 'active'
    });
    this.agents.set(coral.id, coral);

    // 3. ORANGE CHIBI (Near Vault & Whiteboard with Antenna)
    const orange = new RobotAgent({
      id: 'worker_orange',
      name: 'Vault Inspector',
      role: 'Encryption Auditor',
      gridX: 2.2,
      gridY: 1.8,
      isDirector: false,
      variant: 'chibi_antenna',
      primaryColor: '#f97316',
      darkColor: '#c2410c',
      initialState: 'researching'
    });
    this.agents.set(orange.id, orange);

    // 4. DARK OLIVE GREEN CHIBI (Standing Center Floor)
    const green = new RobotAgent({
      id: 'worker_green',
      name: 'Orchestrator',
      role: 'General Flow Worker',
      gridX: 4.8,
      gridY: 3.4,
      isDirector: false,
      variant: 'chibi_center',
      primaryColor: '#3f6212',
      darkColor: '#1a2e05',
      initialState: 'idle'
    });
    this.agents.set(green.id, green);

    // 5. PURPLE CHIBI (At Kanban Wall with Raised Arm)
    const purple = new RobotAgent({
      id: 'worker_purple',
      name: 'Kanban Scout',
      role: 'Sprint Reconciler',
      gridX: 7.5,
      gridY: 1.4,
      isDirector: false,
      variant: 'chibi_kanban',
      primaryColor: '#8b5cf6',
      darkColor: '#6d28d9',
      initialState: 'active'
    });
    this.agents.set(purple.id, purple);

    // 6. MINT GREEN CHIBI (At Security Gate with Aerodynamic Wings)
    const mint = new RobotAgent({
      id: 'worker_mint',
      name: 'Gatekeeper',
      role: 'Turnstile Sentinel',
      gridX: 8.4,
      gridY: 5.8,
      isDirector: false,
      variant: 'chibi_gate',
      primaryColor: '#10b981',
      darkColor: '#047857',
      initialState: 'success'
    });
    this.agents.set(mint.id, mint);
  }

  setupNetworkEvents() {
    this.bridge.on('connection_change', (conn) => {
      this.hud.setConnectionStatus(conn.state, conn.isMock ? 'MOCK TELEMETRY' : 'LIVE WS');
    });

    this.bridge.on('agent_event', (evt) => {
      const agent = this.agents.get(evt.agent_id);
      if (agent) {
        agent.setExecutionState(evt.state, evt.target_zone, evt.task_summary);
      }
    });
  }

  applyExpressionToAll(state) {
    this.agents.forEach(agent => {
      agent.setExecutionState(state, agent.targetZone, `State changed to ${state}`);
    });
  }

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

  centerWorkspace() {
    const centerScreen = this.engine.gridToScreen(5.0, 5.0, 0);
    this.camera.centerOn(centerScreen.x, centerScreen.y);
  }

  focusStation(stationId) {
    const zone = WORKSTATION_ZONES[stationId.toUpperCase()];
    if (zone) {
      const screenPos = this.engine.gridToScreen(zone.center.x, zone.center.y, 0);
      this.camera.centerOn(screenPos.x, screenPos.y, 1.8);
    }
  }

  setupPickingEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const worldPos = this.camera.screenToWorld(clientX, clientY);
      const gridPos = this.engine.screenToGrid(worldPos.x, worldPos.y);
      const gx = Math.floor(gridPos.x);
      const gy = Math.floor(gridPos.y);

      this.hoveredTile = (gx >= 0 && gx < 10 && gy >= 0 && gy < 10) ? { x: gx, y: gy } : null;

      // Check agent hover
      let foundAgent = null;
      for (const agent of this.agents.values()) {
        const agentScreen = this.engine.gridToScreen(agent.gridX, agent.gridY, agent.gridZ);
        const dist = Math.hypot(worldPos.x - agentScreen.x, worldPos.y - (agentScreen.y - 18));
        if (dist < 22) {
          foundAgent = agent;
          break;
        }
      }

      if (foundAgent) {
        this.hud.showTooltip(clientX, clientY, {
          title: foundAgent.name,
          meta: foundAgent.role.toUpperCase(),
          desc: `Status: ${foundAgent.visor.currentState.toUpperCase()} | ${foundAgent.isDirector ? 'Tall Mecha Model' : 'Chibi Worker'}`
        });
        return;
      }

      // Check zone hover
      const zone = getZoneAtGrid(gridPos.x, gridPos.y);
      if (zone) {
        this.hud.showTooltip(clientX, clientY, {
          title: zone.name,
          meta: `ZONE: ${zone.id.toUpperCase()}`,
          desc: zone.description
        });
        return;
      }

      this.hud.hideTooltip();
    });
  }

  tick(timestamp) {
    requestAnimationFrame(this.tick);

    const elapsedDelta = (timestamp - this.lastFrameTime) / 1000;
    const minFrameInterval = 1 / this.fpsCap;

    if (elapsedDelta < minFrameInterval) return;

    this.lastFrameTime = timestamp;
    const dt = Math.min(elapsedDelta, 0.1);
    this.elapsedTime += dt;

    // FPS
    this.frameCount++;
    if (timestamp - this.lastFpsUpdate >= 1000) {
      const currentFps = (this.frameCount * 1000) / (timestamp - this.lastFpsUpdate);
      this.hud.setFps(currentFps);
      this.frameCount = 0;
      this.lastFpsUpdate = timestamp;
    }

    // Update Camera & Agents
    this.camera.update(dt);
    for (const agent of this.agents.values()) {
      agent.update(dt);
    }

    // Sync floating badges with camera
    this.hud.updateBadgePositions(this.engine, this.camera);

    // Render Canvas Frame
    this.render();
  }

  render() {
    const ctx = this.ctx;
    const w = this.camera.width;
    const h = this.camera.height;

    // Clear background to clean blueprint soft cyan
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(0, 0, w, h);

    // Camera Transform
    this.camera.applyTransform(ctx);

    // 1. Room Walls & Clean Tiled Floor
    this.room.renderPerimeterWalls(ctx);
    this.room.renderFloor(ctx, this.hoveredTile);

    // 2. Depth-sorted Renderables (Props + Robots)
    const renderQueue = [];

    // Add Props
    for (const prop of this.props) {
      const screenPos = this.engine.gridToScreen(prop.gridX, prop.gridY, prop.gridZ || 0);
      renderQueue.push({
        depthKey: this.engine.getDepthKey(prop.gridX, prop.gridY, prop.gridZ || 0, 1),
        draw: () => prop.render(ctx, screenPos, this.elapsedTime)
      });
    }

    // Add Agents
    for (const agent of this.agents.values()) {
      const screenPos = this.engine.gridToScreen(agent.gridX, agent.gridY, agent.gridZ);
      renderQueue.push({
        depthKey: this.engine.getDepthKey(agent.gridX, agent.gridY, agent.gridZ, 2),
        draw: () => agent.render(ctx, screenPos, this.elapsedTime)
      });
    }

    // Sort back-to-front
    this.engine.sortDepth(renderQueue);

    for (let i = 0; i < renderQueue.length; i++) {
      renderQueue[i].draw();
    }

    this.camera.restoreTransform(ctx);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.__samsApp = new SamsVisualiserApp();
});
