/**
 * Game.js - Main game class with game loop and level management
 */

class Game {
    constructor(canvas) {
        // Core systems
        this.renderer = new Renderer(canvas);
        this.physics = new Physics();
        this.input = new InputManager(canvas); // Pass canvas to prevent touch event conflicts with modals
        
        // Give InputManager access to game state so it can disable input during modals
        this.input.gameState = () => this.state;
        
        this.assets = new AssetManager();
        this.collisionSystem = new CollisionSystem(this.physics);
        this.progressSystem = new ProgressSystem();
        this.toolSystem = new ToolSystem();
        this.interactiveLearningSystem = new InteractiveLearningSystem();
        this.tutorialSystem = new TutorialSystem();
        this.notificationSystem = new NotificationSystem();
        
        // Game state
        this.state = 'loading'; // loading, menu, playing, paused, levelComplete, gameOver
        this.currentLevel = null;
        this.player = null;
        
        // Entities
        this.platforms = [];
        this.enemies = [];
        this.collectibles = [];
        this.goal = null;
        
        // Game loop
        this.lastTime = 0;
        this.accumulator = 0;
        this.fixedTimeStep = 1 / 60; // 60 FPS
        this.running = false;
        
        // Level data
        this.levelTimer = 0;
        this.levelScore = 0;
        this.evidenceCollected = 0;
        
        // UI elements
        this.ui = {
            healthBar: document.getElementById('health-fill'),
            healthValue: document.getElementById('health-value'),
            toolSlots: document.getElementById('tool-slots'),
            masteryBars: document.getElementById('mastery-bars'),
            levelName: document.getElementById('level-name'),
            timerValue: document.getElementById('timer-value'),
            pauseMenu: document.getElementById('pause-menu'),
            levelStart: document.getElementById('level-start'),
            levelComplete: document.getElementById('level-complete')
        };
        
        // Initialize
        this.init();
    }
    
    /**
     * Initialize game
     */
    async init() {
        // Setup canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Setup UI event listeners
        this.setupUIListeners();
        
        // Load assets (placeholder for now)
        await this.loadAssets();
        
        // Initialize UI
        this.initializeUI();
        
        // Load test level
        this.loadLevel('world1-1');
        
        // Start game loop
        this.start();
    }
    
    /**
     * Resize canvas to fit window
     */
    resizeCanvas() {
        const container = document.getElementById('game-container');
        const aspectRatio = 16 / 9;
        let width = window.innerWidth;
        let height = window.innerHeight;
        
        // Maintain aspect ratio
        if (width / height > aspectRatio) {
            width = height * aspectRatio;
        } else {
            height = width / aspectRatio;
        }
        
        this.renderer.resize(Math.floor(width * 0.9), Math.floor(height * 0.9));
    }
    
    /**
     * Load game assets
     */
    async loadAssets() {
        // For Phase 1, we're using programmatically generated sprites
        // Future phases can add actual image assets here
        this.state = 'ready';
    }
    
    /**
     * Setup UI event listeners
     */
    setupUIListeners() {
        // Pause menu
        document.getElementById('resume-btn')?.addEventListener('click', () => this.resume());
        document.getElementById('restart-btn')?.addEventListener('click', () => this.restartLevel());
        document.getElementById('quit-btn')?.addEventListener('click', () => this.quitToMenu());
        
        // Level start
        document.getElementById('start-level-btn')?.addEventListener('click', () => this.startLevel());
        
        // Level complete
        document.getElementById('next-level-btn')?.addEventListener('click', () => this.nextLevel());
        document.getElementById('replay-btn')?.addEventListener('click', () => this.restartLevel());
    }
    
