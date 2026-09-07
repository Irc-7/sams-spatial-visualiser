/**
 * SAMS Spatial Agentic Visualiser - Room Architecture
 * Renders 12x12 architectural floor grid, perimeter cutaway walls, zoned floor materials, and depth details.
 */

export class RoomArchitecture {
  /**
   * @param {import('../core/IsometricEngine.js').IsometricEngine} engine
   * @param {Object} [options]
   */
  constructor(engine, options = {}) {
    this.engine = engine;
    this.gridSize = options.gridSize || 12; // 12x12 tiles
    this.wallHeight = options.wallHeight || 88; // Cutaway perimeter wall height (realistic ~3m architectural scale)
    this.showGridLines = options.showGridLines !== false;

    // Palette tokens for architectural rendering
    this.palette = {
      // Wall materials
      wallTop: '#f1f5f9',
      wallLeft: '#cbd5e1',
      wallRight: '#94a3b8',
      wallBaseboard: '#334155',
      wallPillar: '#64748b',

      // Floor Zone 01: Vault raised technical flooring
      vaultBase: '#0f172a',
      vaultTop: '#1e293b',
      vaultTopAlt: '#273549',
      vaultLine: '#0284c7',

      // Floor Zone 02: Compute acoustic navy carpeting
      computeTop: '#1e1b4b',
      computeTopAlt: '#2e1065',
      computeBorder: '#4338ca',

      // Floor Zone 03: Biophilic emerald matting
      loungeTop: '#064e3b',
      loungeTopAlt: '#065f46',
      loungeBorder: '#059669',

      // Main corridor slate walkways
      corridorTop: '#e2e8f0',
      corridorTopAlt: '#cbd5e1',
      corridorLine: '#94a3b8',

      // Default ambient polished concrete
      defaultTileA: '#f8fafc',
      defaultTileB: '#f1f5f9',
      defaultLine: 'rgba(148, 163, 184, 0.4)'
    };
  }

  /**
   * Determines the zone type and material for a specific tile.
   * @param {number} x
   * @param {number} y
   * @returns {{type: string, fill: string, stroke: string, elevated: boolean, z: number}}
   */
  getTileMaterial(x, y) {
    const isOdd = (x + y) % 2 === 0;

    // 1. Zone 01: Vault & Technical Storage (0 <= X <= 3, 0 <= Y <= 3)
    if (x >= 0 && x <= 3 && y >= 0 && y <= 3) {
      return {
        type: 'vault',
        fill: isOdd ? this.palette.vaultTop : this.palette.vaultTopAlt,
        stroke: 'rgba(2, 132, 199, 0.4)',
        elevated: true,
        z: 0.25 // Slightly elevated technical floor
      };
    }

    // 2. Zone 03: Breakout Biophilic Lounge (1 <= X <= 4, 9 <= Y <= 11)
    if (x >= 1 && x <= 4 && y >= 9 && y <= 11) {
      return {
        type: 'lounge',
        fill: isOdd ? this.palette.loungeTop : this.palette.loungeTopAlt,
        stroke: 'rgba(16, 185, 129, 0.35)',
        elevated: false,
        z: 0
      };
    }

    // 3. Zone 02: Compute Pods (2 <= X <= 6, 4 <= Y <= 8)
    if (x >= 2 && x <= 6 && y >= 4 && y <= 8) {
      return {
        type: 'compute',
        fill: isOdd ? this.palette.computeTop : this.palette.computeTopAlt,
        stroke: 'rgba(99, 102, 241, 0.3)',
        elevated: false,
        z: 0
      };
    }

    // 4. Main Corridors (Cross-axis walkway: X in [7, 8] or Y in [4, 5])
    if ((x >= 7 && x <= 8) || (y >= 4 && y <= 5)) {
      return {
        type: 'corridor',
        fill: isOdd ? this.palette.corridorTop : this.palette.corridorTopAlt,
        stroke: 'rgba(100, 116, 139, 0.25)',
        elevated: false,
        z: 0
      };
    }

    // 5. Default perimeter/ambient concrete
    return {
      type: 'default',
      fill: isOdd ? this.palette.defaultTileA : this.palette.defaultTileB,
      stroke: this.palette.defaultLine,
      elevated: false,
      z: 0
    };
  }

