/**
 * Collectible.js - Collectible items (tools, evidence, power-ups)
 */

class Collectible extends Entity {
    constructor(x, y, collectibleType = 'evidence') {
        // Size varies by type
        const size = collectibleType === 'tool' ? 40 : 30;
        super(x, y, size, size);
        
        this.type = 'collectible';
        this.collectibleType = collectibleType;
        
        // Properties
        this.collected = false;
        this.scoreValue = 10;
        this.solid = false; // Can pass through
        
        // Animation
        this.bobOffset = 0;
        this.bobSpeed = 2;
        this.bobAmount = 5;
        this.rotationAngle = 0;
        this.rotationSpeed = 2;
        
        // Tool-specific properties
        this.toolName = '';
        this.toolDescription = '';
        this.frameworkType = ''; // EDT, PDLC, etc.
        
        // Setup based on type
        this.setupCollectible();
    }
    
    /**
     * Setup collectible properties based on type
     */
    setupCollectible() {
        switch (this.collectibleType) {
            case 'tool':
                this.scoreValue = 100;
                this.color = '#0f62fe';
                break;
            case 'evidence':
                this.scoreValue = 10;
                this.color = '#f1c21b';
                break;
            case 'health':
                this.scoreValue = 0;
                this.color = '#24a148';
                break;
            case 'energy':
                this.scoreValue = 0;
                this.color = '#8a3ffc';
                break;
        }
        
        this.createSprite();
    }
    
    /**
     * Create collectible sprite
     */
    createSprite() {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext('2d');
        
        switch (this.collectibleType) {
            case 'tool':
                this.createToolSprite(ctx);
                break;
            case 'evidence':
                this.createEvidenceSprite(ctx);
                break;
            case 'health':
                this.createHealthSprite(ctx);
                break;
            case 'energy':
                this.createEnergySprite(ctx);
                break;
        }
        
        this.sprite = canvas;
    }
    
    /**
     * Create tool sprite
     */
    createToolSprite(ctx) {
        // Hexagon shape for tools
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = this.width / 2 - 2;
        
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        
        // Fill
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Border
        ctx.strokeStyle = '#001d6c';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Icon
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('T', centerX, centerY);
    }
    
