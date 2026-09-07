/**
 * SAMS Spatial Agentic Visualiser - Room Architecture
 * Neo-Retro Isometric Pixel Art Room Diorama (Matching Gambar 2):
 * - Crisp dark structural outlines & baseboard trim
 * - Pale blue-gray isometric floor tiles with precise pixel grid grout
 * - Clean cutaway walls and architectural doorway threshold on the right
 */

export class RoomArchitecture {
  /**
   * @param {import('../core/IsometricEngine.js').IsometricEngine} engine
   * @param {Object} [options]
   */
  constructor(engine, options = {}) {
    this.engine = engine;
    this.gridSize = options.gridSize || 10;
    this.wallHeight = options.wallHeight || 82;

    // 16/32-bit pixel art diorama color palette
    this.palette = {
      // Pixel outlines & structural bounds
      outline: '#1e293b',
      outlineSoft: 'rgba(30, 41, 59, 0.65)',

      // Walls (stepped cel-shading tones)
      wallLeftFace: '#cbd5e1',     // Shadowed wall
      wallRightFace: '#e2e8f0',    // Light wall
      wallTopCap: '#f8fafc',
      wallBaseboard: '#475569',
      wallBaseboardDark: '#334155',

      // Floor tiles: Pale grayish-blue
      tileTopA: '#f1f5f9',
      tileTopB: '#e2e8f0',
      tileGridGrout: 'rgba(100, 116, 139, 0.4)',

      // Room foundation slab drop-edges
      slabFaceLeft: '#64748b',
      slabFaceRight: '#475569',
      slabBottomOutline: '#0f172a'
    };
  }

  /**
   * Renders perimeter cutaway walls with crisp pixel-art linework and doorway portal.
   * @param {CanvasRenderingContext2D} ctx
   */
  renderPerimeterWalls(ctx) {
    const halfW = this.engine.halfWidth;
    const halfH = this.engine.halfHeight;
    const wallH = this.wallHeight;

    // 1. Back Wall on Y = 0 (runs along X axis)
    for (let x = 0; x < this.gridSize; x++) {
      const p1 = this.engine.gridToScreen(x, 0, 0);
      const p2 = this.engine.gridToScreen(x + 1, 0, 0);

      // Wall Facade Panel (cel-shaded solid)
      ctx.fillStyle = (x % 2 === 0) ? this.palette.wallRightFace : '#edf2f7';
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p2.x, p2.y - wallH);
      ctx.lineTo(p1.x, p1.y - wallH);
      ctx.closePath();
      ctx.fill();

      // Top Edge Cap (Specular highlight strip)
      ctx.fillStyle = this.palette.wallTopCap;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y - wallH);
      ctx.lineTo(p2.x, p2.y - wallH);
      ctx.lineTo(p2.x - halfW * 0.16, p2.y - wallH - halfH * 0.16);
      ctx.lineTo(p1.x - halfW * 0.16, p1.y - wallH - halfH * 0.16);
      ctx.closePath();
      ctx.fill();