  /**
   * Renders the cutaway perimeter walls at X=0 and Y=0.
   * @param {CanvasRenderingContext2D} ctx
   */
  renderPerimeterWalls(ctx) {
    const halfW = this.engine.halfWidth;
    const halfH = this.engine.halfHeight;
    const wallH = this.wallHeight;

    // Wall on Y=0 (runs along X axis: from x=0 to x=gridSize)
    // Front face faces southeast
    for (let x = 0; x < this.gridSize; x++) {
      const topStart = this.engine.gridToScreen(x, 0, 0);
      const topEnd = this.engine.gridToScreen(x + 1, 0, 0);

      // Wall panel polygon (X axis)
      ctx.fillStyle = (x % 3 === 0) ? '#94a3b8' : '#cbd5e1';
      ctx.beginPath();
      ctx.moveTo(topStart.x, topStart.y);
      ctx.lineTo(topEnd.x, topEnd.y);
      ctx.lineTo(topEnd.x, topEnd.y - wallH);
      ctx.lineTo(topStart.x, topStart.y - wallH);
      ctx.closePath();
      ctx.fill();

      // Top edge cap
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.moveTo(topStart.x, topStart.y - wallH);
      ctx.lineTo(topEnd.x, topEnd.y - wallH);
      ctx.lineTo(topEnd.x - halfW * 0.2, topEnd.y - wallH - halfH * 0.2);
      ctx.lineTo(topStart.x - halfW * 0.2, topStart.y - wallH - halfH * 0.2);
      ctx.closePath();
      ctx.fill();

      // Wall joints & baseboard line
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Architectural Baseboard
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(topStart.x, topStart.y);
      ctx.lineTo(topEnd.x, topEnd.y);
      ctx.lineTo(topEnd.x, topEnd.y - 6);
      ctx.lineTo(topStart.x, topStart.y - 6);
      ctx.closePath();
      ctx.fill();
    }

    // Wall on X=0 (runs along Y axis: from y=0 to y=gridSize)
    // Front face faces southwest
    for (let y = 0; y < this.gridSize; y++) {
      const topStart = this.engine.gridToScreen(0, y, 0);
      const topEnd = this.engine.gridToScreen(0, y + 1, 0);

      ctx.fillStyle = (y % 3 === 0) ? '#64748b' : '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(topStart.x, topStart.y);
      ctx.lineTo(topEnd.x, topEnd.y);
      ctx.lineTo(topEnd.x, topEnd.y - wallH);
      ctx.lineTo(topStart.x, topStart.y - wallH);
      ctx.closePath();
      ctx.fill();

      // Top edge cap
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(topStart.x, topStart.y - wallH);
      ctx.lineTo(topEnd.x, topEnd.y - wallH);
      ctx.lineTo(topEnd.x + halfW * 0.2, topEnd.y - wallH - halfH * 0.2);
      ctx.lineTo(topStart.x + halfW * 0.2, topStart.y - wallH - halfH * 0.2);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(15, 23, 42, 0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Baseboard
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(topStart.x, topStart.y);
      ctx.lineTo(topEnd.x, topEnd.y);
      ctx.lineTo(topEnd.x, topEnd.y - 6);
      ctx.lineTo(topStart.x, topStart.y - 6);
      ctx.closePath();
      ctx.fill();
    }
  }

  /**
   * Renders the 12x12 isometric floor grid and zoned surface textures.
   * @param {CanvasRenderingContext2D} ctx
   * @param {Object} [hoveredTile=null]
   */
  renderFloor(ctx, hoveredTile = null) {
    const halfW = this.engine.halfWidth;
    const halfH = this.engine.halfHeight;
    const elev = this.engine.elevationFactor;

    // Floor foundation base slab shadow
    const origin = this.engine.gridToScreen(0, 0, 0);
    const rightCorner = this.engine.gridToScreen(this.gridSize, 0, 0);
    const bottomCorner = this.engine.gridToScreen(this.gridSize, this.gridSize, 0);
    const leftCorner = this.engine.gridToScreen(0, this.gridSize, 0);

    // Foundation slab depth (southeast & southwest edges)
    const slabHeight = 14;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(leftCorner.x, leftCorner.y);
    ctx.lineTo(bottomCorner.x, bottomCorner.y);
    ctx.lineTo(bottomCorner.x, bottomCorner.y + slabHeight);
    ctx.lineTo(leftCorner.x, leftCorner.y + slabHeight);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(bottomCorner.x, bottomCorner.y);
    ctx.lineTo(rightCorner.x, rightCorner.y);
    ctx.lineTo(rightCorner.x, rightCorner.y + slabHeight);
    ctx.lineTo(bottomCorner.x, bottomCorner.y + slabHeight);
    ctx.closePath();
    ctx.fill();

    // Render floor tiles in depth sorted order (y from 0 to gridSize, x from 0 to gridSize)
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const mat = this.getTileMaterial(x, y);
        const zOffset = mat.z || 0;
        const pos = this.engine.gridToScreen(x, y, zOffset);

        // If elevated technical floor, draw 3D step risers
        if (mat.elevated && zOffset > 0) {
          const stepPx = zOffset * elev;
          ctx.fillStyle = '#0284c7';
          // South-east riser
          ctx.beginPath();
          ctx.moveTo(pos.x, pos.y + this.engine.tileHeight);
          ctx.lineTo(pos.x + halfW, pos.y + halfH);
          ctx.lineTo(pos.x + halfW, pos.y + halfH + stepPx);
          ctx.lineTo(pos.x, pos.y + this.engine.tileHeight + stepPx);
          ctx.closePath();
          ctx.fill();

          // South-west riser
          ctx.fillStyle = '#0369a1';
          ctx.beginPath();
          ctx.moveTo(pos.x - halfW, pos.y + halfH);
          ctx.lineTo(pos.x, pos.y + this.engine.tileHeight);
          ctx.lineTo(pos.x, pos.y + this.engine.tileHeight + stepPx);
          ctx.lineTo(pos.x - halfW, pos.y + halfH + stepPx);
          ctx.closePath();
          ctx.fill();
        }

        // Main diamond tile top
        const isHovered = hoveredTile && hoveredTile.x === x && hoveredTile.y === y;
        ctx.fillStyle = isHovered ? '#38bdf8' : mat.fill;
        this.engine.drawTileDiamond(ctx, pos.x, pos.y);
        ctx.fill();

        // Tile edge borders / grid line
        if (this.showGridLines) {
          ctx.strokeStyle = isHovered ? '#0284c7' : mat.stroke;
          ctx.lineWidth = isHovered ? 1.5 : 0.8;
          ctx.stroke();
        }

        // Technical perforation detail on Vault tiles
        if (mat.type === 'vault') {
          ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
          ctx.fillRect(pos.x - 2, pos.y + halfH - 2, 4, 4);
        }
      }
    }
  }
}
