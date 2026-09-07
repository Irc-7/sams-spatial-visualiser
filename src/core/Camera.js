/**
 * SAMS Spatial Agentic Visualiser - Camera Controller
 * Handles isometric viewport panning, clamped zooming, viewport culling, and smooth centering.
 */

export class Camera {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Object} [options]
   */
  constructor(canvas, options = {}) {
    this.canvas = canvas;

    // Transform properties
    this.x = options.x || 0; // Screen origin X offset
    this.y = options.y || 0; // Screen origin Y offset
    this.zoom = options.zoom || 1.0;
    this.targetZoom = this.zoom;
    this.minZoom = options.minZoom || 0.4;
    this.maxZoom = options.maxZoom || 2.5;

    // Pan state
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.cameraStartX = 0;
    this.cameraStartY = 0;

    // Viewport size
    this.width = canvas.clientWidth || 800;
    this.height = canvas.clientHeight || 600;

    // Target following
    this.target = null;
    this.followDamping = 0.08;

    this.bindEvents();
  }

  /**
   * Binds mouse and touch listeners for interactive pan and zoom.
   */
  bindEvents() {
    const el = this.canvas;

    el.addEventListener('mousedown', (e) => {
      // Primary or Middle mouse button
      if (e.button === 0 || e.button === 1) {
        this.isDragging = true;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
        this.cameraStartX = this.x;
        this.cameraStartY = this.y;
        this.target = null; // Break target follow on manual pan
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.dragStartX;
      const dy = e.clientY - this.dragStartY;
      this.x = this.cameraStartX + dx;
      this.y = this.cameraStartY + dy;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Wheel zoom towards cursor position
    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
      const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoom * zoomFactor));

      if (newZoom !== this.zoom) {
        // Adjust camera position so cursor points at same world point
        this.x = mouseX - (mouseX - this.x) * (newZoom / this.zoom);
        this.y = mouseY - (mouseY - this.y) * (newZoom / this.zoom);
        this.zoom = newZoom;
      }
    }, { passive: false });

    // Touch support (1-finger pan, 2-finger pinch)
    let lastTouchDist = 0;
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.dragStartX = e.touches[0].clientX;
        this.dragStartY = e.touches[0].clientY;
        this.cameraStartX = this.x;
        this.cameraStartY = this.y;
        this.target = null;
      } else if (e.touches.length === 2) {
        this.isDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDist = Math.hypot(dx, dy);
      }
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - this.dragStartX;
        const dy = e.touches[0].clientY - this.dragStartY;
        this.x = this.cameraStartX + dx;
        this.y = this.cameraStartY + dy;
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        if (lastTouchDist > 0) {
          const factor = dist / lastTouchDist;
          const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoom * factor));
          this.zoom = newZoom;
        }
        lastTouchDist = dist;
      }
    }, { passive: false });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
      lastTouchDist = 0;
    });
  }

  /**
   * Resizes viewport cache.
   * @param {number} width
   * @param {number} height
   */
  resize(width, height) {
    this.width = width;
    this.height = height;
  }

  /**
   * Center the camera on a specific world screen coordinate.
   * @param {number} worldScreenX
   * @param {number} worldScreenY
   * @param {number} [zoom]
   */
  centerOn(worldScreenX, worldScreenY, zoom) {
    if (zoom !== undefined) {
      this.zoom = Math.min(this.maxZoom, Math.max(this.minZoom, zoom));
    }
    this.x = this.width / 2 - worldScreenX * this.zoom;
    this.y = this.height / 2 - worldScreenY * this.zoom;
    this.target = null;
  }

  /**
   * Sets an entity or coordinate target to smoothly track.
   * @param {{x: number, y: number}|null} target
   */
  trackTarget(target) {
    this.target = target;
  }

  /**
   * Updates camera smoothing and target tracking in the frame tick.
   * @param {number} [dt=0.016]
   */
  update(dt = 0.016) {
    if (this.target) {
      const targetScreenX = this.width / 2 - this.target.x * this.zoom;
      const targetScreenY = this.height / 2 - this.target.y * this.zoom;
      this.x += (targetScreenX - this.x) * this.followDamping;
      this.y += (targetScreenY - this.y) * this.followDamping;
    }
  }

  /**
   * Applies the current camera transformation to the 2D context.
   * @param {CanvasRenderingContext2D} ctx
   */
  applyTransform(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.zoom, this.zoom);
  }

  /**
   * Restores context state after world render.
   * @param {CanvasRenderingContext2D} ctx
   */
  restoreTransform(ctx) {
    ctx.restore();
  }

  /**
   * Converts viewport client coordinates to world screen coordinates (unscaled by zoom and pan).
   * @param {number} clientX
   * @param {number} clientY
   * @returns {{x: number, y: number}}
   */
  screenToWorld(clientX, clientY) {
    return {
      x: (clientX - this.x) / this.zoom,
      y: (clientY - this.y) / this.zoom
    };
  }

  /**
   * Simple viewport culling check for screen-space bounding boxes.
   * @param {number} minX
   * @param {number} minY
   * @param {number} maxX
   * @param {number} maxY
   * @returns {boolean}
   */
  isVisible(minX, minY, maxX, maxY) {
    const screenMinX = minX * this.zoom + this.x;
    const screenMinY = minY * this.zoom + this.y;
    const screenMaxX = maxX * this.zoom + this.x;
    const screenMaxY = maxY * this.zoom + this.y;

    return !(screenMaxX < 0 || screenMinX > this.width || screenMaxY < 0 || screenMinY > this.height);
  }
}
