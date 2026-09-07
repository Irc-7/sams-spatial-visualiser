/**
 * SAMS Spatial Agentic Visualiser - Props Registry
 * Pixel-precise recreation of reference diorama props:
 * 1. Potted Plant & Lounge Armchair with Side Table
 * 2. Industrial Heavy Steel Vault Safe
 * 3. Mobile Whiteboard with Architecture Flowchart on Wheels
 * 4. Wall-Mounted 4-Column Sprint Kanban Board
 * 5. Security Turnstile Gate with RFID Scanner
 * 6. Desk 01: Warm Wooden Desk with Dual Green-Code Monitors, Drawers, Succulent & Chair
 */

export class PropsRegistry {
  /**
   * @param {import('../core/IsometricEngine.js').IsometricEngine} engine
   */
  constructor(engine) {
    this.engine = engine;

    this.props = [
      // 1. Potted Houseplant (Far-left corner)
      {
        id: 'prop_corner_plant',
        type: 'decoration',
        gridX: 0.6,
        gridY: 8.8,
        gridZ: 0,
        render: (ctx, pos, t) => this.renderCornerPlant(ctx, pos, t)
      },

      // 2. Lounge Armchair & Pedestal Side Table
      {
        id: 'prop_lounge_armchair',
        type: 'lounge',
        gridX: 1.0,
        gridY: 6.8,
        gridZ: 0,
        render: (ctx, pos, t) => this.renderLoungeArmchair(ctx, pos, t)
      },

      // 3. The Heavy Steel Safe / Vault (Back-left wall)
      {
        id: 'prop_vault_safe',
        type: 'vault',
        gridX: 0.8,
        gridY: 2.5,
        gridZ: 0,
        badgeLabel: 'Vault',
        badgeIcon: 'shield',
        render: (ctx, pos, t) => this.renderVaultSafe(ctx, pos, t)
      },

      // 4. Mobile Whiteboard on Casters with Architecture Flowchart (Back wall center)
      {
        id: 'prop_mobile_whiteboard',
        type: 'whiteboard',
        gridX: 4.2,
        gridY: 0.5,
        gridZ: 0,
        badgeLabel: 'Whiteboard',
        badgeIcon: 'board',
        render: (ctx, pos, t) => this.renderMobileWhiteboard(ctx, pos, t)
      },

      // 5. Kanban Wall with Sticky Notes (Back wall right)
      {
        id: 'prop_kanban_wall',
        type: 'kanban_wall',
        gridX: 7.8,
        gridY: 0.3,
        gridZ: 0,
        badgeLabel: 'Kanban Wall',
        badgeIcon: 'grid',
        render: (ctx, pos, t) => this.renderKanbanWall(ctx, pos, t)
      },

      // 6. Security Turnstile Gate (Right entry zone)
      {
        id: 'prop_security_gate',
        type: 'security_gate',
        gridX: 8.6,
        gridY: 5.2,
        gridZ: 0,
        badgeLabel: 'Security Gate',
        badgeIcon: 'lock',
        render: (ctx, pos, t) => this.renderSecurityGate(ctx, pos, t)
      },

      // 7. Desk 01 Workstation: Wooden Desk + Dual Monitors + Ergonomic Chair
      {
        id: 'prop_desk_01',
        type: 'desk_01',
        gridX: 4.4,
        gridY: 5.6,
        gridZ: 0,
        badgeLabel: 'Desk 01',
        badgeIcon: 'monitor',
        render: (ctx, pos, t) => this.renderDesk01(ctx, pos, t)
      }
    ];
  }

  getAllProps() {
    return this.props;
  }