    /**
     * Initialize UI elements
     */
    initializeUI() {
        // Create tool slots
        if (this.ui.toolSlots) {
            this.ui.toolSlots.innerHTML = '';
            for (let i = 0; i < 9; i++) {
                const slot = document.createElement('div');
                slot.className = 'tool-slot';
                slot.innerHTML = `
                    <div class="tool-icon"></div>
                    <div class="tool-key">${i + 1}</div>
                    <div class="tool-cooldown"></div>
                `;
                this.ui.toolSlots.appendChild(slot);
            }
        }
        
        // Create mastery bars - Day 1 Frameworks
        if (this.ui.masteryBars) {
            this.ui.masteryBars.innerHTML = '';
            const frameworks = [
                'Marginal Thinking',
                'Problem Definition',
                'EDT Framework',
                'PDLC Framework',
                'Psychological Safety',
                'Playbacks to Execs',
                'Universal Experiences'
            ];
            frameworks.forEach(framework => {
                const item = document.createElement('div');
                item.className = 'mastery-item';
                item.innerHTML = `
                    <div class="mastery-name">${framework}</div>
                    <div class="mastery-bar">
                        <div class="mastery-fill" data-framework="${framework}"></div>
                    </div>
                    <div class="mastery-value" data-framework="${framework}">0%</div>
                `;
                this.ui.masteryBars.appendChild(item);
            });
        }
    }
    
    /**
     * Load a level
     */
    loadLevel(levelId) {
        this.currentLevel = levelId;
        this.levelTimer = 0;
        this.levelScore = 0;
        this.evidenceCollected = 0;
        
        // Clear existing entities
        this.platforms = [];
        this.enemies = [];
        this.collectibles = [];
        this.goal = null;
        
        // Create level based on ID
        switch (levelId) {
            case 'world1-1':
                this.createTestLevel();
                break;
            default:
                this.createTestLevel();
        }
        
        // Show level start screen
        this.showLevelStart();
    }
    
