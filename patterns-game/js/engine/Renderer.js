/**
 * Renderer.js - Canvas rendering system with camera support
 */

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Camera
        this.camera = {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
            target: null, // Entity to follow
            smoothing: 0.1, // Camera smoothing factor (0-1)
            bounds: null // Optional world bounds { minX, maxX, minY, maxY }
        };
        
        // Rendering settings
        this.backgroundColor = '#87CEEB'; // Sky blue
        this.debugMode = false;
        
        // Performance
        this.lastFrameTime = 0;
        this.fps = 60;
    }
    
    /**
     * Resize canvas to fit container
     */
    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.camera.width = width;
        this.camera.height = height;
    }
    
    /**
     * Set camera target to follow
     */
    setCameraTarget(entity) {
        this.camera.target = entity;
    }
    
    /**
     * Set camera bounds
     */
    setCameraBounds(minX, maxX, minY, maxY) {
        this.camera.bounds = { minX, maxX, minY, maxY };
    }
    
    /**
     * Update camera position
     */
    updateCamera() {
        if (!this.camera.target) return;
        
        // Calculate target camera position (center on target)
        const targetX = this.camera.target.x + this.camera.target.width / 2 - this.camera.width / 2;
        const targetY = this.camera.target.y + this.camera.target.height / 2 - this.camera.height / 2;
        
        // Smooth camera movement
        this.camera.x += (targetX - this.camera.x) * this.camera.smoothing;
        this.camera.y += (targetY - this.camera.y) * this.camera.smoothing;
        
        // Apply camera bounds if set
        if (this.camera.bounds) {
            const bounds = this.camera.bounds;
            
            // Clamp camera position
            if (this.camera.x < bounds.minX) {
                this.camera.x = bounds.minX;
            }
            if (this.camera.x + this.camera.width > bounds.maxX) {
                this.camera.x = bounds.maxX - this.camera.width;
            }
            if (this.camera.y < bounds.minY) {
                this.camera.y = bounds.minY;
            }
            if (this.camera.y + this.camera.height > bounds.maxY) {
                this.camera.y = bounds.maxY - this.camera.height;
            }
        }
    }
    
    /**
     * Clear canvas
     */
    clear() {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Render all entities
     */
    renderEntities(entities) {
        // Sort entities by y position for proper layering
        const sortedEntities = [...entities].sort((a, b) => a.y - b.y);
        
        for (const entity of sortedEntities) {
            if (entity.visible && entity.active) {
                entity.render(this.ctx, this.camera);
            }
        }
    }
    
    /**
     * Render debug information
     */
    renderDebug(entities) {
        if (!this.debugMode) return;
        
        this.ctx.save();
        
        // Render bounding boxes
        for (const entity of entities) {
            if (!entity.active) continue;
            
            const bounds = entity.getBounds();
            const screenX = bounds.left - this.camera.x;
            const screenY = bounds.top - this.camera.y;
            
            // Draw bounding box
            this.ctx.strokeStyle = entity.solid ? '#ff0000' : '#00ff00';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(screenX, screenY, entity.width, entity.height);
            
            // Draw center point
            this.ctx.fillStyle = '#ffff00';
            this.ctx.fillRect(bounds.centerX - this.camera.x - 2, 
                            bounds.centerY - this.camera.y - 2, 4, 4);
            
            // Draw velocity vector
            if (entity.velocityX !== 0 || entity.velocityY !== 0) {
                this.ctx.strokeStyle = '#0000ff';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(bounds.centerX - this.camera.x, bounds.centerY - this.camera.y);
                this.ctx.lineTo(
                    bounds.centerX - this.camera.x + entity.velocityX * 0.1,
                    bounds.centerY - this.camera.y + entity.velocityY * 0.1
                );
                this.ctx.stroke();
            }
        }
        
        // Draw camera bounds
        if (this.camera.bounds) {
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(
                -this.camera.x,
                -this.camera.y,
                this.camera.bounds.maxX - this.camera.bounds.minX,
                this.camera.bounds.maxY - this.camera.bounds.minY
            );
        }
        
        this.ctx.restore();
    }
    
    /**
     * Render text on screen (not affected by camera)
     */
    renderText(text, x, y, options = {}) {
        const {
            font = '16px Arial',
            color = '#000000',
            align = 'left',
            baseline = 'top',
            shadow = false
        } = options;
        
        this.ctx.save();
        this.ctx.font = font;
        this.ctx.fillStyle = color;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = baseline;
        
        if (shadow) {
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            this.ctx.shadowBlur = 4;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 2;
        }
        
        this.ctx.fillText(text, x, y);
        this.ctx.restore();
    }
    
    /**
     * Render world text (affected by camera)
     */
    renderWorldText(text, x, y, options = {}) {
        const screenX = x - this.camera.x;
        const screenY = y - this.camera.y;
        this.renderText(text, screenX, screenY, options);
    }
    
    /**
     * Draw a line in world space
     */
    drawWorldLine(x1, y1, x2, y2, color = '#000000', width = 1) {
        this.ctx.save();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.moveTo(x1 - this.camera.x, y1 - this.camera.y);
        this.ctx.lineTo(x2 - this.camera.x, y2 - this.camera.y);
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    /**
     * Draw a rectangle in world space
     */
    drawWorldRect(x, y, width, height, color = '#000000', filled = true) {
        this.ctx.save();
        const screenX = x - this.camera.x;
        const screenY = y - this.camera.y;
        
        if (filled) {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(screenX, screenY, width, height);
        } else {
            this.ctx.strokeStyle = color;
            this.ctx.strokeRect(screenX, screenY, width, height);
        }
        
        this.ctx.restore();
    }
    
    /**
     * Calculate and update FPS
     */
    updateFPS(currentTime) {
        if (this.lastFrameTime) {
            const delta = currentTime - this.lastFrameTime;
            this.fps = Math.round(1000 / delta);
        }
        this.lastFrameTime = currentTime;
    }
    
    /**
     * Render FPS counter
     */
    renderFPS() {
        if (!this.debugMode) return;
        
        this.renderText(`FPS: ${this.fps}`, 10, 10, {
            font: '14px monospace',
            color: '#ffffff',
            shadow: true
        });
    }
    
    /**
     * Toggle debug mode
     */
    toggleDebug() {
        this.debugMode = !this.debugMode;
    }
}

// Made with Bob
