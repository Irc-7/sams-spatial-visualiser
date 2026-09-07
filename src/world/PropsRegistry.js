/**
 * SAMS Spatial Agentic Visualiser - Props Registry
 * Procedural Canvas 2D renderers for architectural workstations, server racks, whiteboards,
 * compute pods, biophilic lounge, and optical laser turnstiles.
 */

export class PropsRegistry {
  /**
   * @param {import('../core/IsometricEngine.js').IsometricEngine} engine
   */
  constructor(engine) {
    this.engine = engine;

    // Define all static and interactive props in the 12x12 world
    this.props = [
      // 1. Secure Vault & Server Enclave (around grid 0.5 - 2.5)
      {
        id: 'prop_vault_servers',
        type: 'vault_enclave',
        gridX: 1.2,
        gridY: 1.2,
        gridZ: 0.25,
        width: 2.2,
        length: 2.2,
        height: 48,
        label: 'Air-Gapped Vault Core',
        render: (ctx, screenPos, t) => this.renderVaultEnclave(ctx, screenPos, t)
      },

      // 2. Strategy Wall & Sprint Kanban (Wall-mounted on Y=0, X in 8..11)
      {
        id: 'prop_strategy_kanban',
        type: 'strategy_wall',
        gridX: 8.5,
        gridY: 0.2,
        gridZ: 0.0,
        label: 'Strategy & Sprint Wall',
        render: (ctx, screenPos, t) => this.renderStrategyWall(ctx, screenPos, t)
      },

      // 3. Compute Pod A (Island 1: X=3, Y=5)
      {
        id: 'prop_compute_pod_a',
        type: 'compute_island',
        gridX: 3.0,
        gridY: 5.0,
        gridZ: 0.0,
        podName: 'POD ALPHA',
        accentColor: '#38bdf8',
        render: (ctx, screenPos, t) => this.renderComputeIsland(ctx, screenPos, t, '#38bdf8', 'POD ALPHA')
      },

      // 3b. Compute Pod B (Island 2: X=5, Y=7)
      {
        id: 'prop_compute_pod_b',
        type: 'compute_island',
        gridX: 5.0,
        gridY: 7.0,
        gridZ: 0.0,
        podName: 'POD BETA',
        accentColor: '#a855f7',
        render: (ctx, screenPos, t) => this.renderComputeIsland(ctx, screenPos, t, '#a855f7', 'POD BETA')
      },

      // 4. Biophilic Breakout Lounge (X=2.5, Y=10)
      {
        id: 'prop_lounge_sectional',
        type: 'biophilic_lounge',
        gridX: 2.5,
        gridY: 10.0,
        gridZ: 0.0,
        render: (ctx, screenPos, t) => this.renderBiophilicLounge(ctx, screenPos, t)
      },

      // 5. Perimeter Turnstile Gates (X=10, Y=10)
      {
        id: 'prop_perimeter_turnstiles',
        type: 'perimeter_gates',
        gridX: 10.0,
        gridY: 10.0,
        gridZ: 0.0,
        render: (ctx, screenPos, t) => this.renderPerimeterTurnstiles(ctx, screenPos, t)
      }
    ];
  }

  /**
   * Returns all registered prop objects.
   * @returns {Array<Object>}
   */
  getAllProps() {
    return this.props;
  }

