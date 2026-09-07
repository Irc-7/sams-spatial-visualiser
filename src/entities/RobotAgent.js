/**
 * SAMS Spatial Agentic Visualiser - Robot Agent Entity
 * Supports:
 * 1. Tall Humanoid Director Robot (Blue developer at Desk 01, 4-5 heads tall, mecha proportions)
 * 2. Seated Lounge Robot (Red/coral relaxing in armchair)
 * 3. Chibi Worker Robots (Short, 2-2.5 heads tall, antenna, wings, dynamic poses)
 */

import { VisorStateMachine, VISOR_STATES } from './VisorStateMachine.js';

export class RobotAgent {
  /**
   * @param {Object} config
   */
  constructor(config = {}) {
    this.id = config.id || `agent_${Math.random().toString(36).substring(2, 7)}`;
    this.name = config.name || this.id;
    this.role = config.role || 'Worker';

    // Type of model: Director (Tall) vs Chibi (Short)
    this.isDirector = config.isDirector || false;
    this.variant = config.variant || 'chibi'; // 'director' | 'seated_lounge' | 'chibi_antenna' | 'chibi_kanban' | 'chibi_gate' | 'chibi_center'

    // Position coordinates
    this.gridX = config.gridX !== undefined ? config.gridX : 5.0;
    this.gridY = config.gridY !== undefined ? config.gridY : 5.0;
    this.gridZ = 0;

    // Movement
    this.targetGridX = this.gridX;
    this.targetGridY = this.gridY;
    this.moveSpeed = 2.0;
    this.isMoving = false;

    // Colors
    this.primaryColor = config.primaryColor || '#2563eb';
    this.darkColor = config.darkColor || '#1d4ed8';

    // Visor
    this.visor = new VisorStateMachine(config.initialState || VISOR_STATES.ACTIVE);

    // Dynamic state
    this.taskSummary = config.taskSummary || 'Executing operations';
    this.targetZone = config.targetZone || 'Desk 01';
    this.animTime = Math.random() * 10;
    this.selected = false;
  }

  setExecutionState(state, targetZone, summary) {
    this.visor.setState(state);
    if (targetZone) this.targetZone = targetZone;
    if (summary) this.taskSummary = summary;
  }

  moveTo(x, y) {
    this.targetGridX = x;
    this.targetGridY = y;
    this.isMoving = true;
  }

  update(dt) {
    this.animTime += dt;
    this.visor.update(dt);

    if (this.isMoving) {
      const dx = this.targetGridX - this.gridX;
      const dy = this.targetGridY - this.gridY;
      const dist = Math.hypot(dx, dy);

      if (dist > 0.05) {
        const step = this.moveSpeed * dt;
        const frac = Math.min(1, step / dist);
        this.gridX += dx * frac;
        this.gridY += dy * frac;
      } else {
        this.gridX = this.targetGridX;
        this.gridY = this.targetGridY;
        this.isMoving = false;
      }
    }
  }

  render(ctx, screenPos, t) {
    const time = this.animTime;

    ctx.save();
    ctx.translate(screenPos.x, screenPos.y);

    if (this.isDirector) {
      this.renderTallDirector(ctx, time);
    } else if (this.variant === 'seated_lounge') {
      this.renderSeatedLoungeRobot(ctx, time);
    } else {
      this.renderChibiWorker(ctx, time);
    }

    ctx.restore();
  }

