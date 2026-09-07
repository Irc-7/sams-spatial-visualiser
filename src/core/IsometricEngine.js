/**
 * SAMS Spatial Agentic Visualiser - Isometric Engine
 * 2:1 Isometric projection model and spatial depth sorter.
 */

export class IsometricEngine {
  /**
   * @param {Object} options
   * @param {number} [options.tileWidth=54] - Base tile width in px (W)
   * @param {number} [options.tileHeight=27] - Base tile height in px (H)
   * @param {number} [options.elevationFactor=16] - Multiplier for Z-axis elevation
   */
  constructor(options = {}) {
    this.tileWidth = options.tileWidth || 54;
    this.tileHeight = options.tileHeight || 27;
    this.halfWidth = this.tileWidth / 2;
    this.halfHeight = this.tileHeight / 2;
    this.elevationFactor = options.elevationFactor || 16;
  }

  /**
   * Transforms 3D Grid coordinates (X, Y, Z) to 2D Screen coordinates.
   * Xscreen = (Xgrid - Ygrid) * (W / 2) + OriginX
   * Yscreen = (Xgrid + Ygrid) * (H / 2) + OriginY - (Zgrid * ElevationFactor)
   * 
   * @param {number} gridX
   * @param {number} gridY
   * @param {number} [gridZ=0]
   * @param {number} [originX=0]
   * @param {number} [originY=0]
   * @returns {{x: number, y: number}}
   */
  gridToScreen(gridX, gridY, gridZ = 0, originX = 0, originY = 0) {
    const x = (gridX - gridY) * this.halfWidth + originX;
    const y = (gridX + gridY) * this.halfHeight + originY - (gridZ * this.elevationFactor);
    return { x, y };
  }

  /**
   * Inverse transformation from 2D screen coordinates back to 2D grid coordinates (Z assumed 0).
   * 
   * @param {number} screenX
   * @param {number} screenY
   * @param {number} [originX=0]
   * @param {number} [originY=0]
   * @returns {{x: number, y: number}}
   */
  screenToGrid(screenX, screenY, originX = 0, originY = 0) {
    const dx = screenX - originX;
    const dy = screenY - originY;
    const gridX = (dx / this.halfWidth + dy / this.halfHeight) / 2;
    const gridY = (dy / this.halfHeight - dx / this.halfWidth) / 2;
    return { x: gridX, y: gridY };
  }

  /**
   * Computes the depth sorting key.
   * Primary key: K = gridX + gridY
   * Secondary key: gridZ elevation and priority layer offset.
   * 
   * @param {number} gridX
   * @param {number} gridY
   * @param {number} [gridZ=0]
   * @param {number} [layerOffset=0]
   * @returns {number}
   */
  getDepthKey(gridX, gridY, gridZ = 0, layerOffset = 0) {
    return (gridX + gridY) + (gridZ * 0.001) + (layerOffset * 0.0001);
  }

  /**
   * Sorts an array of renderable entities by their depth key in ascending order (back to front).
   * 
   * @param {Array<Object>} renderables
   * @returns {Array<Object>} sorted copy or in-place sorted
   */
  sortDepth(renderables) {
    return renderables.sort((a, b) => {
      const depthA = a.depthKey !== undefined ? a.depthKey : this.getDepthKey(a.gridX, a.gridY, a.gridZ || 0, a.layer || 0);
      const depthB = b.depthKey !== undefined ? b.depthKey : this.getDepthKey(b.gridX, b.gridY, b.gridZ || 0, b.layer || 0);
      return depthA - depthB;
    });
  }

  /**
   * Generates path points for an isometric rhomboid diamond tile on Canvas 2D.
   * 
   * @param {number} screenX
   * @param {number} screenY
   * @returns {Array<{x: number, y: number}>} [top, right, bottom, left]
   */
  getTilePolygon(screenX, screenY) {
    return [
      { x: screenX, y: screenY },                             // Top
      { x: screenX + this.halfWidth, y: screenY + this.halfHeight }, // Right
      { x: screenX, y: screenY + this.tileHeight },           // Bottom
      { x: screenX - this.halfWidth, y: screenY + this.halfHeight }  // Left
    ];
  }

  /**
   * Draws a standard 2:1 isometric diamond polygon on Canvas 2D.
   * 
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} screenX
   * @param {number} screenY
   */
  drawTileDiamond(ctx, screenX, screenY) {
    ctx.beginPath();
    ctx.moveTo(screenX, screenY);
    ctx.lineTo(screenX + this.halfWidth, screenY + this.halfHeight);
    ctx.lineTo(screenX, screenY + this.tileHeight);
    ctx.lineTo(screenX - this.halfWidth, screenY + this.halfHeight);
    ctx.closePath();
  }
}