    /**
     * Create evidence sprite (star)
     */
    createEvidenceSprite(ctx) {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const outerRadius = this.width / 2 - 2;
        const innerRadius = outerRadius / 2;
        const points = 5;
        
        ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI / points) * i - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        
        // Fill
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Border
        ctx.strokeStyle = '#8e6a00';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    /**
     * Create health sprite (heart)
     */
    createHealthSprite(ctx) {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        // Simple heart shape using circles and triangle
        ctx.fillStyle = this.color;
        
        // Left circle
        ctx.beginPath();
        ctx.arc(centerX - 5, centerY - 3, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Right circle
        ctx.beginPath();
        ctx.arc(centerX + 5, centerY - 3, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Bottom triangle
        ctx.beginPath();
        ctx.moveTo(centerX - 12, centerY);
        ctx.lineTo(centerX, centerY + 12);
        ctx.lineTo(centerX + 12, centerY);
        ctx.closePath();
        ctx.fill();
        
        // Border
        ctx.strokeStyle = '#198038';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    /**
     * Create energy sprite (lightning bolt)
     */
    createEnergySprite(ctx) {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        // Lightning bolt shape
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(centerX + 2, centerY - 12);
        ctx.lineTo(centerX - 4, centerY);
        ctx.lineTo(centerX + 2, centerY);
        ctx.lineTo(centerX - 2, centerY + 12);
        ctx.lineTo(centerX + 6, centerY - 2);
        ctx.lineTo(centerX + 2, centerY - 2);
        ctx.closePath();
        ctx.fill();
        
        // Border
        ctx.strokeStyle = '#6929c4';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    /**
     * Update collectible (bobbing animation)
     */
    update(deltaTime) {
        if (!this.active || this.collected) return;
        
        // Bobbing animation
        this.bobOffset += this.bobSpeed * deltaTime;
        
        // Rotation animation
        this.rotationAngle += this.rotationSpeed * deltaTime;
        if (this.rotationAngle > Math.PI * 2) {
            this.rotationAngle -= Math.PI * 2;
        }
    }
    
    /**
     * Render collectible with animations
     */
    render(ctx, camera) {
        if (!this.visible || this.collected) return;
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y + Math.sin(this.bobOffset) * this.bobAmount;
        
        ctx.save();
        
        // Translate to center for rotation
        ctx.translate(screenX + this.width / 2, screenY + this.height / 2);
        ctx.rotate(this.rotationAngle);
        
        // Draw sprite centered
        ctx.drawImage(this.sprite, -this.width / 2, -this.height / 2, this.width, this.height);
        
        // Add glow effect
        ctx.globalAlpha = 0.3;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        ctx.drawImage(this.sprite, -this.width / 2, -this.height / 2, this.width, this.height);
        
        ctx.restore();
        
        // Draw label for tools
        if (this.collectibleType === 'tool' && this.toolName) {
            ctx.save();
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            
            const labelY = screenY + this.height + 5;
            ctx.strokeText(this.toolName, screenX + this.width / 2, labelY);
            ctx.fillText(this.toolName, screenX + this.width / 2, labelY);
            ctx.restore();
        }
    }
    
    /**
     * Collect this item
     */
    collect() {
        this.collected = true;
        this.active = false;
        this.visible = false;
        return {
            type: this.collectibleType,
            scoreValue: this.scoreValue,
            toolName: this.toolName,
            frameworkType: this.frameworkType
        };
    }
    
    /**
     * Set tool properties
     */
    setToolProperties(name, description, framework) {
        this.toolName = name;
        this.toolDescription = description;
        this.frameworkType = framework;
        return this;
    }
}

/**
 * Factory function to create specific tool collectibles
 */
function createToolCollectible(x, y, toolType) {
    const tool = new Collectible(x, y, 'tool');
    
    switch (toolType) {
        // Day 1 Frameworks
        case 'marginal_thinking':
            tool.setToolProperties(
                'Marginal Thinking',
                'Outcome before Output',
                'EDT'
            );
            break;
        case 'problem_definition':
            tool.setToolProperties(
                'Problem Definition',
                'Usable, Feasible, Valuable',
                'PDLC'
            );
            break;
        case 'edt_framework':
            tool.setToolProperties(
                'EDT Framework',
                'Observe, Reflect, Make',
                'EDT'
            );
            break;
        case 'pdlc_framework':
            tool.setToolProperties(
                'PDLC Framework',
                'Discovery, Delivery, Launch & Scale',
                'PDLC'
            );
            break;
        case 'psychological_safety':
            tool.setToolProperties(
                'Psychological Safety',
                'Trust enables performance',
                'Team'
            );
            break;
        case 'playbacks_execs':
            tool.setToolProperties(
                'Playbacks to Execs',
                'Get to the point, explain WHY',
                'Communication'
            );
            break;
        case 'storytelling':
            tool.setToolProperties(
                'Storytelling',
                'Context and connection',
                'Communication'
            );
            break;
        case 'sandbox_testing':
            tool.setToolProperties(
                'Sandbox Testing',
                'Test before committing',
                'Execution'
            );
            break;
        case 'universal_experiences':
            tool.setToolProperties(
                'Universal Experiences',
                '9-stage customer journey',
                'Impact'
            );
            break;
            
        // Legacy tools (for backward compatibility)
        case 'edt_lens':
            tool.setToolProperties(
                'EDT Lens',
                'See through confusion and identify the real problem',
                'EDT'
            );
            break;
        case 'outcome_compass':
            tool.setToolProperties(
                'Outcome Compass',
                'Navigate toward meaningful outcomes',
                'EDT'
            );
            break;
        case 'pdlc_compass':
            tool.setToolProperties(
                'PDLC Compass',
                'Navigate through Discovery, Delivery, and Launch phases',
                'PDLC'
            );
            break;
        case 'trust_shield':
            tool.setToolProperties(
                'Trust Shield',
                'Build psychological safety in your team',
                'Team'
            );
            break;
        case 'story_scroll':
            tool.setToolProperties(
                'Story Scroll',
                'Craft compelling narratives for executives',
                'Communication'
            );
            break;
        case 'metrics_meter':
            tool.setToolProperties(
                'Metrics Meter',
                'Measure consumability and user success',
                'Execution'
            );
            break;
        case 'hills_hammer':
            tool.setToolProperties(
                'Hills Hammer',
                'Write impactful outcome statements',
                'Impact'
            );
            break;
        default:
            console.warn(`Unknown tool type: ${toolType}`);
            tool.setToolProperties(
                'Unknown Tool',
                'Description not available',
                'EDT'
            );
    }
    
    return tool;
}

// Made with Bob
