/**
 * AssetManager.js - Asset loading and management system
 */

class AssetManager {
    constructor() {
        this.images = new Map();
        this.sounds = new Map();
        this.loadingQueue = [];
        this.loaded = 0;
        this.total = 0;
        this.onProgress = null;
        this.onComplete = null;
    }
    
    /**
     * Add an image to the loading queue
     */
    addImage(key, path) {
        this.loadingQueue.push({
            type: 'image',
            key: key,
            path: path
        });
        this.total++;
    }
    
    /**
     * Add a sound to the loading queue
     */
    addSound(key, path) {
        this.loadingQueue.push({
            type: 'sound',
            key: key,
            path: path
        });
        this.total++;
    }
    
    /**
     * Load all queued assets
     */
    async loadAll() {
        if (this.loadingQueue.length === 0) {
            if (this.onComplete) this.onComplete();
            return Promise.resolve();
        }
        
        const promises = this.loadingQueue.map(asset => {
            if (asset.type === 'image') {
                return this.loadImage(asset.key, asset.path);
            } else if (asset.type === 'sound') {
                return this.loadSound(asset.key, asset.path);
            }
        });
        
        return Promise.all(promises).then(() => {
            if (this.onComplete) this.onComplete();
        });
    }
    
    /**
     * Load a single image
     */
    loadImage(key, path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                this.images.set(key, img);
                this.loaded++;
                if (this.onProgress) {
                    this.onProgress(this.loaded, this.total);
                }
                resolve(img);
            };
            
            img.onerror = () => {
                console.warn(`Failed to load image: ${path}`);
                // Create a placeholder colored rectangle
                const canvas = document.createElement('canvas');
                canvas.width = 64;
                canvas.height = 64;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ff00ff'; // Magenta for missing textures
                ctx.fillRect(0, 0, 64, 64);
                this.images.set(key, canvas);
                this.loaded++;
                if (this.onProgress) {
                    this.onProgress(this.loaded, this.total);
                }
                resolve(canvas);
            };
            
            img.src = path;
        });
    }
    
    /**
     * Load a single sound
     */
    loadSound(key, path) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            
            audio.addEventListener('canplaythrough', () => {
                this.sounds.set(key, audio);
                this.loaded++;
                if (this.onProgress) {
                    this.onProgress(this.loaded, this.total);
                }
                resolve(audio);
            }, { once: true });
            
            audio.addEventListener('error', () => {
                console.warn(`Failed to load sound: ${path}`);
                // Create a silent audio placeholder
                this.sounds.set(key, null);
                this.loaded++;
                if (this.onProgress) {
                    this.onProgress(this.loaded, this.total);
                }
                resolve(null);
            }, { once: true });
            
            audio.src = path;
        });
    }
    
    /**
     * Get an image by key
     */
    getImage(key) {
        return this.images.get(key);
    }
    
    /**
     * Get a sound by key
     */
    getSound(key) {
        return this.sounds.get(key);
    }
    
    /**
     * Play a sound
     */
    playSound(key, volume = 1.0, loop = false) {
        const sound = this.sounds.get(key);
        if (!sound) return null;
        
        // Clone the audio to allow multiple simultaneous plays
        const audio = sound.cloneNode();
        audio.volume = volume;
        audio.loop = loop;
        audio.play().catch(err => {
            console.warn(`Failed to play sound ${key}:`, err);
        });
        
        return audio;
    }
    
    /**
     * Create a colored rectangle as a placeholder sprite
     */
    createColoredSprite(width, height, color) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
        return canvas;
    }
    
    /**
     * Create a simple character sprite with text
     */
    createTextSprite(text, width, height, bgColor, textColor) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
        
        // Border
        ctx.strokeStyle = textColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, width - 2, height - 2);
        
        // Text
        ctx.fillStyle = textColor;
        ctx.font = `bold ${Math.floor(height * 0.6)}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, width / 2, height / 2);
        
        return canvas;
    }
    
    /**
     * Get loading progress (0-1)
     */
    getProgress() {
        return this.total > 0 ? this.loaded / this.total : 1;
    }
    
    /**
     * Check if all assets are loaded
     */
    isLoaded() {
        return this.loaded === this.total;
    }
    
    /**
     * Clear all assets
     */
    clear() {
        this.images.clear();
        this.sounds.clear();
        this.loadingQueue = [];
        this.loaded = 0;
        this.total = 0;
    }
}

// Made with Bob
