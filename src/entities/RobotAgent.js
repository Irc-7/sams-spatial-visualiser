/**
 * SAMS Spatial Agentic Visualiser - Robot Agent Entity
 * Neo-Retro Pixel Art Sprites with Crisp Dark Outlines & Stepped Cel-Shading (Gambar 2):
 * - ONLY the Lead Director Robot (Blue at Desk 01) is tall (4-5 heads tall, mecha humanoid)
 * - All other agents are compact chibi / drone workers (2-2.5 heads tall, dark outlines)
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

    // Model type: Director (Tall) vs Chibi (Short)
    this.isDirector = config.isDirector || false;
    this.variant = config.variant || 'chibi'; // 'director' | 'seated_lounge' | 'chibi_antenna' | 'chibi_kanban' | 'chibi_gate' | 'chibi_center'

    // Coordinates
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
    this.taskSummary = config.taskSummary || 'Operating';
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
      this.renderTallDirectorPixelSprite(ctx, time);
    } else if (this.variant === 'seated_lounge') {
      this.renderSeatedLoungePixelSprite(ctx, time);
    } else {
      this.renderChibiWorkerPixelSprite(ctx, time);
    }

    ctx.restore();
  }

  // =========================================================================
  // 1. TALL DIRECTOR ROBOT SPRITE (4 to 5 heads tall, crisp black outlines)
  // =========================================================================
  renderTallDirectorPixelSprite(ctx, time) {
    const bob = Math.sin(time * 3.5) * 1.5;
    const cx = 0;
    const cy = -26 + bob;

    // Floor Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // A. Long Mechanical Legs (Seated posture, knees bent towards desk)
    // Dark joints
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx - 10, cy + 16, 6, 14);
    ctx.fillRect(cx + 4, cy + 16, 6, 14);

    // Blue armored calves with black outline
    ctx.fillStyle = this.primaryColor;
    ctx.fillRect(cx - 11, cy + 22, 7, 14);
    ctx.fillRect(cx + 4, cy + 22, 7, 14);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(cx - 11, cy + 22, 7, 14);
    ctx.strokeRect(cx + 4, cy + 22, 7, 14);

    // B. Elongated Humanoid Torso (Mecha Armor)
    ctx.fillStyle = this.primaryColor;
    ctx.beginPath();
    ctx.roundRect(cx - 9, cy - 6, 18, 24, [4, 4, 2, 2]);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.3;
    ctx.stroke();

    // White Chest Armor Plate
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(cx - 6, cy - 2, 12, 13, 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.stroke();

    // C. Articulated Mecha Arms (Typing pose over keyboard)
    const typeOffset = Math.sin(time * 12) * 1.8;

    // Left Arm
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 13, cy, 4, 12);
    ctx.strokeStyle = '#0f172a';
    ctx.strokeRect(cx - 13, cy, 4, 12);

    ctx.fillStyle = this.primaryColor;
    ctx.fillRect(cx - 13, cy + 10, 8, 3.5);
    ctx.strokeRect(cx - 13, cy + 10, 8, 3.5);

    // Left Hand (White)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx - 5, cy + 12 + typeOffset, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Right Arm
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx + 9, cy, 4, 12);
    ctx.strokeRect(cx + 9, cy, 4, 12);

    ctx.fillStyle = this.primaryColor;
    ctx.fillRect(cx + 5, cy + 10, 8, 3.5);
    ctx.strokeRect(cx + 5, cy + 10, 8, 3.5);

    // Right Hand (White)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx + 5, cy + 12 - typeOffset, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // D. Articulated Neck
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx - 2.5, cy - 10, 5, 4);

    // E. Sleek Mecha Helmet with Crest
    const headY = cy - 24;
    ctx.fillStyle = this.primaryColor;
    ctx.beginPath();
    ctx.roundRect(cx - 10, headY, 20, 16, [5, 5, 3, 3]);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.3;
    ctx.stroke();

    // White Top Crest
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 1.5, headY - 4, 3, 5);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - 1.5, headY - 4, 3, 5);

    // Glossy Visor Screen
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.roundRect(cx - 8, headY + 3, 16, 9, 2.5);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    // Glowing Cyan Eyes
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(cx - 3.5, headY + 7.5, 2, 0, Math.PI * 2);
    ctx.arc(cx + 3.5, headY + 7.5, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // =========================================================================
  // 2. SEATED LOUNGE ROBOT SPRITE (Coral/Red robot in armchair)
  // =========================================================================
  renderSeatedLoungePixelSprite(ctx, time) {
    const cx = 0;
    const cy = -16;

    // Body reclined
    ctx.fillStyle = this.primaryColor;
    ctx.beginPath();
    ctx.roundRect(cx - 8, cy - 2, 16, 18, 4);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // White chest plate
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 5, cy + 1, 10, 10);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - 5, cy + 1, 10, 10);

    // Arms resting on chair armrests
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 12, cy + 2, 4, 12);
    ctx.fillRect(cx + 8, cy + 2, 4, 12);
    ctx.strokeStyle = '#0f172a';
    ctx.strokeRect(cx - 12, cy + 2, 4, 12);
    ctx.strokeRect(cx + 8, cy + 2, 4, 12);

    // Legs
    ctx.fillStyle = this.primaryColor;
    ctx.fillRect(cx - 7, cy + 14, 5, 10);
    ctx.fillRect(cx + 2, cy + 14, 5, 10);
    ctx.strokeStyle = '#0f172a';
    ctx.strokeRect(cx - 7, cy + 14, 5, 10);
    ctx.strokeRect(cx + 2, cy + 14, 5, 10);

    // Head
    const headY = cy - 16;
    ctx.fillStyle = this.primaryColor;
    ctx.beginPath();
    ctx.roundRect(cx - 9, headY, 18, 14, 5);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Side Ears
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx - 11, headY + 3, 2, 5);
    ctx.fillRect(cx + 9, headY + 3, 2, 5);

    // Visor
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.roundRect(cx - 7, headY + 3, 14, 7, 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    // Glowing cyan slit eyes
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 5;
    ctx.fillRect(cx - 5, headY + 5.5, 4, 2);
    ctx.fillRect(cx + 1, headY + 5.5, 4, 2);
    ctx.shadowBlur = 0;
  }

  // =========================================================================
  // 3. CHIBI WORKER SPRITES (Short, 2 to 2.5 heads tall, crisp black outlines)
  // =========================================================================
  renderChibiWorkerPixelSprite(ctx, time) {
    const bob = Math.sin(time * 4) * 1.5;
    const cx = 0;
    const cy = -18 + bob;

    // Floor shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stubby legs with outline
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(cx - 6, cy + 12, 4, 8);
    ctx.fillRect(cx + 2, cy + 12, 4, 8);

    // Torso with black outline
    ctx.fillStyle = this.primaryColor;
    ctx.beginPath();
    ctx.roundRect(cx - 8, cy, 16, 13, 4);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // White chest dot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy + 6, 2, 0, Math.PI * 2);
    ctx.fill();

    // Arms
    if (this.variant === 'chibi_kanban') {
      // Right arm raised pointing to sticky notes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - 10, cy + 1, 3.5, 8);
      ctx.fillRect(cx + 6, cy - 4, 3.5, 9);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - 10, cy + 1, 3.5, 8);
      ctx.strokeRect(cx + 6, cy - 4, 3.5, 9);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - 10, cy + 2, 3.5, 8);
      ctx.fillRect(cx + 6.5, cy + 2, 3.5, 8);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - 10, cy + 2, 3.5, 8);
      ctx.strokeRect(cx + 6.5, cy + 2, 3.5, 8);
    }

    // Large Chibi Head with black outline
    const headY = cy - 17;
    ctx.fillStyle = this.primaryColor;
    ctx.beginPath();
    ctx.roundRect(cx - 11, headY, 22, 17, 6);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.3;
    ctx.stroke();

    // Head Accessories
    if (this.variant === 'chibi_antenna') {
      // Single antenna
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cx - 6, headY - 6, 2, 7);
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(cx - 5, headY - 7, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    } else if (this.variant === 'chibi_gate') {
      // Winglet ear fins
      ctx.fillStyle = '#34d399';
      ctx.beginPath();
      ctx.moveTo(cx - 11, headY + 5);
      ctx.lineTo(cx - 16, headY + 2);
      ctx.lineTo(cx - 11, headY + 9);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 11, headY + 5);
      ctx.lineTo(cx + 16, headY + 2);
      ctx.lineTo(cx + 11, headY + 9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Visor Screen
    const visorW = 16;
    const visorH = 10;
    ctx.fillStyle = '#060911';
    ctx.beginPath();
    ctx.roundRect(cx - visorW / 2, headY + 3.5, visorW, visorH, 3);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.stroke();

    // LED Eyes (Cyan)
    ctx.save();
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 5;

    const vy = headY + 8.5;
    ctx.beginPath();
    ctx.arc(cx - 3.5, vy, 2, 0, Math.PI * 2);
    ctx.arc(cx + 3.5, vy, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