  // =========================================================================
  // 1. POTTED HOUSEPLANT (Far left corner)
  // =========================================================================
  renderCornerPlant(ctx, pos, t) {
    // Floor shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.2)';
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + 4, 14, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // White ceramic cylindrical pot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(pos.x - 9, pos.y - 18, 18, 20, [2, 2, 6, 6]);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Pot soil
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y - 17, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Snake plant / Monstera vertical green stalks
    const stalkColors = ['#10b981', '#059669', '#047857', '#34d399'];
    for (let i = 0; i < 5; i++) {
      const sway = Math.sin(t * 1.8 + i) * 1.2;
      const sx = pos.x - 6 + i * 3 + sway;
      const sh = 20 + (i % 3) * 8;
      ctx.fillStyle = stalkColors[i % stalkColors.length];
      ctx.beginPath();
      ctx.ellipse(sx, pos.y - 18 - sh / 2, 2.8, sh / 2, (i - 2) * 0.12, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // =========================================================================
  // 2. LOUNGE ARMCHAIR & PEDESTAL SIDE TABLE
  // =========================================================================
  renderLoungeArmchair(ctx, pos, t) {
    // A. Round Pedestal Side Table (Left of chair)
    const tableX = pos.x - 24;
    const tableY = pos.y + 2;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.18)';
    ctx.beginPath();
    ctx.ellipse(tableX, tableY + 8, 11, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pedestal leg
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(tableX - 2, tableY - 10, 4, 18);

    // Round white tabletop
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(tableX, tableY - 10, 11, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Tiny white ceramic coffee mug on table
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(tableX - 2, tableY - 14, 4, 4);
    ctx.strokeStyle = '#94a3b8';
    ctx.strokeRect(tableX - 2, tableY - 14, 4, 4);

    // B. Minimalist White Cube Armchair
    ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + 10, 26, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Armchair Base / Lower Cushion
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(pos.x - 18, pos.y - 12, 36, 20, 5);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Left Armrest
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(pos.x - 20, pos.y - 20, 8, 22, 3);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.stroke();

    // Right Armrest
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(pos.x + 12, pos.y - 20, 8, 22, 3);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.stroke();

    // Backrest Cushion
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(pos.x - 18, pos.y - 30, 36, 16, 4);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.stroke();
  }

  // =========================================================================
  // 3. THE VAULT / INDUSTRIAL HEAVY STEEL SAFE
  // =========================================================================
  renderVaultSafe(ctx, pos, t) {
    // Floor Drop Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + 12, 32, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    const safeW = 46;
    const safeH = 54;
    const sx = pos.x - safeW / 2;
    const sy = pos.y - safeH + 6;

    // Heavy reinforced steel safe box (industrial dark gray)
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(sx, sy, safeW, safeH, 4);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Front Door Panel Inset (Beveled steel)
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.roundRect(sx + 4, sy + 4, safeW - 8, safeH - 8, 3);
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Side Heavy Steel Hinges (Left side)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(sx + 1, sy + 10, 4, 8);
    ctx.fillRect(sx + 1, sy + safeH - 18, 4, 8);

    // Combination Dial Wheel (Chrome / steel round dial with spokes)
    const dialX = pos.x - 4;
    const dialY = pos.y - 20;

    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(dialX, dialY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Dial spokes
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(dialX, dialY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Locking Lever Handle (Heavy horizontal bar with ball grip)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(dialX + 9, dialY - 2, 11, 4);
    ctx.beginPath();
    ctx.arc(dialX + 20, dialY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Top Rivets / Bolts
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(sx + 6, sy + 6, 2.5, 2.5);
    ctx.fillRect(sx + safeW - 9, sy + 6, 2.5, 2.5);
  }

  // =========================================================================
  // 4. MOBILE WHITEBOARD WITH FLOWCHART ON WHEELS
  // =========================================================================
  renderMobileWhiteboard(ctx, pos, t) {
    const wbW = 82;
    const wbH = 50;
    const bx = pos.x - wbW / 2;
    const by = pos.y - 68;

    // Floor Shadow under caster stand
    ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + 4, 38, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Aluminum Stand Vertical Legs & Caster Feet
    ctx.fillStyle = '#64748b';
    // Left leg
    ctx.fillRect(bx + 10, by + wbH - 4, 4, 20);
    ctx.fillRect(bx + 4, by + wbH + 14, 16, 3); // Left foot
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(bx + 6, by + wbH + 18, 2.5, 0, Math.PI * 2); // Wheel
    ctx.arc(bx + 18, by + wbH + 18, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Right leg
    ctx.fillStyle = '#64748b';
    ctx.fillRect(bx + wbW - 14, by + wbH - 4, 4, 20);
    ctx.fillRect(bx + wbW - 20, by + wbH + 14, 16, 3);
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(bx + wbW - 18, by + wbH + 18, 2.5, 0, Math.PI * 2);
    ctx.arc(bx + wbW - 6, by + wbH + 18, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Whiteboard Frame (Metallic Silver)
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(bx, by, wbW, wbH);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, wbW, wbH);

    // Whiteboard Dry-Erase Gloss Surface
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx + 3, by + 3, wbW - 6, wbH - 6);

    // Architectural System Flowchart (Drawn in clean dark pixel lines)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.2;

    // Flowchart Box 1 (Start/Input block)
    ctx.strokeRect(bx + 8, by + 10, 16, 10);
    ctx.fillStyle = '#e2e8f0'; ctx.fillRect(bx + 9, by + 11, 14, 8);

    // Connecting Arrow 1 -> 2
    ctx.beginPath();
    ctx.moveTo(bx + 24, by + 15);
    ctx.lineTo(bx + 34, by + 15);
    ctx.stroke();

    // Flowchart Box 2 (Core logic decision)
    ctx.strokeRect(bx + 34, by + 8, 20, 14);
    ctx.fillStyle = '#dbeafe'; ctx.fillRect(bx + 35, by + 9, 18, 12);

    // Branching Lines
    ctx.beginPath();
    ctx.moveTo(bx + 44, by + 22);
    ctx.lineTo(bx + 44, by + 30);
    ctx.lineTo(bx + 20, by + 30);
    ctx.lineTo(bx + 20, by + 34);
    ctx.stroke();

    // Flowchart Box 3 (Lower module)
    ctx.strokeRect(bx + 12, by + 34, 18, 9);
    ctx.fillStyle = '#fef3c7'; ctx.fillRect(bx + 13, by + 35, 16, 7);

    // Flowchart Box 4 (Right Output block)
    ctx.beginPath();
    ctx.moveTo(bx + 54, by + 15);
    ctx.lineTo(bx + 62, by + 15);
    ctx.stroke();
    ctx.strokeRect(bx + 62, by + 10, 14, 10);
    ctx.fillStyle = '#dcfce7'; ctx.fillRect(bx + 63, by + 11, 12, 8);

    // Dry-erase marker pen tray at bottom of board
    ctx.fillStyle = '#475569';
    ctx.fillRect(bx + 14, by + wbH - 2, wbW - 28, 2.5);
  }

  // =========================================================================
  // 5. KANBAN WALL (Wall-mounted 4-column sprint board with colorful tickets)
  // =========================================================================
  renderKanbanWall(ctx, pos, t) {
    const kwW = 86;
    const kwH = 54;
    const kx = pos.x - kwW / 2;
    const ky = pos.y - 74;

    // Wall Board Outer Frame (Thin modern aluminum edge)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(kx, ky, kwW, kwH);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(kx, ky, kwW, kwH);

    // Board Drop Shadow on back wall
    ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
    ctx.fillRect(kx + 2, ky + 2, kwW, kwH);

    // 4 Vertical Columns (Backlog, In Progress, Review, Done)
    const colW = (kwW - 10) / 4;
    const columnHeaders = ['#f87171', '#fbbf24', '#818cf8', '#34d399']; // Coral, Yellow, Purple, Mint

    for (let c = 0; c < 4; c++) {
      const cx = kx + 5 + c * colW;

      // Column Header Pill
      ctx.fillStyle = columnHeaders[c];
      ctx.fillRect(cx, ky + 5, colW - 2, 3);

      // Column divider line
      if (c > 0) {
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - 1, ky + 4);
        ctx.lineTo(cx - 1, ky + kwH - 4);
        ctx.stroke();
      }

      // Sticky Notes / Agile Task Cards
      const cardCounts = [3, 4, 3, 2];
      const count = cardCounts[c];
      for (let k = 0; k < count; k++) {
        const cardY = ky + 11 + k * 9.5;
        // Sticky note colors matching screenshot: Coral, Yellow, Purple, Mint
        const notePalette = ['#fed7aa', '#fef08a', '#e9d5ff', '#a7f3d0'];
        ctx.fillStyle = notePalette[(c + k) % notePalette.length];
        ctx.fillRect(cx + 1, cardY, colW - 4, 7.5);

        // Faint card text lines
        ctx.fillStyle = '#475569';
        ctx.fillRect(cx + 2.5, cardY + 2, colW - 7, 1);
        ctx.fillRect(cx + 2.5, cardY + 4.2, colW - 10, 0.8);
      }
    }
  }

  // =========================================================================
  // 6. SECURITY TURNSTILE GATE (RFID Scanner, barrier bar, and glass pylons)
  // =========================================================================
  renderSecurityGate(ctx, pos, t) {
    // Floor shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.22)';
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + 6, 34, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // A. Left RFID Terminal Scanner Pedestal
    const rfidX = pos.x - 18;
    const rfidY = pos.y;
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(rfidX - 5, rfidY - 26, 10, 26, [3, 3, 1, 1]);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.stroke();

    // RFID Reader Screen (Glowing cyan scanner indicator)
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(rfidX - 3, rfidY - 24, 6, 5);

    // B. Middle Turnstile Barrier Bar (Silver chrome arm)
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(rfidX + 5, rfidY - 14, 18, 3.5);
    ctx.strokeStyle = '#64748b';
    ctx.strokeRect(rfidX + 5, rfidY - 14, 18, 3.5);

    // C. Right Security Pylons (Two sleek stainless/glass pylons)
    const pylonX = pos.x + 14;
    for (let p = 0; p < 2; p++) {
      const px = pylonX + p * 10;
      // Stainless post
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.roundRect(px - 3, rfidY - 30, 6, 30, [2, 2, 1, 1]);
      ctx.fill();

      // Translucent security glass fin
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.fillRect(px - 1, rfidY - 28, 2, 24);

      // Top Status LED (Green access dot)
      ctx.fillStyle = '#10b981';
      ctx.fillRect(px - 2, rfidY - 32, 4, 2);
    }
  }

  // =========================================================================
  // 7. DESK 01 (Warm Wooden Desk, Dual Green-Code Monitors, Drawers, Chair)
  // =========================================================================
  renderDesk01(ctx, pos, t) {
    // Floor shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + 16, 54, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    const deskH = 24;
    const dy = pos.y - deskH;

    // A. Warm Medium-Brown Wooden Desk Structure
    // Left Leg Panel
    ctx.fillStyle = '#5c3826'; // Deep walnut
    ctx.fillRect(pos.x - 40, dy + 6, 6, 24);

    // Right Pedestal 3-Drawer Cabinet
    const drawerX = pos.x + 22;
    ctx.fillStyle = '#784323'; // Warm chestnut
    ctx.beginPath();
    ctx.roundRect(drawerX, dy + 4, 18, 26, [0, 0, 3, 3]);
    ctx.fill();
    ctx.strokeStyle = '#5c3826';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 3 Drawer horizontal slots and metallic silver handles
    for (let d = 0; d < 3; d++) {
      const drawerY = dy + 6 + d * 8;
      ctx.strokeStyle = '#452212';
      ctx.strokeRect(drawerX + 1, drawerY, 16, 7);
      // Silver handle
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(drawerX + 6, drawerY + 3, 6, 1.5);
    }

    // Wooden Desk Top Surface (Isometric Diamond Slab)
    ctx.fillStyle = '#9a5c37'; // Rich warm walnut tabletop
    ctx.beginPath();
    ctx.moveTo(pos.x, dy - 18);
    ctx.lineTo(pos.x + 46, dy + 5);
    ctx.lineTo(pos.x, dy + 28);
    ctx.lineTo(pos.x - 46, dy + 5);
    ctx.closePath();
    ctx.fill();

    // Beveled Desk Edge Highlight
    ctx.strokeStyle = '#b8754b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // B. Mini Potted Succulent Plant (Left desk corner)
    const plantDeskX = pos.x - 26;
    const plantDeskY = dy + 2;
    // White tiny pot
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(plantDeskX - 3, plantDeskY - 2, 6, 6);
    // Green succulent rosette
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(plantDeskX, plantDeskY - 4, 4, 0, Math.PI * 2);
    ctx.fill();

    // C. Peripherals: White Keyboard, Mouse, and Mousepad
    const padX = pos.x - 14;
    const padY = dy + 8;
    // Gray mousepad
    ctx.fillStyle = '#475569';
    ctx.fillRect(padX, padY, 32, 14);

    // Slim White Keyboard
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(padX + 2, padY + 2, 20, 9);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(padX + 2, padY + 2, 20, 9);

    // White Mouse
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(padX + 24, padY + 3, 5, 7, 2);
    ctx.fill();

    // D. Dual Side-by-Side Monitors with Green Code Lines
    const monW = 28;
    const monH = 20;

    // Monitor 1 (Left Screen)
    const m1X = pos.x - 20;
    const m1Y = dy - 14;

    // Stand
    ctx.fillStyle = '#64748b';
    ctx.fillRect(m1X - 2, m1Y + monH, 4, 7);
    ctx.fillRect(m1X - 6, m1Y + monH + 6, 12, 2);

    // Bezel
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(m1X - monW / 2, m1Y, monW, monH, 2.5);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Screen: Dark IDE background + Matrix green code
    ctx.fillStyle = '#020617';
    ctx.fillRect(m1X - monW / 2 + 2, m1Y + 2, monW - 4, monH - 4);
    ctx.fillStyle = '#22c55e'; // Bright green syntax code
    for (let l = 0; l < 4; l++) {
      ctx.fillRect(m1X - monW / 2 + 4, m1Y + 4 + l * 3.5, 10 + (l * 4) % 12, 1.2);
    }

    // Monitor 2 (Right Screen)
    const m2X = pos.x + 10;
    const m2Y = dy - 14;

    // Stand
    ctx.fillStyle = '#64748b';
    ctx.fillRect(m2X - 2, m2Y + monH, 4, 7);
    ctx.fillRect(m2X - 6, m2Y + monH + 6, 12, 2);

    // Bezel
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(m2X - monW / 2, m2Y, monW, monH, 2.5);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Screen
    ctx.fillStyle = '#020617';
    ctx.fillRect(m2X - monW / 2 + 2, m2Y + 2, monW - 4, monH - 4);
    ctx.fillStyle = '#22c55e';
    for (let l = 0; l < 4; l++) {
      ctx.fillRect(m2X - monW / 2 + 4, m2Y + 4 + l * 3.5, 8 + (l * 5) % 13, 1.2);
    }

    // E. Ergonomic Office Task Chair (Foreground, facing desk)
    const chairY = pos.y + 18;
    // 5-Star Caster Base
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(pos.x, chairY + 2, 14, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Seat Cushion (Light gray / white)
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.ellipse(pos.x, chairY - 6, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.stroke();

    // Ergonomic Backrest
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(pos.x - 9, chairY - 24, 18, 16, 4);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.stroke();
  }
}
