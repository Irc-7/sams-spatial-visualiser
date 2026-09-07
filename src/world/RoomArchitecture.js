/**
 * SAMS Spatial Agentic Visualiser - Room Architecture
 * Pale blue-gray tiled office room diorama with cutaway perimeter walls,
 * doorway portal, and clean isometric perspective matching reference mockup.
 */

export class RoomArchitecture {
  /**
   * @param {import('../core/IsometricEngine.js').IsometricEngine} engine
   * @param {Object} [options]
   */
  constructor(engine, options = {}) {
    this.engine = engine;
    this.gridSize = options.gridSize || 10; // 10x10 compact diorama grid
    this.wallHeight = options.wallHeight || 80;

    this.palette = {
      // Clean, light tech office walls
      wallFaceY: '#e2e8f0',
      wallFaceX: '#cbd5e1',
      wallTopCap: '#f8fafc',
      wallBaseboard: '#94a3b8',
      doorwayFrame: '#f1f5f9',

      // Floor tiles: Pale blue-gray
      tileA: '#f1f5f9',
      tileB: '#e2e8f0',
      tileLine: 'rgba(148, 163, 184, 0.45)',

      // Foundation drop edge
      slabSouth: '#64748b',
      slabEast: '#475569'
    };
  }

  /**
   * Renders the cutaway perimeter walls on Y=0 and X=0 plus the right-side doorway.
   * @param {CanvasRenderingContext2D} ctx
   */
  renderPerimeterWalls(ctx) {
    const halfW = this.engine.halfWidth;
    const halfH = this.engine.halfHeight;
    const wallH = this.wallHeight;

    // 1. Wall on Y = 0 (Back-left to Back-right along X axis)
    for (let x = 0; x < this.gridSize; x++) {
      const topStart = this.engine.gridToScreen(x, 0, 0);
      const topEnd = this.engine.gridToScreen(x + 1, 0, 0);

      // Main wall face
      ctx.fillStyle = (x % 2 === 0) ? this.palette.wallFaceY : '#f1f5f9';
      ctx.beginPath();
      ctx.moveTo(topStart.x, topStart.y);
      ctx.lineTo(topEnd.x, topEnd.y);
      ctx.lineTo(topEnd.x, topEnd.y - wallH);
      ctx.lineTo(topStart.x, topStart.y - wallH);
      ctx.closePath();
      ctx.fill();

      // Top Wall Cap
      ctx.fillStyle = this.palette.wallTopCap;
      ctx.beginPath();
      ctx.moveTo(topStart.x, topStart.y - wallH);
      ctx.lineTo(topEnd.x, topEnd.y - wallH);
      ctx.lineTo(topEnd.x - halfW * 0.18, topEnd.y - wallH - halfH * 0.18);
      ctx.lineTo(topStart.x - halfW * 0.18, topStart.y - wallH - halfH * 0.18);
      ctx.closePath();
      ctx.fill();

      // Baseboard
      ctx.fillStyle = this.palette.wallBaseboard;
      ctx.beginPath();
      ctx.moveTo(topStart.x, topStart.y);
      ctx.lineTo(topEnd.x, topEnd.y);
      ctx.lineTo(topEnd.x, topEnd.y - 7);
      ctx.lineTo(topStart.x, topStart.y - 7);
      ctx.closePath();
      ctx.fill();

      // Panel joint seam line
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(topEnd.x, topEnd.y);
      ctx.lineTo(topEnd.x, topEnd.y - wallH);
      ctx.stroke();
    }

    // 2. Wall on X = 0 (Back-left to Fore-left along Y axis)
    for (let y = 0; y < this.gridSize; y++) {
      const topStart = this.engine.gridToScreen(0, y, 0);
      const topEnd = this.engine.gridToScreen(0, y + 1, 0);

      ctx.fillStyle = (y % 2 === 0) ? this.palette.wallFaceX : '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(topStart.x, topStart.y);
      ctx.lineTo(topEnd.x, topEnd.y);
      ctx.lineTo(topEnd.x, topEnd.y - wallH);
      ctx.lineTo(topStart.x, topStart.y - wallH);
      ctx.closePath();
      ctx.fill();

      // Top Wall Cap
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(topStart.x, topStart.y - wallH);
      ctx.lineTo(topEnd.x, topEnd.y - wallH);
      ctx.lineTo(topEnd.x + halfW * 0.18, topEnd.y - wallH - halfH * 0.18);
      ctx.lineTo(topStart.x + halfW * 0.18, topStart.y - wallH - halfH * 0.18);
      ctx.closePath();
      ctx.fill();

      // Baseboard
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.moveTo(topStart.x, topStart.y);
      ctx.lineTo(topEnd.x, topEnd.y);
      ctx.lineTo(topEnd.x, topEnd.y - 7);
      ctx.lineTo(topStart.x, topStart.y - 7);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(100, 116, 139, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(topEnd.x, topEnd.y);
      ctx.lineTo(topEnd.x, topEnd.y - wallH);
      ctx.stroke();
    }

    // 3. Right-side Architectural Doorway (Portal at X=gridSize, Y=3..5)
    this.renderDoorwayPortal(ctx);
  }

  /**
   * Renders the doorway frame leading out of the room at the right perimeter.
   * @param {CanvasRenderingContext2D} ctx
   */
  renderDoorwayPortal(ctx) {
    const doorX = this.gridSize - 0.05;
    const doorY = 3.2;
    const p1 = this.engine.gridToScreen(doorX, doorY, 0);
    const p2 = this.engine.gridToScreen(doorX, doorY + 2.2, 0);
    const doorHeight = 72;

    // Doorway opening depth cut
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p2.x, p2.y - doorHeight);
    ctx.lineTo(p1.x, p1.y - doorHeight);
    ctx.closePath();
    ctx.fill();

    // Door Frame Pillars
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(p1.x - 3, p1.y - doorHeight, 6, doorHeight);
    ctx.fillRect(p2.x - 3, p2.y - doorHeight, 6, doorHeight);

    // Lintel Header Beam
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(p1.x - 3, p1.y - doorHeight);
    ctx.lineTo(p2.x + 3, p2.y - doorHeight);
    ctx.lineTo(p2.x + 3, p2.y - doorHeight - 8);
    ctx.lineTo(p1.x - 3, p1.y - doorHeight - 8);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Glass panel indication inside door
    ctx.fillStyle = 'rgba(186, 230, 253, 0.4)';
    ctx.beginPath();
    ctx.moveTo(p1.x + 3, p1.y - 4);
    ctx.lineTo(p2.x - 3, p2.y - 4);
    ctx.lineTo(p2.x - 3, p2.y - doorHeight + 4);
    ctx.lineTo(p1.x + 3, p1.y - doorHeight + 4);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Renders the pale blue-gray tiled floor grid.
   * @param {CanvasRenderingContext2D} ctx
   * @param {Object} [hoveredTile=null]
   */
  renderFloor(ctx, hoveredTile = null) {
    // 1. Foundation Slab drop shadows
    const leftCorner = this.engine.gridToScreen(0, this.gridSize, 0);
    const bottomCorner = this.engine.gridToScreen(this.gridSize, this.gridSize, 0);
    const rightCorner = this.engine.gridToScreen(this.gridSize, 0, 0);
    const slabHeight = 16;

    // South-west slab edge
    ctx.fillStyle = this.palette.slabSouth;
    ctx.beginPath();
    ctx.moveTo(leftCorner.x, leftCorner.y);
    ctx.lineTo(bottomCorner.x, bottomCorner.y);
    ctx.lineTo(bottomCorner.x, bottomCorner.y + slabHeight);
    ctx.lineTo(leftCorner.x, leftCorner.y + slabHeight);
    ctx.closePath();
    ctx.fill();

    // South-east slab edge
    ctx.fillStyle = this.palette.slabEast;
    ctx.beginPath();
    ctx.moveTo(bottomCorner.x, bottomCorner.y);
    ctx.lineTo(rightCorner.x, rightCorner.y);
    ctx.lineTo(rightCorner.x, rightCorner.y + slabHeight);
    ctx.lineTo(bottomCorner.x, bottomCorner.y + slabHeight);
    ctx.closePath();
    ctx.fill();

    // 2. Uniform pale blue-gray floor tiles
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const pos = this.engine.gridToScreen(x, y, 0);
        const isOdd = (x + y) % 2 === 0;
        const isHovered = hoveredTile && hoveredTile.x === x && hoveredTile.y === y;

        ctx.fillStyle = isHovered ? '#bae6fd' : (isOdd ? this.palette.tileA : this.palette.tileB);
        this.engine.drawTileDiamond(ctx, pos.x, pos.y);
        ctx.fill();

        ctx.strokeStyle = isHovered ? '#0284c7' : this.palette.tileLine;
        ctx.lineWidth = isHovered ? 1.5 : 0.8;
        ctx.stroke();
      }
    }
  }
}
