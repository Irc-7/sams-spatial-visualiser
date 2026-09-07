/**
 * SAMS Spatial Agentic Visualiser - Props Registry
 * Neo-Retro Isometric Pixel Art Workstation Props (Matching Gambar 2):
 * 1. Potted Houseplant & White Cube Armchair with Round Side Table
 * 2. Heavy Industrial Steel Safe / Vault with 3-Spoke Dial Wheel
 * 3. Mobile Whiteboard on Casters with System Architecture Flowchart
 * 4. Wall-Mounted 4-Column Sprint Kanban Board with Sticky Notes
 * 5. Automated Security Turnstile Gate with RFID Scanner
 * 6. Desk 01: Warm Walnut Desk, Dual Green-Code Monitors, 3 Drawers, Succulent & Chair
 */

export class PropsRegistry {
  /**
   * @param {import('../core/IsometricEngine.js').IsometricEngine} engine
   */
  constructor(engine) {
    this.engine = engine;

    this.props = [
      // 1. Potted Plant (Far-left corner)
      {
        id: 'prop_corner_plant',
        type: 'decoration',
        gridX: 0.6,
        gridY: 8.8,
        gridZ: 0,
        render: (ctx, pos, t) => this.renderCornerPlant(ctx, pos, t)
      },

      // 2. Lounge Armchair & Pedestal Coffee Table
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

      // 4. Mobile Whiteboard on Casters with Flowchart (Back wall center)
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

      // 6. Security Turnstile Gate (Right entrance zone)
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

      // 7. Desk 01: Warm Wooden Desk, Dual Monitors, 3 Drawers, Succulent & Chair
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
    // Pixel drop shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + 4, 13, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // White ceramic cylindrical pot with crisp outline
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(pos.x - 9, pos.y - 18, 18, 20, [2, 2, 5, 5]);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.3;
    ctx.stroke();

    // Pot rim & soil
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y - 17, 7.5, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Vertical spiky foliage (Sansevieria snake plant stalks)
    const leaves = [
      { dx: -5, h: 26, color: '#047857', border: '#065f46' },
      { dx: -2, h: 32, color: '#10b981', border: '#047857' },
      { dx: 2,  h: 28, color: '#059669', border: '#065f46' },
      { dx: 5,  h: 22, color: '#34d399', border: '#059669' }
    ];

    leaves.forEach(leaf => {
      const ly = pos.y - 18 - leaf.h;
      ctx.fillStyle = leaf.color;
      ctx.beginPath();
      ctx.ellipse(pos.x + leaf.dx, pos.y - 18 - leaf.h / 2, 2.8, leaf.h / 2, leaf.dx * 0.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  // =========================================================================
  // 2. LOUNGE ARMCHAIR & PEDESTAL SIDE TABLE
  // =========================================================================
  renderLoungeArmchair(ctx, pos, t) {
    // A. Round Pedestal Side Table (Left of chair)
    const tx = pos.x - 24;
    const ty = pos.y + 2;

    // Table shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
    ctx.beginPath();
    ctx.ellipse(tx, ty + 8, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Pedestal stem
    ctx.fillStyle = '#64748b';
    ctx.fillRect(tx - 2, ty - 10, 4, 18);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.strokeRect(tx - 2, ty - 10, 4, 18);

    // Round White Tabletop
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(tx, ty - 10, 11, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // White Ceramic Coffee Mug on Table
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(tx - 2.5, ty - 15, 5, 5);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.strokeRect(tx - 2.5, ty - 15, 5, 5);

    // B. Minimalist White Cube Armchair
    ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + 10, 24, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Armchair Base / Lower Seat Box
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(pos.x - 18, pos.y - 12, 36, 20, 4);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.3;
    ctx.stroke();

    // Left Armrest
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(pos.x - 20, pos.y - 20, 8, 22, 3);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Right Armrest
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(pos.x + 12, pos.y - 20, 8, 22, 3);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Backrest Cushion
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(pos.x - 18, pos.y - 30, 36, 16, 4);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.3;
    ctx.stroke();
  }

  // =========================================================================
  // 3. THE HEAVY STEEL SAFE / VAULT WITH 3-SPOKE DIAL WHEEL
  // =========================================================================
  renderVaultSafe(ctx, pos, t) {
    // Sharp pixel drop shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.38)';
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + 12, 30, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    const safeW = 46;
    const safeH = 54;
    const sx = pos.x - safeW / 2;
    const sy = pos.y - safeH + 6;

    // Heavy reinforced steel safe cabinet (Dark charcoal industrial)
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(sx, sy, safeW, safeH, 4);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Inset Door Panel
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.roundRect(sx + 4, sy + 4, safeW - 8, safeH - 8, 3);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Heavy Side Hinges (Left)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(sx + 1, sy + 10, 4, 8);
    ctx.fillRect(sx + 1, sy + safeH - 18, 4, 8);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.strokeRect(sx + 1, sy + 10, 4, 8);
    ctx.strokeRect(sx + 1, sy + safeH - 18, 4, 8);

    // Combination Dial Wheel with 3 Spokes (Chrome)
    const dialX = pos.x - 4;
    const dialY = pos.y - 20;

    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(dialX, dialY, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // 3 Spokes Wheel Handle
    ctx.fillStyle = '#0f172a';
    for (let s = 0; s < 3; s++) {
      const angle = (s * 120 + 30) * Math.PI / 180;
      ctx.beginPath();
      ctx.moveTo(dialX, dialY);
      ctx.lineTo(dialX + Math.cos(angle) * 7.5, dialY + Math.sin(angle) * 7.5);
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    // Center cap
    ctx.beginPath();
    ctx.arc(dialX, dialY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Locking Lever Handle (Horizontal steel bar extending to the right)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(dialX + 9, dialY - 2, 12, 4);
    ctx.beginPath();
    ctx.arc(dialX + 21, dialY, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.strokeRect(dialX + 9, dialY - 2, 12, 4);
  }

  // =========================================================================
  // 4. MOBILE WHITEBOARD WITH FLOWCHART ON WHEELS
  // =========================================================================
  renderMobileWhiteboard(ctx, pos, t) {
    const wbW = 82;
    const wbH = 50;
    const bx = pos.x - wbW / 2;
    const by = pos.y - 68;

    // Floor shadow under stand
    ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + 4, 36, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // A. Metal Frame Legs & Caster Wheels
    ctx.fillStyle = '#475569';
    // Left Leg
    ctx.fillRect(bx + 10, by + wbH - 3, 4, 20);
    ctx.fillRect(bx + 4, by + wbH + 15, 16, 3);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx + 10, by + wbH - 3, 4, 20);
    ctx.strokeRect(bx + 4, by + wbH + 15, 16, 3);

    // Left wheels
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(bx + 6, by + wbH + 19, 2.5, 0, Math.PI * 2);
    ctx.arc(bx + 18, by + wbH + 19, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Right Leg
    ctx.fillStyle = '#475569';
    ctx.fillRect(bx + wbW - 14, by + wbH - 3, 4, 20);
    ctx.fillRect(bx + wbW - 20, by + wbH + 15, 16, 3);
    ctx.strokeRect(bx + wbW - 14, by + wbH - 3, 4, 20);
    ctx.strokeRect(bx + wbW - 20, by + wbH + 15, 16, 3);

    // Right wheels
    ctx.beginPath();
    ctx.arc(bx + wbW - 18, by + wbH + 19, 2.5, 0, Math.PI * 2);
    ctx.arc(bx + wbW - 6, by + wbH + 19, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // B. Whiteboard Surface with Crisp Outer Frame
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(bx, by, wbW, wbH);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.4;
    ctx.strokeRect(bx, by, wbW, wbH);

    // Inner Aluminum Border Trim
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx + 2, by + 2, wbW - 4, wbH - 4);

    // C. System Architecture Flowchart (Pixel-art flowchart blocks)
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = '#0f172a';

    // Block 1 (Input)
    ctx.fillStyle = '#dbeafe';
    ctx.fillRect(bx + 8, by + 10, 16, 10);
    ctx.strokeRect(bx + 8, by + 10, 16, 10);

    // Connecting line 1 -> 2
    ctx.beginPath();
    ctx.moveTo(bx + 24, by + 15);
    ctx.lineTo(bx + 34, by + 15);
    ctx.stroke();

    // Block 2 (Central Core)
    ctx.fillStyle = '#e0e7ff';
    ctx.fillRect(bx + 34, by + 8, 20, 14);
    ctx.strokeRect(bx + 34, by + 8, 20, 14);

    // Branch down to Block 3
    ctx.beginPath();
    ctx.moveTo(bx + 44, by + 22);
    ctx.lineTo(bx + 44, by + 30);
    ctx.lineTo(bx + 20, by + 30);
    ctx.lineTo(bx + 20, by + 34);
    ctx.stroke();

    // Block 3 (Submodule)
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(bx + 12, by + 34, 18, 9);
    ctx.strokeRect(bx + 12, by + 34, 18, 9);

    // Arrow to Block 4 (Output)
    ctx.beginPath();
    ctx.moveTo(bx + 54, by + 15);
    ctx.lineTo(bx + 62, by + 15);
    ctx.stroke();

    ctx.fillStyle = '#dcfce7';
    ctx.fillRect(bx + 62, by + 10, 14, 10);
    ctx.strokeRect(bx + 62, by + 10, 14, 10);

    // Marker pen tray
    ctx.fillStyle = '#334155';
    ctx.fillRect(bx + 12, by + wbH - 2, wbW - 24, 2.5);
  }

  // =========================================================================
  // 5. KANBAN WALL (Wall-mounted 4-column sprint board with sticky notes)
  // =========================================================================
  renderKanbanWall(ctx, pos, t) {
    const kwW = 86;
    const kwH = 54;
    const kx = pos.x - kwW / 2;
    const ky = pos.y - 74;

    // Wall Board Outer Frame (Crisp black outline)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(kx, ky, kwW, kwH);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.4;
    ctx.strokeRect(kx, ky, kwW, kwH);

    // 4 Vertical Columns (Backlog, In Progress, Review, Done)
    const colW = (kwW - 10) / 4;
    const headers = ['#f87171', '#fbbf24', '#818cf8', '#34d399'];

    for (let c = 0; c < 4; c++) {
      const cx = kx + 5 + c * colW;

      // Column Header Pill
      ctx.fillStyle = headers[c];
      ctx.fillRect(cx, ky + 5, colW - 2, 3.5);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(cx, ky + 5, colW - 2, 3.5);

      // Column divider line
      if (c > 0) {
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - 1, ky + 4);
        ctx.lineTo(cx - 1, ky + kwH - 4);
        ctx.stroke();
      }

      // Sticky Notes (Peach, Yellow, Purple, Mint)
      const counts = [3, 4, 3, 2];
      const noteColors = ['#fed7aa', '#fef08a', '#e9d5ff', '#a7f3d0'];

      for (let k = 0; k < counts[c]; k++) {
        const cardY = ky + 11 + k * 9.5;
        ctx.fillStyle = noteColors[(c + k) % noteColors.length];
        ctx.fillRect(cx + 1, cardY, colW - 4, 7.5);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 0.8;
        ctx.strokeRect(cx + 1, cardY, colW - 4, 7.5);

        // Card text lines
        ctx.fillStyle = '#475569';
        ctx.fillRect(cx + 2.5, cardY + 2.2, colW - 7, 1);
      }
    }
  }

  // =========================================================================
  // 6. SECURITY TURNSTILE GATE (RFID Terminal, Barrier, and Pylons)
  // =========================================================================
  renderSecurityGate(ctx, pos, t) {
    // Floor shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.28)';
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + 6, 32, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // A. Left RFID Terminal Scanner Pedestal
    const rfidX = pos.x - 18;
    const rfidY = pos.y;
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(rfidX - 5, rfidY - 26, 10, 26, [3, 3, 1, 1]);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.3;
    ctx.stroke();

    // Glowing Cyan Scanner Indicator
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(rfidX - 3, rfidY - 24, 6, 5);

    // B. Middle Turnstile Barrier Bar (Chrome Arm)
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(rfidX + 5, rfidY - 14, 18, 3.5);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.strokeRect(rfidX + 5, rfidY - 14, 18, 3.5);

    // C. Right Security Pylons (Two stainless posts with green status lights)
    const pylonX = pos.x + 14;
    for (let p = 0; p < 2; p++) {
      const px = pylonX + p * 10;
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.roundRect(px - 3, rfidY - 30, 6, 30, [2, 2, 1, 1]);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Top Status LED (Green access dot)
      ctx.fillStyle = '#10b981';
      ctx.fillRect(px - 2, rfidY - 32, 4, 2);
    }
  }

  // =========================================================================
  // 7. DESK 01 (Warm Wooden Desk, Dual Monitors, 3 Drawers, Succulent & Chair)
  // =========================================================================
  renderDesk01(ctx, pos, t) {
    // Floor drop shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + 16, 52, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    const deskH = 24;
    const dy = pos.y - deskH;

    // A. Warm Medium-Brown Wooden Desk Structure
    // Left Leg Panel
    ctx.fillStyle = '#5c3826';
    ctx.fillRect(pos.x - 40, dy + 6, 6, 24);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(pos.x - 40, dy + 6, 6, 24);

    // Right Pedestal 3-Drawer Cabinet
    const drawerX = pos.x + 22;
    ctx.fillStyle = '#784323';
    ctx.beginPath();
    ctx.roundRect(drawerX, dy + 4, 18, 26, [0, 0, 3, 3]);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.3;
    ctx.stroke();

    // 3 Drawers and metallic handles
    for (let d = 0; d < 3; d++) {
      const drawerY = dy + 6 + d * 8;
      ctx.strokeStyle = '#381a0b';
      ctx.strokeRect(drawerX + 1, drawerY, 16, 7);
      // Silver handle
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(drawerX + 5, drawerY + 3, 7, 1.5);
    }

    // Wooden Desk Top Surface (Isometric Diamond Slab)
    ctx.fillStyle = '#9a5c37'; // Warm walnut tabletop
    ctx.beginPath();
    ctx.moveTo(pos.x, dy - 18);
    ctx.lineTo(pos.x + 46, dy + 5);
    ctx.lineTo(pos.x, dy + 28);
    ctx.lineTo(pos.x - 46, dy + 5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // B. Mini Potted Succulent Plant on Desk (Left corner)
    const plantDeskX = pos.x - 26;
    const plantDeskY = dy + 2;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(plantDeskX - 3, plantDeskY - 2, 6, 6);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(plantDeskX - 3, plantDeskY - 2, 6, 6);

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(plantDeskX, plantDeskY - 4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    // C. White Keyboard, Mouse, and Gray Mousepad
    const padX = pos.x - 14;
    const padY = dy + 8;
    ctx.fillStyle = '#334155';
    ctx.fillRect(padX, padY, 32, 14);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(padX, padY, 32, 14);

    // Keyboard
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(padX + 2, padY + 2, 20, 9);
    ctx.strokeStyle = '#0f172a';
    ctx.strokeRect(padX + 2, padY + 2, 20, 9);

    // Mouse
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(padX + 24, padY + 3, 5, 7, 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    // D. Dual Coding Monitors (Bezel hitam tebal, layar hijau kode)
    const monW = 28;
    const monH = 20;

    // Monitor 1 (Left Screen)
    const m1X = pos.x - 20;
    const m1Y = dy - 14;

    ctx.fillStyle = '#475569';
    ctx.fillRect(m1X - 2, m1Y + monH, 4, 7);
    ctx.fillRect(m1X - 6, m1Y + monH + 6, 12, 2);

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(m1X - monW / 2, m1Y, monW, monH, 2.5);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.3;
    ctx.stroke();

    // Screen: Black IDE + Bright Green Code Lines
    ctx.fillStyle = '#020617';
    ctx.fillRect(m1X - monW / 2 + 2, m1Y + 2, monW - 4, monH - 4);
    ctx.fillStyle = '#22c55e';
    for (let l = 0; l < 4; l++) {
      ctx.fillRect(m1X - monW / 2 + 4, m1Y + 4 + l * 3.5, 10 + (l * 4) % 12, 1.2);
    }

    // Monitor 2 (Right Screen)
    const m2X = pos.x + 10;
    const m2Y = dy - 14;

    ctx.fillStyle = '#475569';
    ctx.fillRect(m2X - 2, m2Y + monH, 4, 7);
    ctx.fillRect(m2X - 6, m2Y + monH + 6, 12, 2);

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(m2X - monW / 2, m2Y, monW, monH, 2.5);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.3;
    ctx.stroke();

    ctx.fillStyle = '#020617';
    ctx.fillRect(m2X - monW / 2 + 2, m2Y + 2, monW - 4, monH - 4);
    ctx.fillStyle = '#22c55e';
    for (let l = 0; l < 4; l++) {
      ctx.fillRect(m2X - monW / 2 + 4, m2Y + 4 + l * 3.5, 8 + (l * 5) % 13, 1.2);
    }

    // E. Ergonomic Office Chair
    const chairY = pos.y + 18;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(pos.x, chairY + 2, 13, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.ellipse(pos.x, chairY - 6, 11, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(pos.x - 9, chairY - 24, 18, 16, 4);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();
  }
}
