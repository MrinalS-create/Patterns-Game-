/**
 * InputManager.js - Handles keyboard and touch input
 */

class InputManager {
    constructor(canvas = null) {
        // Store canvas reference for targeted event listeners
        this.canvas = canvas;
        
        // Game state reference (set by Game.js)
        this.gameState = null;
        
        // Key states
        this.keys = new Map();
        this.keysPressed = new Set(); // Keys pressed this frame
        this.keysReleased = new Set(); // Keys released this frame
        
        // Mouse/Touch state
        this.mouse = {
            x: 0,
            y: 0,
            pressed: false,
            justPressed: false,
            justReleased: false
        };
        
        // Key mappings
        this.keyMap = {
            // Movement
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'KeyA': 'left',
            'KeyD': 'right',
            'KeyW': 'up',
            'KeyS': 'down',
            
            // Actions
            'Space': 'jump',
            'KeyE': 'useTool',  // Use active tool
            'KeyQ': 'interact',
            'Escape': 'pause',
            
            // Tools (1-9)
            'Digit1': 'tool1',
            'Digit2': 'tool2',
            'Digit3': 'tool3',
            'Digit4': 'tool4',
            'Digit5': 'tool5',
            'Digit6': 'tool6',
            'Digit7': 'tool7',
            'Digit8': 'tool8',
            'Digit9': 'tool9',
            
            // Debug
            'KeyF': 'debug'
        };
        
        // Bind event listeners
        this.bindEvents();
    }
    
    /**
     * Bind keyboard and mouse events
     */
    bindEvents() {
        // Keyboard events - on window for global capture
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Mouse events - on window for now (could be canvas-specific)
        window.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // Touch events - ONLY on canvas to avoid interfering with UI modals
        // If no canvas provided, fall back to window but with passive: false
        const touchTarget = this.canvas || window;
        const touchOptions = this.canvas ? true : { passive: false };
        
        touchTarget.addEventListener('touchstart', (e) => this.handleTouchStart(e), touchOptions);
        touchTarget.addEventListener('touchend', (e) => this.handleTouchEnd(e), touchOptions);
        touchTarget.addEventListener('touchmove', (e) => this.handleTouchMove(e), touchOptions);
        
        // Prevent default behavior for game keys ONLY when game is playing
        window.addEventListener('keydown', (e) => {
            // Don't prevent default if game is paused (modal is open)
            if (this.gameState && this.gameState() === 'paused') {
                return; // Let the modal handle the input
            }
            
            if (this.keyMap[e.code]) {
                e.preventDefault();
            }
        });
    }
    
    /**
     * Handle key down event
     */
    handleKeyDown(e) {
        // Don't capture keys if game is paused (modal is open)
        if (this.gameState && this.gameState() === 'paused') {
            return;
        }
        
        const action = this.keyMap[e.code];
        if (!action) return;
        
        // Only register as pressed if it wasn't already down
        if (!this.keys.get(action)) {
            this.keysPressed.add(action);
        }
        
        this.keys.set(action, true);
    }
    
    /**
     * Handle key up event
     */
    handleKeyUp(e) {
        // Don't capture keys if game is paused (modal is open)
        if (this.gameState && this.gameState() === 'paused') {
            return;
        }
        
        const action = this.keyMap[e.code];
        if (!action) return;
        
        this.keys.set(action, false);
        this.keysReleased.add(action);
    }
    
    /**
     * Handle mouse down event
     */
    handleMouseDown(e) {
        this.mouse.pressed = true;
        this.mouse.justPressed = true;
    }
    
    /**
     * Handle mouse up event
     */
    handleMouseUp(e) {
        this.mouse.pressed = false;
        this.mouse.justReleased = true;
    }
    
    /**
     * Handle mouse move event
     */
    handleMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }
    
    /**
     * Handle touch start event
     */
    handleTouchStart(e) {
        // Only preventDefault if we're on the canvas
        if (this.canvas && e.target === this.canvas) {
            e.preventDefault();
        }
        if (e.touches.length > 0) {
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
            this.mouse.pressed = true;
            this.mouse.justPressed = true;
        }
    }
    
    /**
     * Handle touch end event
     */
    handleTouchEnd(e) {
        // Only preventDefault if we're on the canvas
        if (this.canvas && e.target === this.canvas) {
            e.preventDefault();
        }
        this.mouse.pressed = false;
        this.mouse.justReleased = true;
    }
    
    /**
     * Handle touch move event
     */
    handleTouchMove(e) {
        // Only preventDefault if we're on the canvas
        if (this.canvas && e.target === this.canvas) {
            e.preventDefault();
        }
        if (e.touches.length > 0) {
            this.mouse.x = e.touches[0].clientX;
            this.mouse.y = e.touches[0].clientY;
        }
    }
    
    /**
     * Check if a key is currently held down
     */
    isKeyDown(action) {
        return this.keys.get(action) || false;
    }
    
    /**
     * Check if a key was just pressed this frame
     */
    isKeyPressed(action) {
        return this.keysPressed.has(action);
    }
    
    /**
     * Check if a key was just released this frame
     */
    isKeyReleased(action) {
        return this.keysReleased.has(action);
    }
    
    /**
     * Get horizontal axis input (-1 left, 0 none, 1 right)
     */
    getHorizontalAxis() {
        let axis = 0;
        if (this.isKeyDown('left')) axis -= 1;
        if (this.isKeyDown('right')) axis += 1;
        return axis;
    }
    
    /**
     * Get vertical axis input (-1 up, 0 none, 1 down)
     */
    getVerticalAxis() {
        let axis = 0;
        if (this.isKeyDown('up')) axis -= 1;
        if (this.isKeyDown('down')) axis += 1;
        return axis;
    }
    
    /**
     * Check which tool key was pressed (returns 1-9 or null)
     */
    getToolKeyPressed() {
        for (let i = 1; i <= 9; i++) {
            if (this.isKeyPressed(`tool${i}`)) {
                return i;
            }
        }
        return null;
    }
    
    /**
     * Update input state (call at end of frame)
     */
    update() {
        // Clear frame-specific input states
        this.keysPressed.clear();
        this.keysReleased.clear();
        this.mouse.justPressed = false;
        this.mouse.justReleased = false;
    }
    
    /**
     * Reset all input states
     */
    reset() {
        this.keys.clear();
        this.keysPressed.clear();
        this.keysReleased.clear();
        this.mouse.pressed = false;
        this.mouse.justPressed = false;
        this.mouse.justReleased = false;
    }
}

// Made with Bob