  // =========================================================================
  // 1. TALL DIRECTOR ROBOT (4 to 5 heads tall, elongated limbs, desk seated)
  // =========================================================================
  renderTallDirector(ctx, time) {
    const bob = Math.sin(time * 3.5) * 1.5;
    const cx = 0;
    const cy = -26 + bob;

    // Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // A. Long Articulated Legs (Seated posture, knees bent toward desk)
    ctx.fillStyle = '#0f172a'; // Inner mechanical joints
    // Thighs
    ctx.beginPath();
    ctx.roundRect(cx - 10, cy + 16, 6, 14, 2);
    ctx.roundRect(cx + 4, cy + 16, 6, 14, 2);
    ctx.fill();
    // Blue Armored Shins / Calves
    ctx.fillStyle = this.primaryColor;
    ctx.beginPath();
    ctx.roundRect(cx - 11, cy + 24, 7, 14, 2);
    ctx.roundRect(cx + 4, cy + 24, 7, 14, 2);
    ctx.fill();

    // B. Elongated Humanoid Torso (Mecha armor plates)
    ctx.fillStyle = this.primaryColor;
    ctx.beginPath();
    ctx.roundRect(cx - 9, cy - 6, 18, 24, [5, 5, 2, 2]);
    ctx.fill();

    // White Chest Armor Plate
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(cx - 6, cy - 2, 12, 14, 3);
    ctx.fill();

    // C. Articulated Arms (Typing pose on keyboard)
    const typeOffset = Math.sin(time * 12) * 1.8;

    // Left Arm (Reaching forward)
    ctx.fillStyle = this.darkColor;
    ctx.beginPath();
    ctx.roundRect(cx - 13, cy, 4, 14, 2);
    ctx.fill();
    ctx.fillStyle = this.primaryColor;
    ctx.fillRect(cx - 13, cy + 10, 8, 3.5); // Forearm
    // White hand on keyboard
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx - 5, cy + 12 + typeOffset, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Right Arm (Reaching forward)
    ctx.fillStyle = this.darkColor;
    ctx.beginPath();
    ctx.roundRect(cx + 9, cy, 4, 14, 2);
    ctx.fill();
    ctx.fillStyle = this.primaryColor;
    ctx.fillRect(cx + 5, cy + 10, 8, 3.5);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx + 5, cy + 12 - typeOffset, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // D. Articulated Neck
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx - 2.5, cy - 10, 5, 4);

    // E. Tall Sleek Mecha Helmet (Distinct cranial chassis)
    const headY = cy - 24;
    ctx.fillStyle = this.primaryColor;
    ctx.beginPath();
    ctx.roundRect(cx - 10, headY, 20, 16, [6, 6, 4, 4]);
    ctx.fill();