    /**
     * Create test level (World 1-1) - Complete Day 1 Learning Journey
     */
    createTestLevel() {
        const levelWidth = 2800; // Adjusted for 7 frameworks (removed 2)
        const levelHeight = 800;
        
        // Create player
        this.player = new Player(100, 400);
        
        // Create platforms - Progressive journey through Day 1 (7 frameworks)
        // Ground
        this.platforms.push(this.createPlatform(0, 700, levelWidth, 100, '#8d6e63'));
        
        // Section 1: Marginal Thinking (300-500)
        this.platforms.push(this.createPlatform(300, 600, 200, 20, '#a1887f'));
        
        // Section 2: Problem Definition (600-800)
        this.platforms.push(this.createPlatform(600, 550, 200, 20, '#a1887f'));
        
        // Section 3: EDT Framework (900-1100)
        this.platforms.push(this.createPlatform(900, 500, 200, 20, '#a1887f'));
        
        // Section 4: PDLC Framework (1200-1400)
        this.platforms.push(this.createPlatform(1200, 450, 200, 20, '#a1887f'));
        
        // Section 5: Psychological Safety (1500-1700)
        this.platforms.push(this.createPlatform(1500, 500, 200, 20, '#a1887f'));
        
        // Section 6: Playbacks to Execs (1800-2000)
        this.platforms.push(this.createPlatform(1800, 550, 200, 20, '#a1887f'));
        
        // Connecting platform (2000-2100)
        this.platforms.push(this.createPlatform(2000, 525, 150, 20, '#a1887f'));
        
        // Section 7: Universal Experiences (2150-2350)
        this.platforms.push(this.createPlatform(2150, 500, 200, 20, '#a1887f'));
        
        // Final platform to goal (2450-2650)
        this.platforms.push(this.createPlatform(2450, 600, 200, 20, '#a1887f'));
        
        // Walls
        this.platforms.push(this.createPlatform(-50, 0, 50, levelHeight, '#5d4037'));
        this.platforms.push(this.createPlatform(levelWidth, 0, 50, levelHeight, '#5d4037'));
        
        // Create enemies (representing challenges in learning)
        this.enemies.push(new Enemy(500, 650, 50, 50, 'confusion_fog'));
        this.enemies.push(new Enemy(1000, 650, 50, 50, 'confusion_fog'));
        this.enemies.push(new Enemy(1600, 650, 50, 50, 'confusion_fog'));
        this.enemies.push(new Enemy(2200, 650, 50, 50, 'confusion_fog'));
        
        // Create collectibles - 7 Day 1 Frameworks (removed Storytelling and Sandbox Testing)
        
        // 1. Marginal Thinking (Outcome before Output)
        this.collectibles.push(createToolCollectible(400, 550, 'marginal_thinking'));
        
        // 2. Problem Definition (Usable, Feasible, Valuable)
        this.collectibles.push(createToolCollectible(700, 500, 'problem_definition'));
        
        // 3. EDT Framework (Observe, Reflect, Make)
        this.collectibles.push(createToolCollectible(1000, 450, 'edt_framework'));
        
        // 4. PDLC Framework (Discovery, Delivery, Launch & Scale)
        this.collectibles.push(createToolCollectible(1300, 400, 'pdlc_framework'));
        
        // 5. Psychological Safety (Trust enables performance)
        this.collectibles.push(createToolCollectible(1600, 450, 'psychological_safety'));
        
        // 6. Playbacks to Executives (Get to the point, explain WHY)
        this.collectibles.push(createToolCollectible(1900, 500, 'playbacks_execs'));
        
        // 7. Universal Experiences (9-stage customer journey)
        this.collectibles.push(createToolCollectible(2250, 450, 'universal_experiences'));
        
        // Evidence pieces (scattered throughout level)
        const evidencePositions = [
            {x: 250, y: 650},
            {x: 550, y: 650},
            {x: 850, y: 650},
            {x: 1150, y: 650},
            {x: 1450, y: 650},
            {x: 1750, y: 650},
            {x: 2050, y: 650}
        ];
        evidencePositions.forEach(pos => {
            this.collectibles.push(new Collectible(pos.x, pos.y, 'evidence'));
        });
        
        // Health pickups
        this.collectibles.push(new Collectible(1100, 400, 'health'));
        this.collectibles.push(new Collectible(2050, 400, 'health'));
        
        // Create goal
        this.goal = this.createGoal(2650, 600);
        
        // Setup camera
        this.renderer.setCameraTarget(this.player);
        this.renderer.setCameraBounds(0, levelWidth, 0, levelHeight);
        
        // Update UI
        if (this.ui.levelName) {
            this.ui.levelName.textContent = 'Day 1: Complete Learning Journey - 7 Frameworks';
        }
    }
    
    /**
     * Create a platform entity
     */
    createPlatform(x, y, width, height, color) {
        const platform = new Entity(x, y, width, height);
        platform.type = 'platform';
        platform.color = color;
        platform.velocityX = 0;
        platform.velocityY = 0;
        return platform;
    }
    
    /**
     * Create goal entity
     */
    createGoal(x, y) {
        const goal = new Entity(x, y, 60, 80);
        goal.type = 'goal';
        goal.color = '#24a148';
        goal.solid = false;
        
        // Create portal sprite
        const canvas = document.createElement('canvas');
        canvas.width = goal.width;
        canvas.height = goal.height;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#24a148';
        ctx.fillRect(0, 0, goal.width, goal.height);
        ctx.strokeStyle = '#198038';
        ctx.lineWidth = 3;
        ctx.strokeRect(2, 2, goal.width - 4, goal.height - 4);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🚪', goal.width / 2, goal.height / 2);
        
        goal.sprite = canvas;
        return goal;
    }
    
    /**
     * Show level start screen
     */
    showLevelStart() {
        this.state = 'levelStart';
        if (this.ui.levelStart) {
            this.ui.levelStart.classList.remove('hidden');
        }
    }
    
