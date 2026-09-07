/**
 * SAMS Spatial Agentic Visualiser - Robot Agent Entity
 * Procedural Chibi robot renderer with modular dynamic color masking,
 * delta-time waypoint interpolation, and VisorStateMachine integration.
 */

import { VisorStateMachine, VISOR_STATES } from './VisorStateMachine.js';

export const AGENT_PALETTES = [
  { primary: '#2563eb', dark: '#1d4ed8', name: 'Cobalt Blue' },
  { primary: '#f97316', dark: '#ea580c', name: 'Solar Orange' },
  { primary: '#8b5cf6', dark: '#7c3aed', name: 'Neon Purple' },
  { primary: '#10b981', dark: '#059669', name: 'Emerald Green' },
  { primary: '#ef4444', dark: '#dc2626', name: 'Crimson Red' },
  { primary: '#14b8a6', dark: '#0d9488', name: 'Teal Core' }
];

export class RobotAgent {
  /**
   * @param {Object} config
   * @param {string} config.id - Agent identifier (e.g. 'agent_coder_01')
   * @param {string} [config.name] - Human-readable label
   * @param {number} [config.gridX=6]
   * @param {number} [config.gridY=6]
   * @param {string} [config.primaryColor='#2563eb']
   * @param {string} [config.darkColor='#1d4ed8']
   * @param {string} [config.role='Core Engineer']
   * @param {string} [config.initialState='idle']
   * @param {number} [config.scale=0.45] - Isometric chibi scale
   */
  constructor(config = {}) {
    this.id = config.id || `agent_${Math.random().toString(36).substring(2, 7)}`;
    this.name = config.name || this.id;
    this.role = config.role || 'Autonomous Worker';

    // Position coordinates (grid space)
    this.gridX = config.gridX !== undefined ? config.gridX : 6.0;
    this.gridY = config.gridY !== undefined ? config.gridY : 6.0;
    this.gridZ = 0;

    // Navigation target waypoint
    this.targetGridX = this.gridX;
    this.targetGridY = this.gridY;
    this.moveSpeed = 2.2; // Grid units per second
    this.isMoving = false;

    // Appearance & Coloring
    this.primaryColor = config.primaryColor || '#2563eb';
    this.darkColor = config.darkColor || '#1d4ed8';
    this.scale = config.scale || 0.24; // Real-world chibi architectural scale (~42px height)

    // Visor State Machine
    this.visor = new VisorStateMachine(config.initialState || VISOR_STATES.IDLE);

    // Motion Modes: 'breath', 'hover', 'bounce', 'walk'
    this.motion = 'breath';
    this.taskSummary = 'Standby for commands';
    this.targetZone = 'Corridor';

    // Animation internal counters
    this.animTime = Math.random() * 10;
    this.facingRight = true;
    this.selected = false;
  }

  /**
   * Sets new execution state and target zone from telemetry event.
   * @param {string} state
   * @param {string} [targetZone]
   * @param {string} [summary]
   */
  setExecutionState(state, targetZone, summary) {
    this.visor.setState(state);
    if (targetZone) this.targetZone = targetZone;
    if (summary) this.taskSummary = summary;

    if (state === VISOR_STATES.ACTIVE) {
      this.motion = 'hover';
    } else if (state === VISOR_STATES.SUCCESS) {
      this.motion = 'bounce';
    } else if (state === VISOR_STATES.RESEARCHING) {
      this.motion = 'hover';
    } else {
      this.motion = 'breath';
    }
  }

  /**
   * Dispatches agent to navigate towards grid coordinates.
   * @param {number} x
   * @param {number} y
   */
  moveTo(x, y) {
    this.targetGridX = x;
    this.targetGridY = y;
    this.isMoving = true;
  }

  /**
   * Frame update with delta time.
   * @param {number} dt - Delta time in seconds
   */
  update(dt) {
    this.animTime += dt;
    this.visor.update(dt);

    // Waypoint navigation interpolation
    if (this.isMoving) {
      const dx = this.targetGridX - this.gridX;
      const dy = this.targetGridY - this.gridY;
      const dist = Math.hypot(dx, dy);

      if (dist > 0.05) {
        const step = this.moveSpeed * dt;
        const moveFrac = Math.min(1, step / dist);
        this.gridX += dx * moveFrac;
        this.gridY += dy * moveFrac;

        // Facing direction based on grid velocity
        if (dx - dy > 0.01) this.facingRight = true;
        else if (dx - dy < -0.01) this.facingRight = false;

        this.motion = 'walk';
      } else {
        this.gridX = this.targetGridX;
        this.gridY = this.targetGridY;
        this.isMoving = false;

        // Restore motion according to visor state
        const st = this.visor.currentState;
        if (st === VISOR_STATES.ACTIVE || st === VISOR_STATES.RESEARCHING) {
          this.motion = 'hover';
        } else if (st === VISOR_STATES.SUCCESS) {
          this.motion = 'bounce';
        } else {
          this.motion = 'breath';
        }
      }
    }
  }