    // White Crest Fin on top of helmet
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 1.5, headY - 4, 3, 5);

    // Glossy Visor Screen
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.roundRect(cx - 8, headY + 3, 16, 9, 3);
    ctx.fill();

    // Cyan glowing director eyes
    const eyeCfg = this.visor.getConfig();
    ctx.fillStyle = eyeCfg.color;
    ctx.shadowColor = eyeCfg.color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(cx - 3.5, headY + 7.5, 2, 0, Math.PI * 2);
    ctx.arc(cx + 3.5, headY + 7.5, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // =========================================================================
  // 2. SEATED LOUNGE ROBOT (Red/Coral supervisor relaxing in armchair)
  // =========================================================================
  renderSeatedLoungeRobot(ctx, time) {
    const cx = 0;
    const cy = -16;

    // Body reclined in armchair
    ctx.fillStyle = this.primaryColor; // Crimson/coral
    ctx.beginPath();
    ctx.roundRect(cx - 8, cy - 2, 16, 18, 4);
    ctx.fill();

    // White chest plate
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 5, cy + 1, 10, 10);

    // Relaxed arms resting on chair armrests
    ctx.fillStyle = this.darkColor;
    ctx.beginPath();
    ctx.roundRect(cx - 12, cy + 2, 4, 12, 2);
    ctx.roundRect(cx + 8, cy + 2, 4, 12, 2);
    ctx.fill();

    // Legs bent forward
    ctx.fillStyle = this.primaryColor;
    ctx.beginPath();
    ctx.roundRect(cx - 7, cy + 14, 5, 10, 2);
    ctx.roundRect(cx + 2, cy + 14, 5, 10, 2);
    ctx.fill();

    // Head with antenna ears
    const headY = cy - 16;
    ctx.fillStyle = this.primaryColor;
    ctx.beginPath();
    ctx.roundRect(cx - 9, headY, 18, 14, 5);
    ctx.fill();

    // Side Antenna Ears
    ctx.fillStyle = this.darkColor;
    ctx.fillRect(cx - 11, headY + 3, 2, 5);
    ctx.fillRect(cx + 9, headY + 3, 2, 5);

    // Visor with glowing cyan slit eyes
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.roundRect(cx - 7, headY + 3, 14, 7, 2.5);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 5;
    ctx.fillRect(cx - 5, headY + 5.5, 4, 2);
    ctx.fillRect(cx + 1, headY + 5.5, 4, 2);
    ctx.shadowBlur = 0;
  }

  // =========================================================================
  // 3. CHIBI WORKER ROBOTS (Compact 2-2.5 heads tall, cute & modular)
  // =========================================================================
  renderChibiWorker(ctx, time) {
    const bob = Math.sin(time * 4) * 1.5;
    const cx = 0;
    const cy = -18 + bob;

    // Floor shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stubby legs
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(cx - 6, cy + 12, 4, 8, 2);
    ctx.roundRect(cx + 2, cy + 12, 4, 8, 2);
    ctx.fill();

    // Compact Torso
    ctx.fillStyle = this.primaryColor;
    ctx.beginPath();
    ctx.roundRect(cx - 8, cy, 16, 13, 5);
    ctx.fill();

    // Center chest dot/accent
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy + 6, 2, 0, Math.PI * 2);
    ctx.fill();

    // Arms based on variant
    if (this.variant === 'chibi_kanban') {
      // Right arm raised pointing at sticky note
      ctx.fillStyle = this.darkColor;
      ctx.beginPath();
      ctx.roundRect(cx - 10, cy + 1, 3.5, 8, 1.5);
      ctx.fill();
      // Raised right arm
      ctx.beginPath();
      ctx.roundRect(cx + 6, cy - 4, 3.5, 9, 1.5);
      ctx.fill();
    } else {
      // Normal cute floating side arms
      ctx.fillStyle = this.darkColor;
      ctx.beginPath();
      ctx.roundRect(cx - 10, cy + 2, 3.5, 8, 1.5);
      ctx.roundRect(cx + 6.5, cy + 2, 3.5, 8, 1.5);
      ctx.fill();
    }

    // Large Chibi Pill Head
    const headY = cy - 17;
    ctx.fillStyle = this.primaryColor;
    ctx.beginPath();
    ctx.roundRect(cx - 11, headY, 22, 17, 7);
    ctx.fill();

    // Head accessories according to variant
    if (this.variant === 'chibi_antenna') {
      // Left-side tall single antenna
      ctx.fillStyle = '#64748b';
      ctx.fillRect(cx - 6, headY - 6, 2, 7);
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx - 5, headY - 7, 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.variant === 'chibi_gate') {
      // Aerodynamic side winglets / ear fins
      ctx.fillStyle = '#34d399';
      ctx.beginPath();
      ctx.moveTo(cx - 11, headY + 6);
      ctx.lineTo(cx - 16, headY + 3);
      ctx.lineTo(cx - 11, headY + 10);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(cx + 11, headY + 6);
      ctx.lineTo(cx + 16, headY + 3);
      ctx.lineTo(cx + 11, headY + 10);
      ctx.closePath();
      ctx.fill();
    }

    // Visor Screen
    const visorW = 16;
    const visorH = 10;
    ctx.fillStyle = '#060911';
    ctx.beginPath();
    ctx.roundRect(cx - visorW / 2, headY + 3.5, visorW, visorH, 3.5);
    ctx.fill();

    // Render LED Visor Eyes
    this.renderChibiEyes(ctx, cx, headY + 8.5, time);
  }

  renderChibiEyes(ctx, vx, vy, t) {
    ctx.save();
    const cfg = this.visor.getConfig();
    ctx.fillStyle = cfg.color;
    ctx.shadowColor = cfg.color;
    ctx.shadowBlur = 5;

    const st = this.visor.currentState;

    if (st === VISOR_STATES.ACTIVE) {
      // Large circular/oval eyes
      ctx.beginPath();
      ctx.arc(vx - 3.5, vy, 2, 0, Math.PI * 2);
      ctx.arc(vx + 3.5, vy, 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (st === VISOR_STATES.RESEARCHING) {
      // Horizontal slit eyes
      ctx.fillRect(vx - 5, vy - 1, 4, 2);
      ctx.fillRect(vx + 1, vy - 1, 4, 2);
    } else if (st === VISOR_STATES.ERROR) {
      // X X glitch
      ctx.font = '800 8px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('x', vx - 3.5, vy);
      ctx.fillText('x', vx + 3.5, vy);
    } else if (st === VISOR_STATES.OFFLINE) {
      // Flat dashes
      ctx.fillRect(vx - 5, vy, 4, 1.2);
      ctx.fillRect(vx + 1, vy, 4, 1.2);
    } else if (st === VISOR_STATES.SUCCESS) {
      // Smile arcs ^ ^
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = cfg.color;
      ctx.beginPath();
      ctx.arc(vx - 3.5, vy + 1, 2, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(vx + 3.5, vy + 1, 2, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
    } else {
      // Idle: Vertical oval eyes
      ctx.beginPath();
      ctx.roundRect(vx - 4.5, vy - 2, 2.5, 4, 1);
      ctx.roundRect(vx + 2, vy - 2, 2.5, 4, 1);
      ctx.fill();
    }

    ctx.restore();
  }
}