    /**
     * Start level (hide start screen and begin playing)
     */
    startLevel() {
        this.state = 'playing';
        if (this.ui.levelStart) {
            this.ui.levelStart.classList.add('hidden');
        }
        
        // Show level objective
        this.notificationSystem.showObjective('Collect EDT Lens, defeat 3 enemies, reach the exit!');
    }
    
    /**
     * Start game loop
     */
    start() {
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    /**
     * Stop game loop
     */
    stop() {
        this.running = false;
    }
    
    /**
     * Main game loop with fixed timestep
     */
    gameLoop(currentTime) {
        if (!this.running) return;
        
        // Calculate delta time
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Accumulate time
        this.accumulator += deltaTime;
        
        // Fixed timestep updates
        while (this.accumulator >= this.fixedTimeStep) {
            this.update(this.fixedTimeStep);
            this.accumulator -= this.fixedTimeStep;
        }
        
        // Render
        this.render();
        
        // Update FPS
        this.renderer.updateFPS(currentTime);
        
        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    /**
     * Update game state
     */
    update(deltaTime) {
        // Only handle input when not paused (modal open)
        if (this.state !== 'paused') {
            this.handleInput();
        }
        
        // Update based on state
        switch (this.state) {
            case 'playing':
                this.updatePlaying(deltaTime);
                break;
            case 'paused':
                // Don't update game entities when paused
                // Don't handle input - let modal handle it
                break;
        }
        
        // Update input manager (clear frame-specific states)
        this.input.update();
    }
    
    /**
     * Handle input
     */
    handleInput() {
        // Pause/unpause
        if (this.input.isKeyPressed('pause')) {
            if (this.state === 'playing') {
                this.pause();
            } else if (this.state === 'paused') {
                this.resume();
            }
        }
        
        // Debug toggle
        if (this.input.isKeyPressed('debug')) {
            this.renderer.toggleDebug();
        }
        
        // Tool activation with E key (simple) or number keys (advanced)
        if (this.state === 'playing') {
            // E key - use first available tool
            if (this.input.isKeyPressed('useTool')) {
                console.log('E key pressed - using first tool');
                // Find first tool slot that has a tool
                for (let i = 0; i < this.toolSystem.slots.length; i++) {
                    if (this.toolSystem.slots[i] !== null) {
                        console.log(`Found tool in slot ${i}`);
                        const activated = this.toolSystem.activateTool(i, this.player);
                        console.log(`Tool activated: ${activated}`);
                        if (activated) {
                            const tool = this.toolSystem.getTool(i);
                            console.log(`Tool:`, tool);
                            this.tutorialSystem.triggerEvent('usedTool');
                            if (tool) {
                                this.notificationSystem.showToolActivated(tool.name);
                            }
                        }
                        break; // Only use first tool
                    }
                }
            }
            
            // Number keys 1-9 - use specific tool slot
            const toolKey = this.input.getToolKeyPressed();
            if (toolKey !== null) {
                console.log(`Tool key pressed: ${toolKey}`);
                const activated = this.toolSystem.activateTool(toolKey - 1, this.player);
                console.log(`Tool activated: ${activated}`);
                if (activated) {
                    const tool = this.toolSystem.getTool(toolKey - 1);
                    console.log(`Tool:`, tool);
                    this.tutorialSystem.triggerEvent('usedTool');
                    if (tool) {
                        this.notificationSystem.showToolActivated(tool.name);
                    }
                }
            }
        }
    }
    
    /**
     * Update playing state
     */
    updatePlaying(deltaTime) {
        // Update timer
        this.levelTimer += deltaTime;
        
        // Track player movement for tutorials
        const horizontalInput = this.input.getHorizontalAxis();
        if (horizontalInput < 0) {
            this.tutorialSystem.triggerEvent('movedLeft');
        } else if (horizontalInput > 0) {
            this.tutorialSystem.triggerEvent('movedRight');
        }
        
        // Track jumping
        if (this.input.isKeyPressed('jump')) {
            if (this.player.isGrounded) {
                this.tutorialSystem.triggerEvent('jumped');
            } else if (this.player.jumpsRemaining < this.player.maxJumps) {
                this.tutorialSystem.triggerEvent('doubleJumped');
            }
        }
        
        // Update player
        this.player.update(deltaTime, this.input, this.physics, this.platforms);
        
        // Update enemies
        for (const enemy of this.enemies) {
            enemy.update(deltaTime, this.player, this.physics, this.platforms);
        }
        
        // Update collectibles
        for (const collectible of this.collectibles) {
            collectible.update(deltaTime);
        }
        
        // Update tool system
        this.toolSystem.update(deltaTime, this.player);
        
        // Handle collisions
        this.handleCollisions();
        
        // Update tutorial system
        this.tutorialSystem.update(deltaTime, {
            player: this.player,
            enemies: this.enemies,
            collectibles: this.collectibles
        });
        
        // Update notification system
        this.notificationSystem.update(deltaTime);
        
        // Update camera
        this.renderer.updateCamera();
        
        // Update UI
        this.updateUI();
        
        // Check win condition
        if (this.collisionSystem.checkGoalCollision(this.player, this.goal)) {
            this.tutorialSystem.triggerEvent('reachedGoal');
            this.completeLevel();
        }
        
        // Check lose condition
        if (this.player.state === 'dead') {
            this.gameOver();
        }
    }
    
    /**
     * Handle all collisions
     */
    handleCollisions() {
        // Player vs platforms
        this.collisionSystem.handlePlayerPlatformCollisions(this.player, this.platforms);
        
        // Track player health before enemy collision
        const healthBefore = this.player.health;
        
        // Player vs enemies
        const hitEnemies = this.collisionSystem.handlePlayerEnemyCollisions(this.player, this.enemies);
        for (const enemy of hitEnemies) {
            if (!enemy.active) {
                this.levelScore += enemy.scoreValue;
                this.progressSystem.updateStats('enemiesDefeated', 1);
                this.tutorialSystem.triggerEvent('defeatedEnemy');
                
                // Show what you learned from defeating this enemy
                const enemyLessons = {
                    'confusion_fog': '✓ Overcame Confusion! You learned to navigate unclear requirements.',
                    'scope_creep': '✓ Defeated Scope Creep! You learned to focus on outcomes.',
                    'assumption_beast': '✓ Challenged Assumptions! You learned to validate before building.'
                };
                const lesson = enemyLessons[enemy.enemyType] || `✓ Defeated ${enemy.enemyType}!`;
                this.notificationSystem.showSuccess(lesson);
                
                // Gain mastery for defeating challenges
                this.progressSystem.updateFrameworkMastery('PDLC', 5);
            }
        }
        
        // Check if player took damage
        if (this.player.health < healthBefore) {
            const damage = healthBefore - this.player.health;
            this.tutorialSystem.triggerEvent('tookDamage');
            this.notificationSystem.showDamageTaken(damage);
        }
        
        // Player vs collectibles
        const collected = this.collisionSystem.handlePlayerCollectibleCollisions(this.player, this.collectibles);
        for (const item of collected) {
            this.levelScore += item.scoreValue;
            if (item.type === 'evidence') {
                this.evidenceCollected++;
                this.tutorialSystem.triggerEvent('collectedEvidence');
                
                // Evidence teaches you about building with data
                const evidenceLessons = [
                    '📊 Evidence collected! Building confidence through data.',
                    '📈 More evidence! Moving from intuition to validation.',
                    '🎯 Evidence gathered! Reducing risk with user insights.',
                    '✅ Evidence found! Testing assumptions before building.',
                    '🔍 Final evidence! You can\'t improve what you don\'t measure.'
                ];
                const lessonIndex = Math.min(this.evidenceCollected - 1, evidenceLessons.length - 1);
                this.notificationSystem.showSuccess(evidenceLessons[lessonIndex]);
                
                // Gain mastery for collecting evidence
                this.progressSystem.updateFrameworkMastery('Execution', 3);
            } else if (item.type === 'tool') {
                // Add tool to inventory
                const slotIndex = this.toolSystem.slots.findIndex(slot => slot === null);
                console.log(`[Game] Collecting tool: ${item.toolName}, slot: ${slotIndex}`);
                
                if (slotIndex !== -1) {
                    try {
                        // Convert tool name to ID, handling special cases
                        let toolId = item.toolName.toLowerCase().replace(/ /g, '_');
                        // Special case: "Playbacks to Execs" -> "playbacks_execs" (remove "to")
                        toolId = toolId.replace('_to_', '_');
                        console.log(`[Game] Tool name: "${item.toolName}" -> Tool ID: "${toolId}"`);
                        
                        const added = this.toolSystem.addTool(toolId, slotIndex);
                        console.log(`[Game] Tool added: ${added}`, this.toolSystem.slots[slotIndex]);
                        
                        // Pause game and show interactive learning modal
                        this.state = 'paused';
                        
                        // Clear all input states to prevent stuck keys
                        this.input.reset();
                        
                        console.log(`[Game] Game paused, showing framework modal for: ${toolId}`);
                        
                        this.interactiveLearningSystem.showFramework(toolId, (mastery) => {
                            console.log(`[Game] Modal completed, mastery:`, mastery);
                            
                            // Resume game after modal closes
                            this.state = 'playing';
                            
                            // Clear input states again to prevent stuck keys after resume
                            this.input.reset();
                            
                            console.log(`[Game] Game resumed`);
                            
                            // Update progress and show framework mastery gain
                            if (mastery) {
                                this.progressSystem.updateFrameworkMastery(mastery.framework, mastery.points);
                                this.notificationSystem.showSuccess(`+${mastery.points} ${mastery.framework} Mastery!`);
                            }
                        });
                        
                        this.progressSystem.addTool(item.toolName, item);
                        this.tutorialSystem.triggerEvent('collectedTool');
                        
                    } catch (error) {
                        console.error('[Game] Error handling tool collection:', error);
                        console.error('[Game] Stack trace:', error.stack);
                        
                        // Resume game on error
                        this.state = 'playing';
                        this.notificationSystem.showError('Error loading learning content. Please try again.');
                    }
                }
            }
        }
        
        // Enemies vs platforms
        this.collisionSystem.handleEnemyPlatformCollisions(this.enemies, this.platforms);
        
        // Check boundaries (match level width)
        this.collisionSystem.checkBoundaries(this.player, {
            minX: 0,
            maxX: 2800, // Match levelWidth from createTestLevel
            minY: 0,
            maxY: 1000
        });
    }
    
    /**
     * Update UI elements
     */
    updateUI() {
        // Health bar
        if (this.ui.healthBar && this.ui.healthValue) {
            const healthPercent = (this.player.health / this.player.maxHealth) * 100;
            this.ui.healthBar.style.width = `${healthPercent}%`;
            this.ui.healthValue.textContent = Math.floor(this.player.health);
        }
        
        // Timer
        if (this.ui.timerValue) {
            const minutes = Math.floor(this.levelTimer / 60);
            const seconds = Math.floor(this.levelTimer % 60);
            this.ui.timerValue.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Tool slots
        const slots = this.toolSystem.getSlotsForUI();
        const slotElements = this.ui.toolSlots?.children;
        if (slotElements) {
            slots.forEach((slot, i) => {
                const element = slotElements[i];
                if (!element) return;
                
                if (slot.tool) {
                    element.classList.add('has-tool');
                    element.querySelector('.tool-icon').textContent = slot.tool.icon;
                    
                    if (slot.cooldown > 0) {
                        element.classList.add('cooldown');
                        element.querySelector('.tool-cooldown').textContent = Math.ceil(slot.cooldown);
                    } else {
                        element.classList.remove('cooldown');
                        element.querySelector('.tool-cooldown').textContent = '';
                    }
                    
                    if (slot.active) {
                        element.classList.add('active');
                    } else {
                        element.classList.remove('active');
                    }
                } else {
                    element.classList.remove('has-tool', 'active', 'cooldown');
                    element.querySelector('.tool-icon').textContent = '';
                    element.querySelector('.tool-cooldown').textContent = '';
                }
            });
        }
        
        // Mastery bars - Day 1 Frameworks
        const frameworks = [
            'Marginal Thinking',
            'Problem Definition',
            'EDT Framework',
            'PDLC Framework',
            'Psychological Safety',
            'Playbacks to Execs',
            'Universal Experiences'
        ];
        frameworks.forEach(framework => {
            const mastery = this.progressSystem.getMastery(framework);
            const fillElement = document.querySelector(`.mastery-fill[data-framework="${framework}"]`);
            const valueElement = document.querySelector(`.mastery-value[data-framework="${framework}"]`);
            
            if (fillElement) fillElement.style.width = `${mastery}%`;
            if (valueElement) valueElement.textContent = `${mastery}%`;
        });
    }
    
    /**
     * Render game
     */
    render() {
        // Clear canvas
        this.renderer.clear();
        
        // Render entities
        const allEntities = [
            ...this.platforms,
            ...this.collectibles,
            ...this.enemies,
            this.player,
            this.goal
        ].filter(e => e && e.active);
        
        this.renderer.renderEntities(allEntities);
        
        // Render notifications (on top of game world)
        this.notificationSystem.render(this.renderer.ctx, this.renderer.camera);
        
        // Render debug info
        this.renderer.renderDebug(allEntities);
        this.renderer.renderFPS();
    }
    
    /**
     * Pause game
     */
    pause() {
        this.state = 'paused';
        if (this.ui.pauseMenu) {
            this.ui.pauseMenu.classList.remove('hidden');
        }
    }
    
    /**
     * Resume game
     */
    resume() {
        this.state = 'playing';
        if (this.ui.pauseMenu) {
            this.ui.pauseMenu.classList.add('hidden');
        }
    }
    
    /**
     * Restart current level
     */
    restartLevel() {
        this.loadLevel(this.currentLevel);
        this.resume();
    }
    
    /**
     * Complete level
     */
    completeLevel() {
        this.state = 'levelComplete';
        
        // Save progress
        this.progressSystem.completeLevel(
            this.currentLevel,
            this.levelScore,
            this.levelTimer,
            this.evidenceCollected
        );
        
        // Show completion screen
        if (this.ui.levelComplete) {
            this.ui.levelComplete.classList.remove('hidden');
            
            // Update stats
            document.getElementById('complete-time').textContent = 
                `${Math.floor(this.levelTimer / 60)}:${Math.floor(this.levelTimer % 60).toString().padStart(2, '0')}`;
            document.getElementById('complete-evidence').textContent = 
                `${this.evidenceCollected}/5`;
            document.getElementById('complete-mastery').textContent = 
                `+${Math.floor(this.levelScore / 10)}`;
        }
    }
    
    /**
     * Go to next level
     */
    nextLevel() {
        // Hide level complete screen
        if (this.ui.levelComplete) {
            this.ui.levelComplete.classList.add('hidden');
        }
        
        // For Phase 1, just restart the test level
        this.restartLevel();
    }
    
    /**
     * Game over
     */
    gameOver() {
        this.state = 'gameOver';
        this.progressSystem.updateStats('deaths', 1);
        
        // Show game over screen (reuse level complete for now)
        setTimeout(() => {
            this.restartLevel();
        }, 2000);
    }
    
    /**
     * Quit to menu
     */
    quitToMenu() {
        // For Phase 1, just restart
        this.restartLevel();
    }
}

// Made with Bob