  /**
   * Renders the complete Chibi Robot agent onto Canvas 2D at the projected screen position.
   * @param {CanvasRenderingContext2D} ctx
   * @param {{x: number, y: number}} screenPos
   * @param {number} t - Global elapsed time
   */
  render(ctx, screenPos, t) {
    const time = this.animTime;
    ctx.save();
    ctx.translate(screenPos.x, screenPos.y);
    ctx.scale(this.scale, this.scale);

    const cx = 0;
    let cy = -50; // Pivot at feet level
    let bob = 0;
    let armAngle = 0;
    let legWalkPhase = 0;
    let legCompress = 0;

    // Procedural Motion Calculations
    if (this.motion === 'breath') {
      bob = Math.sin(time * 3) * 3;
    } else if (this.motion === 'hover') {
      bob = Math.sin(time * 4) * 10 - 10;
      armAngle = Math.sin(time * 4) * 0.18;
    } else if (this.motion === 'bounce') {
      bob = -Math.abs(Math.sin(time * 6)) * 16;
      armAngle = Math.sin(time * 6) * 0.3;
      if (bob > -2) legCompress = 3;
    } else if (this.motion === 'walk') {
      bob = Math.abs(Math.sin(time * 10)) * 4 - 2;
      legWalkPhase = Math.sin(time * 10) * 8;
      armAngle = Math.sin(time * 10) * 0.35;
    }

    cy += bob;

    // 1. Soft Floor Shadow (expands/contracts with elevation)
    const shadowScale = Math.max(0.4, 1 - (bob / -40));
    ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
    ctx.beginPath();
    ctx.ellipse(cx, 0, 52 * shadowScale, 18 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    // Selection ring highlight if focused
    if (this.selected) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx, 0, 60, 22, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 2. Dual Cylindrical Legs
    const legY = cy + 44;
    ctx.fillStyle = '#1e293b';

    // Left Leg
    ctx.beginPath();
    ctx.roundRect(cx - 28, legY - legCompress - legWalkPhase, 18, 42 + legCompress, 9);
    ctx.fill();

    // Right Leg
    ctx.beginPath();
    ctx.roundRect(cx + 10, legY - legCompress + legWalkPhase, 18, 42 + legCompress, 9);
    ctx.fill();

    // Dark Boots
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(cx - 30, legY + 28 - legWalkPhase, 22, 16, 8);
    ctx.roundRect(cx + 8, legY + 28 + legWalkPhase, 22, 16, 8);
    ctx.fill();

    // 3. Floating Arm Pods (Left & Right)
    // Left Arm
    ctx.save();
    ctx.translate(cx - 52, cy + 16);
    ctx.rotate(-armAngle);
    ctx.fillStyle = this.primaryColor;
    ctx.beginPath();
    ctx.roundRect(-10, -6, 20, 48, 10);
    ctx.fill();
    ctx.fillStyle = this.darkColor;
    ctx.beginPath();
    ctx.arc(0, 36, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right Arm
    ctx.save();
    ctx.translate(cx + 52, cy + 16);
    ctx.rotate(armAngle);
    ctx.fillStyle = this.primaryColor;
    ctx.beginPath();
    ctx.roundRect(-10, -6, 20, 48, 10);
    ctx.fill();
    ctx.fillStyle = this.darkColor;
    ctx.beginPath();
    ctx.arc(0, 36, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 4. Capsule Body (Torso)
    const bodyGrad = ctx.createLinearGradient(cx - 45, cy - 20, cx + 45, cy + 60);
    bodyGrad.addColorStop(0, this.primaryColor);
    bodyGrad.addColorStop(1, this.darkColor);

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.roundRect(cx - 45, cy - 16, 90, 76, 32);
    ctx.fill();

    // Minimalist Chest Plate
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.beginPath();
    ctx.roundRect(cx - 24, cy + 8, 48, 32, 12);
    ctx.fill();

    // 5. Chibi Helmet (116 x 88 px)
    const headY = cy - 70;
    const headGrad = ctx.createLinearGradient(cx - 58, headY - 45, cx + 58, headY + 45);
    headGrad.addColorStop(0, this.primaryColor);
    headGrad.addColorStop(1, this.darkColor);

    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.roundRect(cx - 58, headY - 42, 116, 88, 38);
    ctx.fill();

    // Ear Pods Left & Right
    ctx.fillStyle = this.darkColor;
    ctx.beginPath();
    ctx.roundRect(cx - 64, headY - 14, 8, 28, 4);
    ctx.roundRect(cx + 56, headY - 14, 8, 28, 4);
    ctx.fill();

    // 6. Glossy Black Visor (86 x 54 px)
    const visorW = 86;
    const visorH = 54;
    const visorX = cx - visorW / 2;
    const visorY = headY - 26;

    ctx.fillStyle = '#060911';
    ctx.beginPath();
    ctx.roundRect(visorX, visorY, visorW, visorH, 18);
    ctx.fill();

    // Visor Glass Reflection Highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(visorX + 2, visorY + 2, visorW - 4, visorH - 4, 16);
    ctx.stroke();

    // 7. Render Dynamic Visor Eyes
    this.visor.renderVisorEyes(ctx, cx, visorY + visorH / 2, time);

    // 8. Overhead Agent Floating Badge
    this.renderOverheadBadge(ctx, cx, headY - 60);

    ctx.restore();
  }

  /**
   * Renders agent label badge above the helmet.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x
   * @param {number} y
   */
  renderOverheadBadge(ctx, x, y) {
    const tagText = this.name.toUpperCase();
    ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
    const textW = ctx.measureText(tagText).width;
    const badgeW = Math.max(textW + 20, 58);
    const badgeH = 22;

    // Badge Pill Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
    ctx.beginPath();
    ctx.roundRect(x - badgeW / 2, y - badgeH / 2, badgeW, badgeH, 11);
    ctx.fill();

    // Status Indicator Dot
    const cfg = this.visor.getConfig();
    ctx.fillStyle = cfg.color;
    ctx.shadowColor = cfg.color;
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(x - badgeW / 2 + 10, y, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Badge Label
    ctx.fillStyle = '#f8fafc';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(tagText, x - badgeW / 2 + 18, y);
  }
}
