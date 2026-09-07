/**
 * SAMS Spatial Agentic Visualiser - Props Registry
 * Real-world architectural proportions for 12x12 isometric workspace.
 * Workstations, 42U server racks, 96" whiteboard/kanban, ultrawide compute pods,
 * sectional biophilic lounge, and optical laser turnstiles.
 */

export class PropsRegistry {
  /**
   * @param {import('../core/IsometricEngine.js').IsometricEngine} engine
   */
  constructor(engine) {
    this.engine = engine;

    // Define all static and interactive props with true architectural footprint
    this.props = [
      // 1. Secure Vault & Server Enclave (Grid 1.2, 1.2)
      {
        id: 'prop_vault_servers',
        type: 'vault_enclave',
        gridX: 1.3,
        gridY: 1.3,
        gridZ: 0.25,
        label: 'Air-Gapped Vault 42U Core',
        render: (ctx, screenPos, t) => this.renderVaultEnclave(ctx, screenPos, t)
      },

      // 2. Strategy Wall & Sprint Kanban (Wall on Y=0, X=8.5)
      {
        id: 'prop_strategy_kanban',
        type: 'strategy_wall',
        gridX: 8.5,
        gridY: 0.1,
        gridZ: 0.0,
        label: 'Strategy & Sprint Wall (96")',
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

  getAllProps() {
    return this.props;
  }

  // =========================================================================
  // 1. SECURE VAULT & 42U SERVER RACK ENCLAVE (True 2.0m height proportion)
  // =========================================================================
  renderVaultEnclave(ctx, pos, t) {
    // A. 42U Server Racks (Massive industrial data center cabinets)
    const rackW = 32;
    const rackH = 82; // 2.0m scale in relation to 40px chibi robot
    const rackD = 18;

    // Rack 1 (Left Rack Cabinet)
    const r1X = pos.x - 30;
    const r1Y = pos.y - 10;

    // Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.beginPath();
    ctx.ellipse(r1X + 12, r1Y + 16, 32, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cabinet Main Chassis (Beveled 3D isometric box)
    ctx.fillStyle = '#0b0f19'; // Ultra dark server chassis
    ctx.beginPath();
    ctx.roundRect(r1X - 16, r1Y - rackH, rackW, rackH, [5, 5, 0, 0]);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Top Exhaust Fan Grill
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(r1X - 14, r1Y - rackH + 4, rackW - 4, 6);

    // 42U Blade server slots (10 visible enterprise units)
    for (let i = 0; i < 9; i++) {
      const slotY = r1Y - rackH + 13 + i * 7.2;
      ctx.fillStyle = (i % 2 === 0) ? '#111827' : '#1f2937';
      ctx.fillRect(r1X - 13, slotY, rackW - 6, 5.5);

      // Server activity LEDs & drive caddies
      const blinkA = Math.sin(t * 8 + i * 2) > 0;
      const blinkB = Math.cos(t * 11 + i * 1.5) > 0.2;
      ctx.fillStyle = blinkA ? '#38bdf8' : '#0369a1';
      ctx.fillRect(r1X - 11, slotY + 1.5, 2.5, 2);
      ctx.fillStyle = blinkB ? '#10b981' : '#047857';
      ctx.fillRect(r1X - 6, slotY + 1.5, 2.5, 2);

      // Mini drive bay latch
      ctx.fillStyle = '#475569';
      ctx.fillRect(r1X + 2, slotY + 1.5, 9, 2);
    }

    // Rack 2 (Right Rack Cabinet)
    const r2X = pos.x + 12;
    const r2Y = pos.y - 2;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.beginPath();
    ctx.ellipse(r2X + 12, r2Y + 16, 32, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0b0f19';
    ctx.beginPath();
    ctx.roundRect(r2X - 16, r2Y - rackH, rackW, rackH, [5, 5, 0, 0]);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(r2X - 14, r2Y - rackH + 4, rackW - 4, 6);

    for (let i = 0; i < 9; i++) {
      const slotY = r2Y - rackH + 13 + i * 7.2;
      ctx.fillStyle = (i % 2 === 0) ? '#111827' : '#1f2937';
      ctx.fillRect(r2X - 13, slotY, rackW - 6, 5.5);

      const blink = Math.sin(t * 10 + i * 1.2) > 0;
      ctx.fillStyle = blink ? '#38bdf8' : '#0c4a6e';
      ctx.fillRect(r2X - 11, slotY + 1.5, 2.5, 2);
      ctx.fillStyle = (t % 1 > 0.4) ? '#ef4444' : '#7f1d1d';
      ctx.fillRect(r2X - 6, slotY + 1.5, 2.5, 2);

      ctx.fillStyle = '#475569';
      ctx.fillRect(r2X + 2, slotY + 1.5, 9, 2);
    }

    // Overhead Cable Conduit Ladder
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(r1X, r1Y - rackH - 4);
    ctx.lineTo(r2X + 16, r2Y - rackH - 4);
    ctx.stroke();

    // B. Architectural Glass Partition Enclosure
    ctx.save();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.lineWidth = 1.5;

    // Glass panel boundary
    ctx.beginPath();
    ctx.moveTo(pos.x - 52, pos.y - 75);
    ctx.lineTo(pos.x + 36, pos.y - 32);
    ctx.lineTo(pos.x + 36, pos.y + 18);
    ctx.lineTo(pos.x - 52, pos.y - 25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Aluminium Anodized Corner Columns
    ctx.fillStyle = '#64748b';
    ctx.fillRect(pos.x - 54, pos.y - 28, 4, 46);
    ctx.fillRect(pos.x + 34, pos.y + 16, 4, 4);

    // Neon Accent Line along base of glass
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pos.x - 52, pos.y - 25);
    ctx.lineTo(pos.x + 36, pos.y + 18);
    ctx.stroke();
    ctx.restore();
  }

  // =========================================================================
  // 2. STRATEGY WALL & SPRINT KANBAN (96" Whiteboard: 2.4m architectural scale)
  // =========================================================================
  renderStrategyWall(ctx, pos, t) {
    const wbW = 126; // Spans nearly 3 tiles wide
    const wbH = 58;  // Real-world 1.2m height
    const wbX = pos.x - wbW / 2;
    const wbY = pos.y - 82;

    // Board Drop Shadow on cutaway wall
    ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
    ctx.fillRect(wbX + 4, wbY + 4, wbW, wbH);

    // Brushed Aluminum Frame
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(wbX, wbY, wbW, wbH);

    // Porcelain Gloss Whiteboard Surface
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(wbX + 3, wbY + 3, wbW - 6, wbH - 6);

    // Title Header Strip
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(wbX + 6, wbY + 6, 44, 4);

    // 4-Column Sprint Kanban Board Layout (Backlog, Doing, Testing, Done)
    const colW = (wbW - 16) / 4;
    const colHeaders = ['#f87171', '#fbbf24', '#60a5fa', '#34d399'];

    for (let c = 0; c < 4; c++) {
      const cx = wbX + 8 + c * colW;
      // Column title line
      ctx.fillStyle = colHeaders[c];
      ctx.fillRect(cx, wbY + 13, colW - 3, 2.5);

      // Kanban Sticky Notes
      const numCards = (c === 1 || c === 2) ? 4 : 3;
      for (let k = 0; k < numCards; k++) {
        const ky = wbY + 18 + k * 8.5;
        ctx.fillStyle = (k % 2 === 0) ? '#fef08a' : '#fed7aa';
        ctx.fillRect(cx + 1, ky, colW - 5, 6.5);
        // Note text lines
        ctx.fillStyle = '#475569';
        ctx.fillRect(cx + 2.5, ky + 2, colW - 8, 1.2);
        ctx.fillRect(cx + 2.5, ky + 4, colW - 12, 1);
      }
    }

    // Architecture Diagram Sketch Lines (Right section)
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(wbX + 10, wbY + wbH - 16, 22, 10);
    ctx.rect(wbX + 42, wbY + wbH - 16, 22, 10);
    ctx.moveTo(wbX + 32, wbY + wbH - 11);
    ctx.lineTo(wbX + 42, wbY + wbH - 11);
    ctx.stroke();

    // Marker & Eraser Aluminum Tray at bottom
    ctx.fillStyle = '#475569';
    ctx.fillRect(wbX + 12, wbY + wbH, wbW - 24, 3);
    // Colorful dry-erase pens
    ctx.fillStyle = '#ef4444'; ctx.fillRect(wbX + 20, wbY + wbH - 1, 8, 2);
    ctx.fillStyle = '#2563eb'; ctx.fillRect(wbX + 30, wbY + wbH - 1, 8, 2);
    ctx.fillStyle = '#10b981'; ctx.fillRect(wbX + 40, wbY + wbH - 1, 8, 2);
  }

  // =========================================================================
  // 3. DUAL ISLAND COMPUTE PODS (1.8m x 1.2m Workstation Desk)
  // =========================================================================
  renderComputeIsland(ctx, pos, t, accentColor = '#38bdf8', podLabel = 'POD') {
    // Floor Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + 16, 56, 26, 0, 0, Math.PI * 2);
    ctx.fill();

    // Desk Height: 26px (standard ~75cm table height)
    const deskH = 26;
    const dy = pos.y - deskH;

    // Heavy-duty Steel T-Leg Frames
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(pos.x - 42, dy + 8, 5, 26);
    ctx.fillRect(pos.x + 38, dy + 8, 5, 26);
    ctx.fillRect(pos.x, dy + 22, 5, 18);

    // Desktop Workstation PC Case Tower under desk (with RGB illumination)
    const pcX = pos.x + 22;
    const pcY = dy + 10;
    ctx.fillStyle = '#090d16';
    ctx.fillRect(pcX, pcY, 14, 20);
    ctx.strokeStyle = '#1e293b';
    ctx.strokeRect(pcX, pcY, 14, 20);
    // RGB strip inside PC case
    ctx.fillStyle = accentColor;
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 6;
    ctx.fillRect(pcX + 2, pcY + 4, 2, 12);
    ctx.shadowBlur = 0;

    // Full Workstation Desk Top Surface (Isometric Diamond Slab)
    ctx.fillStyle = '#0f172a'; // Carbon fiber / slate desktop
    ctx.beginPath();
    ctx.moveTo(pos.x, dy - 18);
    ctx.lineTo(pos.x + 48, dy + 6);
    ctx.lineTo(pos.x, dy + 30);
    ctx.lineTo(pos.x - 48, dy + 6);
    ctx.closePath();
    ctx.fill();

    // Desk Perimeter Bevel & Accent LED Edge
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Ergonomic High-Back Mesh Chair (Sized realistically for 40px chibi)
    const chairY = pos.y + 18;
    ctx.fillStyle = '#0f172a'; // 5-star caster base
    ctx.beginPath();
    ctx.ellipse(pos.x, chairY + 2, 14, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Chair Seat Cushion
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(pos.x, chairY - 6, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // High-back Ergonomic Backrest & Headrest
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(pos.x - 10, chairY - 26, 20, 18, 5);
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 49" Curved Ultrawide Monitor (Mounted on heavy gas-spring monitor arm)
    const monX = pos.x;
    const monY = dy - 8;

    // Monitor Arm & Base
    ctx.fillStyle = '#475569';
    ctx.fillRect(monX - 3, monY + 2, 6, 10);
    ctx.fillRect(monX - 10, monY + 11, 20, 3);

    // Curved Monitor Screen Housing
    const monW = 62;
    const monH = 24;
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.roundRect(monX - monW / 2, monY - monH, monW, monH, 4);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Animated Code Scanlines & IDE Buffer on Screen
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(monX - monW / 2 + 3, monY - monH + 2.5, monW - 6, monH - 5, 2);
    ctx.clip();

    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.fill();

    // Matrix/Code scan lines
    const lineOffset = (t * 26) % 18;
    ctx.fillStyle = accentColor;
    for (let l = 0; l < 5; l++) {
      const ly = (monY - monH + 4) + ((l * 4.5 + lineOffset) % (monH - 6));
      const lw = 16 + ((l * 9) % (monW - 14));
      ctx.fillRect(monX - monW / 2 + 5, ly, lw, 1.5);
    }

    // Mini activity pulse light in corner of monitor
    ctx.fillStyle = accentColor;
    ctx.shadowColor = accentColor;
    ctx.shadowBlur = 8;
    ctx.fillRect(monX + monW / 2 - 8, monY - monH + 5, 3.5, 3.5);
    ctx.restore();

    // Mechanical Keyboard & Deskmat
    ctx.fillStyle = '#1e293b'; // Large deskmat
    ctx.fillRect(pos.x - 22, dy + 6, 32, 12);
    ctx.fillStyle = '#475569'; // Keyboard
    ctx.fillRect(pos.x - 18, dy + 8, 20, 8);
    // Mouse
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(pos.x + 4, dy + 9, 4, 6);
  }

  // =========================================================================
  // 4. BIOPHILIC BREAKOUT LOUNGE (2.4m x 2.0m Sectional & Ceramic Flora)
  // =========================================================================
  renderBiophilicLounge(ctx, pos, t) {
    // Floor Shadow
    ctx.fillStyle = 'rgba(6, 78, 59, 0.3)';
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + 18, 62, 28, 0, 0, Math.PI * 2);
    ctx.fill();

    const couchY = pos.y + 4;

    // L-Shaped Sectional Sofa (Main Seating Bench)
    ctx.fillStyle = '#064e3b'; // Deep emerald upholstery
    ctx.beginPath();
    ctx.roundRect(pos.x - 44, couchY - 16, 54, 30, 8);
    ctx.fill();

    // Plush Sofa Seat Cushions
    ctx.fillStyle = '#047857';
    ctx.beginPath();
    ctx.roundRect(pos.x - 42, couchY - 12, 24, 22, 5);
    ctx.roundRect(pos.x - 16, couchY - 12, 24, 22, 5);
    ctx.fill();

    // Sofa Backrest Cushions
    ctx.fillStyle = '#065f46';
    ctx.beginPath();
    ctx.roundRect(pos.x - 44, couchY - 24, 54, 10, 5);
    ctx.fill();

    // Sectional Return Bench (L-Shape Return)
    ctx.fillStyle = '#064e3b';
    ctx.beginPath();
    ctx.roundRect(pos.x - 44, couchY - 44, 26, 30, 7);
    ctx.fill();

    // White Carrera Marble Coffee Table
    const tableX = pos.x + 22;
    const tableY = pos.y + 6;
    ctx.fillStyle = '#0f172a'; // Base shadow
    ctx.beginPath();
    ctx.ellipse(tableX, tableY + 10, 18, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Marble Tabletop
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(tableX, tableY + 2, 18, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Tech Tablet on Table
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(tableX - 6, tableY - 2, 8, 5);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(tableX - 5, tableY - 1, 6, 3);

    // Coffee Mug
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(tableX + 6, tableY + 1, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Tall Ceramic Monstera Planter Pot (1.5m tall real scale)
    const plantX = pos.x + 38;
    const plantY = pos.y - 18;

    // Ceramic Pot
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(plantX - 11, plantY, 22, 22, [3, 3, 8, 8]);
    ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(plantX - 12, plantY, 24, 4);

    // Lush Monstera Tropical Foliage
    ctx.fillStyle = '#10b981';
    for (let leaf = 0; leaf < 6; leaf++) {
      const sway = Math.sin(t * 2 + leaf * 1.1) * 2;
      const angle = (leaf * 55) * Math.PI / 180;
      const lx = plantX + Math.cos(angle) * 16 + sway;
      const ly = plantY - 10 + Math.sin(angle) * 12;

      ctx.beginPath();
      ctx.ellipse(lx, ly, 10, 5.5, angle, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // =========================================================================
  // 5. PERIMETER SPEED-GATE TURNSTILES (Optical Laser Security Stanchions)
  // =========================================================================
  renderPerimeterTurnstiles(ctx, pos, t) {
    const stHeight = 36; // Waist-height standard 1.0m
    const stWidth = 14;

    // Left Stanchion Bollard
    const st1X = pos.x - 24;
    const st1Y = pos.y;
    ctx.fillStyle = '#090d16'; // Deep brushed dark stainless
    ctx.beginPath();
    ctx.roundRect(st1X - stWidth / 2, st1Y - stHeight, stWidth, stHeight, [5, 5, 2, 2]);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // RFID / Biometric Scanner LED Top Plate
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(st1X - 4, st1Y - stHeight + 2, 8, 3);

    // Right Stanchion Bollard
    const st2X = pos.x + 24;
    const st2Y = pos.y;
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.roundRect(st2X - stWidth / 2, st2Y - stHeight, stWidth, stHeight, [5, 5, 2, 2]);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Scanner LED
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(st2X - 4, st2Y - stHeight + 2, 8, 3);

    // Active Optical Security Lasers (Red glowing dual barrier beams)
    ctx.save();
    const laserAlpha = 0.55 + 0.45 * Math.sin(t * 8);
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 10;
    ctx.strokeStyle = `rgba(239, 68, 68, ${laserAlpha})`;
    ctx.lineWidth = 2.5;

    // Beam 1 (Upper beam)
    ctx.beginPath();
    ctx.moveTo(st1X + 7, st1Y - 24);
    ctx.lineTo(st2X - 7, st2Y - 24);
    ctx.stroke();

    // Beam 2 (Lower beam)
    ctx.beginPath();
    ctx.moveTo(st1X + 7, st1Y - 12);
    ctx.lineTo(st2X - 7, st2Y - 12);
    ctx.stroke();
    ctx.restore();

    // Glass Barrier Flap Leaves (Plexiglass barrier gates)
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.lineWidth = 1.2;

    // Wing 1 (Left swing leaf)
    ctx.beginPath();
    ctx.rect(st1X + 5, st1Y - 28, 14, 22);
    ctx.fill();
    ctx.stroke();

    // Wing 2 (Right swing leaf)
    ctx.beginPath();
    ctx.rect(st2X - 19, st2Y - 28, 14, 22);
    ctx.fill();
    ctx.stroke();
  }
}
