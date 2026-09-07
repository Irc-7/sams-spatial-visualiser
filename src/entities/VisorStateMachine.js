/**
 * SAMS Spatial Agentic Visualiser - Visor State Machine
 * Manages LED eye patterns, blink timers, neon glow shaders, and procedural visor states.
 */

export const VISOR_STATES = {
  ACTIVE: 'active',
  IDLE: 'idle',
  RESEARCHING: 'researching',
  ERROR: 'error',
  OFFLINE: 'offline',
  SUCCESS: 'success'
};

export const VISOR_CONFIGS = {
  active: {
    color: '#38bdf8', // Bright Cyan
    blur: 14,
    description: 'Autonomous execution in progress'
  },
  idle: {
    color: '#38bdf8', // Default Cyan
    blur: 10,
    description: 'Standby / Ready for dispatch'
  },
  researching: {
    color: '#fb923c', // Electric Amber / Orange
    blur: 14,
    description: 'Deep retrieval & vector index search'
  },
  error: {
    color: '#ef4444', // Alert Red
    blur: 16,
    description: 'Execution fault / Exception trapped'
  },
  offline: {
    color: '#475569', // Dim Muted Slate
    blur: 0,
    description: 'Disconnected / Sleep mode'
  },
  success: {
    color: '#34d399', // Emerald Neon
    blur: 14,
    description: 'Task objective accomplished'
  }
};

export class VisorStateMachine {
  /**
   * @param {string} [initialState='idle']
   */
  constructor(initialState = 'idle') {
    this.currentState = initialState;
    this.blinkInterval = 3.5; // Seconds between natural blink cycles
    this.blinkDuration = 0.14; // Blink close duration
    this.blinkTimer = Math.random() * this.blinkInterval;
    this.isBlinking = false;
    this.glitchSeed = 0;
  }

  /**
   * Transitions visor to a new state.
   * @param {string} newState
   */
  setState(newState) {
    if (VISOR_CONFIGS[newState]) {
      this.currentState = newState;
    }
  }

  /**
   * Gets current state configuration.
   * @returns {{color: string, blur: number, description: string}}
   */
  getConfig() {
    return VISOR_CONFIGS[this.currentState] || VISOR_CONFIGS.idle;
  }

  /**
   * Updates state timer, natural blink interpolation, and random micro-jitters.
   * @param {number} dt - Delta time in seconds
   */
  update(dt) {
    this.blinkTimer += dt;
    if (this.blinkTimer >= this.blinkInterval) {
      this.isBlinking = true;
      if (this.blinkTimer >= this.blinkInterval + this.blinkDuration) {
        this.isBlinking = false;
        this.blinkTimer = 0;
      }
    } else {
      this.isBlinking = false;
    }

    if (this.currentState === VISOR_STATES.ERROR) {
      this.glitchSeed = Math.random();
    }
  }

  /**
   * Renders the visor LED eye graphics directly onto Canvas 2D.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} vx - Visor center X
   * @param {number} vy - Visor center Y
   * @param {number} t - Current elapsed time in seconds
   */
  renderVisorEyes(ctx, vx, vy, t) {
    const config = this.getConfig();
    ctx.save();

    // Neon Glow filter
    ctx.shadowColor = config.color;
    ctx.shadowBlur = config.blur;
    ctx.fillStyle = config.color;
    ctx.strokeStyle = config.color;

    const eyeSpacing = 16;
    const eyeW = 10;
    const eyeH = 20;

    // 1. IDLE STATE: Dual vertical capsules with automatic 3.5s natural blink
    if (this.currentState === VISOR_STATES.IDLE) {
      let currentEyeH = eyeH;
      if (this.isBlinking) {
        currentEyeH = 2; // Flat slit blink
      }
      ctx.beginPath();
      ctx.roundRect(vx - eyeSpacing - eyeW / 2, vy - currentEyeH / 2, eyeW, currentEyeH, 5);
      ctx.roundRect(vx + eyeSpacing - eyeW / 2, vy - currentEyeH / 2, eyeW, currentEyeH, 5);
      ctx.fill();

    // 2. ACTIVE STATE: Bright cyan large capsule eyes
    } else if (this.currentState === VISOR_STATES.ACTIVE) {
      ctx.beginPath();
      ctx.roundRect(vx - eyeSpacing - 7, vy - 12, 14, 24, 6);
      ctx.roundRect(vx + eyeSpacing - 7, vy - 12, 14, 24, 6);
      ctx.fill();

      // Subtle high-intensity center pupil glow
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(vx - eyeSpacing, vy - 3, 3, 0, Math.PI * 2);
      ctx.arc(vx + eyeSpacing, vy - 3, 3, 0, Math.PI * 2);
      ctx.fill();

    // 3. RESEARCHING STATE: Dual animated scanning bars moving along vertical axis
    } else if (this.currentState === VISOR_STATES.RESEARCHING) {
      const scanY = Math.sin(t * 6) * 4;
      const barW = 16;
      const barH = 4;

      ctx.beginPath();
      // Left eye scanner dual bars
      ctx.roundRect(vx - eyeSpacing - barW / 2, vy - 7 + scanY, barW, barH, 2);
      ctx.roundRect(vx - eyeSpacing - barW / 2, vy + 3 - scanY, barW, barH, 2);
      // Right eye scanner dual bars
      ctx.roundRect(vx + eyeSpacing - barW / 2, vy - 7 + scanY, barW, barH, 2);
      ctx.roundRect(vx + eyeSpacing - barW / 2, vy + 3 - scanY, barW, barH, 2);
      ctx.fill();

    // 4. ERROR STATE: Red glitching X X characters with 2px micro-jitter
    } else if (this.currentState === VISOR_STATES.ERROR) {
      ctx.font = '800 16px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const jitterX = (this.glitchSeed > 0.65) ? (Math.random() * 4 - 2) : 0;
      const jitterY = (this.glitchSeed > 0.8) ? (Math.random() * 2 - 1) : 0;

      ctx.fillText('X', vx - eyeSpacing + jitterX, vy + jitterY);
      ctx.fillText('X', vx + eyeSpacing - jitterX, vy - jitterY);

    // 5. OFFLINE STATE: Dim horizontal dashes without neon blur
    } else if (this.currentState === VISOR_STATES.OFFLINE) {
      const dashW = 14;
      const dashH = 3;
      ctx.fillRect(vx - eyeSpacing - dashW / 2, vy - dashH / 2, dashW, dashH);
      ctx.fillRect(vx + eyeSpacing - dashW / 2, vy - dashH / 2, dashW, dashH);

    // 6. SUCCESS STATE: Inverted emerald arc smile eyes (^ ^)
    } else if (this.currentState === VISOR_STATES.SUCCESS) {
      ctx.lineWidth = 3.5;
      ctx.lineCap = 'round';

      // Left eye smile arc
      ctx.beginPath();
      ctx.arc(vx - eyeSpacing, vy + 2, 7, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      // Right eye smile arc
      ctx.beginPath();
      ctx.arc(vx + eyeSpacing, vy + 2, 7, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    }

    ctx.restore();
  }
}