      // Baseboard Trim
      ctx.fillStyle = this.palette.wallBaseboard;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p2.x, p2.y - 8);
      ctx.lineTo(p1.x, p1.y - 8);
      ctx.closePath();
      ctx.fill();

      // Pixel Art Seam Lines
      ctx.strokeStyle = this.palette.outlineSoft;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p2.x, p2.y);
      ctx.lineTo(p2.x, p2.y - wallH);
      ctx.stroke();

      // Top cap outline
      ctx.strokeStyle = this.palette.outline;
      ctx.beginPath();
      ctx.moveTo(p1.x - halfW * 0.16, p1.y - wallH - halfH * 0.16);
      ctx.lineTo(p2.x - halfW * 0.16, p2.y - wallH - halfH * 0.16);
      ctx.stroke();
    }

    // 2. Left Wall on X = 0 (runs along Y axis)
    for (let y = 0; y < this.gridSize; y++) {
      const p1 = this.engine.gridToScreen(0, y, 0);
      const p2 = this.engine.gridToScreen(0, y + 1, 0);

      ctx.fillStyle = (y % 2 === 0) ? this.palette.wallLeftFace : '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p2.x, p2.y - wallH);
      ctx.lineTo(p1.x, p1.y - wallH);
      ctx.closePath();
      ctx.fill();

      // Top Cap
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y - wallH);
      ctx.lineTo(p2.x, p2.y - wallH);
      ctx.lineTo(p2.x + halfW * 0.16, p2.y - wallH - halfH * 0.16);
      ctx.lineTo(p1.x + halfW * 0.16, p1.y - wallH - halfH * 0.16);
      ctx.closePath();
      ctx.fill();

      // Baseboard
      ctx.fillStyle = this.palette.wallBaseboardDark;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p2.x, p2.y - 8);
      ctx.lineTo(p1.x, p1.y - 8);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = this.palette.outlineSoft;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p2.x, p2.y);
      ctx.lineTo(p2.x, p2.y - wallH);
      ctx.stroke();
    }

    // Outer perimeter top structural line
    const origin = this.engine.gridToScreen(0, 0, 0);
    const cornerX = this.engine.gridToScreen(this.gridSize, 0, 0);
    const cornerY = this.engine.gridToScreen(0, this.gridSize, 0);

    ctx.strokeStyle = this.palette.outline;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y - wallH);
    ctx.lineTo(cornerX.x, cornerX.y - wallH);
    ctx.moveTo(origin.x, origin.y - wallH);
    ctx.lineTo(cornerY.x, cornerY.y - wallH);
    ctx.stroke();

    // 3. Right-side Architectural Doorway (Threshold at X=gridSize, Y=3.0..5.5)
    this.renderDoorwayPortal(ctx);
  }

  /**
   * Renders the crisp pixel-art doorway portal at the right entrance boundary.
   * @param {CanvasRenderingContext2D} ctx
   */
  renderDoorwayPortal(ctx) {
    const doorX = this.gridSize - 0.05;
    const doorY = 3.2;
    const p1 = this.engine.gridToScreen(doorX, doorY, 0);
    const p2 = this.engine.gridToScreen(doorX, doorY + 2.3, 0);
    const doorH = 74;

    // Door Recess Opening
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p2.x, p2.y - doorH);
    ctx.lineTo(p1.x, p1.y - doorH);
    ctx.closePath();
    ctx.fill();

    // Architectural Door Frame Posts (Dark outline + white finish)
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = this.palette.outline;
    ctx.lineWidth = 1.2;

    // Left Frame Post
    ctx.fillRect(p1.x - 3, p1.y - doorH, 6, doorH);
    ctx.strokeRect(p1.x - 3, p1.y - doorH, 6, doorH);

    // Right Frame Post
    ctx.fillRect(p2.x - 3, p2.y - doorH, 6, doorH);
    ctx.strokeRect(p2.x - 3, p2.y - doorH, 6, doorH);

    // Top Lintel Header
    ctx.beginPath();
    ctx.moveTo(p1.x - 3, p1.y - doorH);
    ctx.lineTo(p2.x + 3, p2.y - doorH);
    ctx.lineTo(p2.x + 3, p2.y - doorH - 8);
    ctx.lineTo(p1.x - 3, p1.y - doorH - 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Translucent Glass Threshold Panels
    ctx.fillStyle = 'rgba(186, 230, 253, 0.45)';
    ctx.beginPath();
    ctx.moveTo(p1.x + 3, p1.y - 4);
    ctx.lineTo(p2.x - 3, p2.y - 4);
    ctx.lineTo(p2.x - 3, p2.y - doorH + 4);
    ctx.lineTo(p1.x + 3, p1.y - doorH + 4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.stroke();
  }

  /**
   * Renders the pale blue-gray tiled floor grid with crisp pixel outlines and foundation drop-slab.
   * @param {CanvasRenderingContext2D} ctx
   * @param {Object} [hoveredTile=null]
   */
  renderFloor(ctx, hoveredTile = null) {
    // 1. Foundation Slab Drop Thickness (Diorama cutaway base)
    const leftCorner = this.engine.gridToScreen(0, this.gridSize, 0);
    const bottomCorner = this.engine.gridToScreen(this.gridSize, this.gridSize, 0);
    const rightCorner = this.engine.gridToScreen(this.gridSize, 0, 0);
    const slabHeight = 16;

    // South-west face
    ctx.fillStyle = this.palette.slabFaceLeft;
    ctx.beginPath();
    ctx.moveTo(leftCorner.x, leftCorner.y);
    ctx.lineTo(bottomCorner.x, bottomCorner.y);
    ctx.lineTo(bottomCorner.x, bottomCorner.y + slabHeight);
    ctx.lineTo(leftCorner.x, leftCorner.y + slabHeight);
    ctx.closePath();
    ctx.fill();

    // South-east face
    ctx.fillStyle = this.palette.slabFaceRight;
    ctx.beginPath();
    ctx.moveTo(bottomCorner.x, bottomCorner.y);
    ctx.lineTo(rightCorner.x, rightCorner.y);
    ctx.lineTo(rightCorner.x, rightCorner.y + slabHeight);
    ctx.lineTo(bottomCorner.x, bottomCorner.y + slabHeight);
    ctx.closePath();
    ctx.fill();

    // Slab perimeter outline
    ctx.strokeStyle = this.palette.slabBottomOutline;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(leftCorner.x, leftCorner.y);
    ctx.lineTo(leftCorner.x, leftCorner.y + slabHeight);
    ctx.lineTo(bottomCorner.x, bottomCorner.y + slabHeight);
    ctx.lineTo(rightCorner.x, rightCorner.y + slabHeight);
    ctx.lineTo(rightCorner.x, rightCorner.y);
    ctx.moveTo(bottomCorner.x, bottomCorner.y);
    ctx.lineTo(bottomCorner.x, bottomCorner.y + slabHeight);
    ctx.stroke();

    // 2. Uniform Pale Blue-Gray Isometric Tiles
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        const pos = this.engine.gridToScreen(x, y, 0);
        const isOdd = (x + y) % 2 === 0;
        const isHovered = hoveredTile && hoveredTile.x === x && hoveredTile.y === y;

        ctx.fillStyle = isHovered ? '#bae6fd' : (isOdd ? this.palette.tileTopA : this.palette.tileTopB);
        this.engine.drawTileDiamond(ctx, pos.x, pos.y);
        ctx.fill();

        // Crisp pixel grid grout line
        ctx.strokeStyle = isHovered ? '#0284c7' : this.palette.tileGridGrout;
        ctx.lineWidth = isHovered ? 1.4 : 0.8;
        ctx.stroke();
      }
    }
  }
}