  // ==========================================
  // 1. SECURE VAULT & SERVER ENCLAVE
  // ==========================================
  renderVaultEnclave(ctx, pos, t) {
    const hw = this.engine.halfWidth;
    const hh = this.engine.halfHeight;

    // A. Server Rack 01 (Left Rack)
    const rackW = 22;
    const rackD = 14;
    const rackH = 52;
    const rx = pos.x - 24;
    const ry = pos.y - 12;

    // Rack drop shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.beginPath();
    ctx.ellipse(rx, ry + 16, 26, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rack Cabinet Body
    ctx.fillStyle = '#0f172a'; // Deep obsidian frame
    ctx.beginPath();
    ctx.roundRect(rx - 14, ry - rackH, rackW, rackH, [4, 4, 0, 0]);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Server units (1U / 2U slots)
    for (let i = 0; i < 6; i++) {
      const slotY = ry - rackH + 8 + i * 7;
      ctx.fillStyle = (i % 2 === 0) ? '#1e293b' : '#334155';
      ctx.fillRect(rx - 12, slotY, 18, 5);

      // Blinking LEDs
      const blinkA = Math.sin(t * 8 + i * 2) > 0;
      const blinkB = Math.cos(t * 12 + i) > 0.3;
      ctx.fillStyle = blinkA ? '#38bdf8' : '#0369a1';
      ctx.fillRect(rx - 10, slotY + 1.5, 2, 2);
      ctx.fillStyle = blinkB ? '#10b981' : '#047857';
      ctx.fillRect(rx - 6, slotY + 1.5, 2, 2);
    }

    // B. Server Rack 02 (Right Rack)
    const rx2 = pos.x + 10;
    const ry2 = pos.y - 4;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.beginPath();
    ctx.ellipse(rx2, ry2 + 16, 26, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(rx2 - 14, ry2 - rackH, rackW, rackH, [4, 4, 0, 0]);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    for (let i = 0; i < 6; i++) {
      const slotY = ry2 - rackH + 8 + i * 7;
      ctx.fillStyle = (i % 2 === 0) ? '#1e293b' : '#334155';
      ctx.fillRect(rx2 - 12, slotY, 18, 5);

      const blink = Math.sin(t * 10 + i * 1.5) > 0;
      ctx.fillStyle = blink ? '#38bdf8' : '#0c4a6e';
      ctx.fillRect(rx2 - 10, slotY + 1.5, 2, 2);
      ctx.fillStyle = (t % 1 > 0.5) ? '#ef4444' : '#7f1d1d';
      ctx.fillRect(rx2 - 6, slotY + 1.5, 2, 2);
    }

    // C. Glass Partition Enclosure (Semi-transparent isometric box)
    ctx.save();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 1;

    // Glass panel
    ctx.beginPath();
    ctx.moveTo(pos.x - 38, pos.y - 50);
    ctx.lineTo(pos.x + 28, pos.y - 18);
    ctx.lineTo(pos.x + 28, pos.y + 14);
    ctx.lineTo(pos.x - 38, pos.y - 18);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Glass corner neon accents
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(pos.x - 39, pos.y + 12, 3, 3);
    ctx.fillRect(pos.x + 27, pos.y + 12, 3, 3);
    ctx.restore();
  }

  // ==========================================
  // 2. STRATEGY WALL & SPRINT KANBAN
  // ==========================================
  renderStrategyWall(ctx, pos, t) {
    const wallBaseX = pos.x;
    const wallBaseY = pos.y;

    // Whiteboard Panel mounted to the upper cutaway wall
    const wbW = 68;
    const wbH = 38;
    const wbX = wallBaseX - 34;
    const wbY = wallBaseY - 68;

    // Board Drop Shadow on wall
    ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
    ctx.fillRect(wbX + 3, wbY + 3, wbW, wbH);

    // Aluminum frame
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(wbX, wbY, wbW, wbH);

    // Whiteboard gloss surface
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(wbX + 2, wbY + 2, wbW - 4, wbH - 4);

    // Board Header
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(wbX + 4, wbY + 4, 28, 3);

    // 4-Column Sprint Kanban Board Layout
    const colW = (wbW - 10) / 4;
    const colColors = ['#f87171', '#fbbf24', '#60a5fa', '#34d399']; // Todo, InProg, Review, Done

    for (let c = 0; c < 4; c++) {
      const cx = wbX + 4 + c * colW;
      // Column title line
      ctx.fillStyle = colColors[c];
      ctx.fillRect(cx, wbY + 9, colW - 2, 2);

      // Kanban cards (post-it sticky notes)
      const numCards = (c === 1 || c === 2) ? 3 : 2;
      for (let k = 0; k < numCards; k++) {
        const ky = wbY + 13 + k * 7;
        ctx.fillStyle = (k % 2 === 0) ? '#fef08a' : '#fed7aa';
        ctx.fillRect(cx + 1, ky, colW - 4, 5);
        // Card text lines
        ctx.fillStyle = '#475569';
        ctx.fillRect(cx + 2, ky + 1.5, colW - 6, 1);
      }
    }

    // Architecture diagram sketch lines on left
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.rect(wbX + 6, wbY + wbH - 12, 14, 8);
    ctx.rect(wbX + 26, wbY + wbH - 12, 14, 8);
    ctx.moveTo(wbX + 20, wbY + wbH - 8);
    ctx.lineTo(wbX + 26, wbY + wbH - 8);
    ctx.stroke();

    // Marker pen tray at bottom
    ctx.fillStyle = '#64748b';
    ctx.fillRect(wbX + 8, wbY + wbH, wbW - 16, 2);
  }

  // ==========================================
  // 3. DUAL ISLAND COMPUTE PODS
  // ==========================================
  renderComputeIsland(ctx, pos, t, accentColor = '#38bdf8', podLabel = 'POD') {
    const hw = this.engine.halfWidth;
    const hh = this.engine.halfHeight;

    // Floor Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + 12, 42, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Desk Surface (Isometric Beveled Desk)
    const deskH = 18; // Height above floor
    const dy = pos.y - deskH;

    // Desk Leg Posts (Dark matte steel)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(pos.x - 30, dy + 6, 4, 18);
    ctx.fillRect(pos.x + 26, dy + 6, 4, 18);
    ctx.fillRect(pos.x, dy + 18, 4, 14);

    // Desk Top Panel
    ctx.fillStyle = '#0f172a'; // Slate carbon desk
    ctx.beginPath();
    ctx.moveTo(pos.x, dy - 12);
    ctx.lineTo(pos.x + 36, dy + 4);
    ctx.lineTo(pos.x, dy + 20);
    ctx.lineTo(pos.x - 36, dy + 4);
    ctx.closePath();
    ctx.fill();

    // Desk Edge Bevel Highlight
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Ergonomic Mesh Task Chair (Facing desk)
    const chairY = pos.y + 14;
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(pos.x, chairY, 10, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(pos.x - 8, chairY - 14, 16, 12, 4); // Chair backrest
    ctx.fill();

    // Curved Ultrawide Monitor (Mounted on desk center)
    const monX = pos.x;
    const monY = dy - 6;

    // Monitor Stand
    ctx.fillStyle = '#475569';
    ctx.fillRect(monX - 2, monY, 4, 8);
    ctx.fillRect(monX - 6, monY + 7, 12, 2);

    // Curved Monitor Screen
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.roundRect(monX - 22, monY - 18, 44, 18, 3);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Animated Code Scanlines on Screen
    ctx.save();
    ctx.beginPath();
    ctx.rect(monX - 20, monY - 16, 40, 14);
    ctx.clip();

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fill();

    // Matrix/Code scan lines
    const lineOffset = (t * 24) % 14;
    ctx.fillStyle = accentColor;
    for (let l = 0; l < 4; l++) {
      const ly = monY - 14 + ((l * 4 + lineOffset) % 14);
      const lw = 12 + ((l * 7) % 22);
      ctx.fillRect(monX - 18, ly, lw, 1.2);
    }

    // Mini activity pulse light
    ctx.fillStyle = accentColor;
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 6;
    ctx.fillRect(monX + 14, monY - 14, 3, 3);
    ctx.restore();

    // Keyboard & Trackpad
    ctx.fillStyle = '#334155';
    ctx.fillRect(pos.x - 12, dy + 4, 16, 6);
    ctx.fillRect(pos.x + 8, dy + 5, 5, 4);
  }

  // ==========================================
  // 4. BIOPHILIC BREAKOUT LOUNGE
  // ==========================================
  renderBiophilicLounge(ctx, pos, t) {
    // Floor Shadow
    ctx.fillStyle = 'rgba(6, 78, 59, 0.25)';
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + 14, 46, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // L-Shaped Sectional Sofa (Section A: Main Couch)
    const couchY = pos.y;
    ctx.fillStyle = '#064e3b'; // Deep emerald velvet upholstery
    ctx.beginPath();
    ctx.roundRect(pos.x - 32, couchY - 12, 38, 22, 6);
    ctx.fill();

    // Sofa Cushions
    ctx.fillStyle = '#047857';
    ctx.beginPath();
    ctx.roundRect(pos.x - 30, couchY - 8, 16, 16, 4);
    ctx.roundRect(pos.x - 12, couchY - 8, 16, 16, 4);
    ctx.fill();

    // L-Shaped Return Couch (Section B)
    ctx.fillStyle = '#065f46';
    ctx.beginPath();
    ctx.roundRect(pos.x - 32, couchY - 30, 20, 24, 6);
    ctx.fill();

    // Marble Coffee Table
    const tableX = pos.x + 12;
    const tableY = pos.y;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(tableX, tableY + 8, 14, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // White Carrera Marble Tabletop
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(tableX, tableY + 2, 14, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Coffee mug
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(tableX - 2, tableY - 2, 4, 4);

    // Monstera Plant Divider (Large ceramic planter with organic leaves)
    const plantX = pos.x + 28;
    const plantY = pos.y - 14;

    // Ceramic planter pot
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(plantX - 8, plantY, 16, 16, [2, 2, 6, 6]);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(plantX - 9, plantY, 18, 3);

    // Lush Monstera foliage leaves
    ctx.fillStyle = '#10b981';
    for (let leaf = 0; leaf < 5; leaf++) {
      const sway = Math.sin(t * 2 + leaf) * 1.5;
      const angle = (leaf * 60) * Math.PI / 180;
      const lx = plantX + Math.cos(angle) * 12 + sway;
      const ly = plantY - 8 + Math.sin(angle) * 8;

      ctx.beginPath();
      ctx.ellipse(lx, ly, 7, 4, angle, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ==========================================
  // 5. PERIMETER SPEED-GATE TURNSTILES
  // ==========================================
  renderPerimeterTurnstiles(ctx, pos, t) {
    const hw = this.engine.halfWidth;
    const hh = this.engine.halfHeight;

    // Left Stanchion Bollard
    const st1X = pos.x - 20;
    const st1Y = pos.y;
    ctx.fillStyle = '#0f172a'; // Brushed dark stainless
    ctx.beginPath();
    ctx.roundRect(st1X - 6, st1Y - 26, 12, 26, [4, 4, 2, 2]);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Status beacon LED on left stanchion
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(st1X - 3, st1Y - 24, 6, 2);

    // Right Stanchion Bollard
    const st2X = pos.x + 20;
    const st2Y = pos.y;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(st2X - 6, st2Y - 26, 12, 26, [4, 4, 2, 2]);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Status beacon LED on right stanchion
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(st2X - 3, st2Y - 24, 6, 2);

    // Active Optical Security Lasers (Red / Cyan glowing beam crossing gate)
    ctx.save();
    const laserAlpha = 0.5 + 0.5 * Math.sin(t * 8);
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = `rgba(239, 68, 68, ${laserAlpha})`;
    ctx.lineWidth = 2;

    // Beam 1 (Upper beam)
    ctx.beginPath();
    ctx.moveTo(st1X + 6, st1Y - 16);
    ctx.lineTo(st2X - 6, st2Y - 16);
    ctx.stroke();

    // Beam 2 (Lower beam)
    ctx.beginPath();
    ctx.moveTo(st1X + 6, st1Y - 8);
    ctx.lineTo(st2X - 6, st2Y - 8);
    ctx.stroke();
    ctx.restore();

    // Glass Barrier Flap Leaves (Plexiglass wings)
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    ctx.lineWidth = 1;
    // Wing 1
    ctx.beginPath();
    ctx.rect(st1X + 4, st1Y - 20, 10, 16);
    ctx.fill();
    ctx.stroke();
    // Wing 2
    ctx.beginPath();
    ctx.rect(st2X - 14, st2Y - 20, 10, 16);
    ctx.fill();
    ctx.stroke();
  }
}
