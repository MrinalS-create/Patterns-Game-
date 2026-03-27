/**
 * Interactive Learning System
 * 
 * Framework-based learning with:
 * 1. Core concept explanation
 * 2. Use cases from training
 * 3. Interactive challenges (multiple choice)
 * 4. Text validation (type understanding)
 * 5. Must complete to continue
 */

class InteractiveLearningSystem {
    constructor() {
        this.currentFramework = null;
        this.currentStep = 0; // 0: concept, 1: use cases, 2: challenge, 3: validation
        this.isActive = false;
        this.onComplete = null;
        this.modalCreated = false;
        
        // Don't create modal in constructor - wait for first use
        this.overlay = null;
        this.modal = null;
        
        this.loadFrameworkContent();
    }
    
    createModal() {
        if (this.modalCreated) return;
        
        // Create modal overlay
        this.overlay = document.createElement('div');
        this.overlay.id = 'interactive-learning-overlay';
        this.overlay.className = 'modal-overlay hidden';
        
        // Create modal container
        this.modal = document.createElement('div');
        this.modal.id = 'interactive-learning-modal';
        this.modal.className = 'interactive-learning-modal';
        
        // Modal content
        this.modal.innerHTML = `
            <div class="modal-header">
                <button class="modal-close-btn" id="modal-close-btn" title="Close (you can come back later)">×</button>
                <h2 id="framework-title"></h2>
                <div class="progress-dots" id="progress-dots"></div>
            </div>
            <div class="modal-body" id="modal-body">
                <!-- Dynamic content goes here -->
            </div>
            <div class="modal-footer">
                <button id="prev-btn" class="btn btn-secondary">Previous</button>
                <button id="next-btn" class="btn btn-primary">Next</button>
            </div>
        `;
        
        this.overlay.appendChild(this.modal);
        document.body.appendChild(this.overlay);
        
        // Event listeners
        document.getElementById('prev-btn').addEventListener('click', () => this.previousStep());
        document.getElementById('next-btn').addEventListener('click', () => this.nextStep());
        document.getElementById('modal-close-btn').addEventListener('click', () => this.closeModal());
        
        this.modalCreated = true;
    }
    
    loadFrameworkContent() {
        this.frameworks = {
            'marginal_thinking': {
                title: '🎯 Marginal Thinking',
                icon: '🎯',
                concept: {
                    title: 'Start with BIGGER OUTCOME, then think about OUTPUT',
                    description: 'Outcome-first thinking means understanding WHY before jumping to WHAT. This prevents building features that don\'t deliver value.',
                    principles: [
                        'Outcome = The result you want to achieve',
                        'Output = The thing you build',
                        'Always ask: "What outcome are we trying to achieve?"'
                    ]
                },
                useCases: [
                    {
                        title: 'Team wants to build a feature',
                        wrong: '❌ "Let\'s build a dashboard"',
                        right: '✅ "What outcome do we want? → Faster decision-making → Then: dashboard"'
                    },
                    {
                        title: 'Product planning',
                        wrong: '❌ Start listing features',
                        right: '✅ Define business outcome first, then features that support it'
                    }
                ],
                challenge: {
                    question: 'Your team wants to add a new button. What should you ask first?',
                    options: [
                        'What color should it be?',
                        'What outcome are we trying to achieve?',
                        'Where should we put it?'
                    ],
                    correctIndex: 1,
                    explanation: 'Always start with the outcome! Understanding WHY we need the button helps us design the right solution.'
                },
                validation: {
                    prompt: 'In your own words, why is outcome more important than output?',
                    keywords: ['outcome', 'value', 'result', 'why', 'purpose'],
                    minLength: 20
                },
                mastery: { framework: 'Marginal Thinking', points: 10 }
            },
            
            'problem_definition': {
                title: '🔍 Problem Definition',
                icon: '🔍',
                concept: {
                    title: 'Good problems are: Usable, Feasible, Valuable',
                    description: 'The three lenses help evaluate if a problem is worth solving. All three must be true for a good problem.',
                    principles: [
                        'Usable - Can users actually use it?',
                        'Feasible - Can IBM realistically build it?',
                        'Valuable - Does it provide real value?'
                    ]
                },
                useCases: [
                    {
                        title: 'Evaluating an idea',
                        wrong: '❌ "Sounds cool, let\'s build it!"',
                        right: '✅ Check all three dimensions: Usable? Feasible? Valuable?'
                    },
                    {
                        title: 'Prioritizing work',
                        wrong: '❌ Build everything that\'s requested',
                        right: '✅ Ideas that score high on all three = priority'
                    }
                ],
                challenge: {
                    question: 'Idea: "Build an AI that reads minds". Should we build this?',
                    options: [
                        'Yes - it would be amazing!',
                        'No - it\'s not feasible (we can\'t build it)',
                        'Maybe - let\'s prototype it'
                    ],
                    correctIndex: 1,
                    explanation: 'Even if it\'s usable and valuable, if we can\'t build it (not feasible), it\'s not a good problem to solve.'
                },
                validation: {
                    prompt: 'Name the three dimensions of a good problem:',
                    keywords: ['usable', 'feasible', 'valuable'],
                    requireAll: true,
                    minLength: 15
                },
                mastery: { framework: 'Problem Definition', points: 10 }
            },
            
            'edt_framework': {
                title: '🔄 Enterprise Design Thinking (EDT)',
                icon: '🔄',
                concept: {
                    title: 'Human-Centered Loop: Observe → Reflect → Make',
                    description: 'EDT is IBM\'s approach to human-centered problem solving. It\'s a continuous loop that keeps you focused on user outcomes.',
                    principles: [
                        'Observe - Understand the current state and user needs',
                        'Reflect - Analyze and synthesize insights',
                        'Make - Create and test solutions',
                        'Then loop back to Observe!'
                    ]
                },
                useCases: [
                    {
                        title: 'When requirements are unclear',
                        wrong: '❌ Make assumptions and start building',
                        right: '✅ Observe: Talk to users → Reflect: What\'s the real problem? → Make: Prototype and test'
                    },
                    {
                        title: 'When building new features',
                        wrong: '❌ Jump straight to design',
                        right: '✅ Observe first, reflect on learnings, then make something testable'
                    }
                ],
                challenge: {
                    question: 'User says "I need a faster way to do X". What\'s your first step?',
                    options: [
                        'Start designing the UI',
                        'Observe how they currently do X',
                        'Build a prototype'
                    ],
                    correctIndex: 1,
                    explanation: 'Always Observe first! Understanding the current state helps you identify the real problem before jumping to solutions.'
                },
                validation: {
                    prompt: 'What are the 3 steps of the EDT loop?',
                    keywords: ['observe', 'reflect', 'make'],
                    requireAll: true,
                    minLength: 15
                },
                mastery: { framework: 'EDT Framework', points: 15 }
            },
            
            'pdlc_framework': {
                title: '📊 Product Development Lifecycle (PDLC)',
                icon: '📊',
                concept: {
                    title: 'Discovery → Delivery → Launch & Scale',
                    description: 'PDLC helps IBM build winning products with product-market fit. Each phase asks a critical question.',
                    principles: [
                        'Discovery - Are we building the RIGHT thing?',
                        'Delivery - Are we building it RIGHT?',
                        'Launch & Scale - Are customers getting VALUE?'
                    ]
                },
                useCases: [
                    {
                        title: 'Starting a new project',
                        wrong: '❌ Jump straight to coding',
                        right: '✅ Begin in Discovery: Validate the opportunity first, then design and build'
                    },
                    {
                        title: 'Project is failing',
                        wrong: '❌ Work harder and faster',
                        right: '✅ Ask: Which phase are you in? Did you skip Discovery? Go back and validate.'
                    }
                ],
                challenge: {
                    question: 'Your team starts coding immediately. What phase did they skip?',
                    options: [
                        'Delivery',
                        'Discovery',
                        'Launch'
                    ],
                    correctIndex: 1,
                    explanation: 'Discovery comes first! Skipping it means you might build the wrong thing perfectly.'
                },
                validation: {
                    prompt: 'What are the 3 main phases of PDLC?',
                    keywords: ['discovery', 'delivery', 'launch', 'scale'],
                    minLength: 20
                },
                mastery: { framework: 'PDLC Framework', points: 15 }
            },
            
            'psychological_safety': {
                title: '🛡️ Psychological Safety',
                icon: '🛡️',
                concept: {
                    title: 'Biggest indicator of team performance',
                    description: 'Psychological safety means team members can admit mistakes, say "I don\'t know", and ask for help without fear.',
                    principles: [
                        'No trust = No healthy conflict',
                        'High trust = Task conflict without relationship conflict',
                        'Safety must be created constantly'
                    ]
                },
                useCases: [
                    {
                        title: 'Building high-performing teams',
                        wrong: '❌ Focus only on skills and processes',
                        right: '✅ Create safety first → Healthy conflict becomes possible → Performance follows'
                    },
                    {
                        title: 'When team isn\'t speaking up',
                        wrong: '❌ Demand more participation',
                        right: '✅ Build trust, model vulnerability, create safety'
                    }
                ],
                challenge: {
                    question: 'Team member makes a mistake. Best response?',
                    options: [
                        'Criticize them publicly to prevent future mistakes',
                        'Thank them for catching it, learn together',
                        'Ignore it and move on'
                    ],
                    correctIndex: 1,
                    explanation: 'Psychological safety means mistakes are learning opportunities, not reasons for punishment.'
                },
                validation: {
                    prompt: 'Why is psychological safety important for teams?',
                    keywords: ['trust', 'safe', 'performance', 'conflict', 'mistake'],
                    minLength: 20
                },
                mastery: { framework: 'Psychological Safety', points: 10 }
            },
            
            'playbacks_execs': {
                title: '🎤 Playbacks to Executives',
                icon: '🎤',
                concept: {
                    title: 'Get to the point quickly, explain WHY',
                    description: 'Executives have limited time. Your job is to communicate clearly, quickly, and with purpose.',
                    principles: [
                        'Prepare - Know your audience, do homework',
                        'Get to the point - Lead with outcome',
                        'Explain WHY - Why this matters, why now',
                        'Know your ask - Decision? Feedback? Resources?'
                    ]
                },
                useCases: [
                    {
                        title: '5-minute exec meeting',
                        wrong: '❌ Start with detailed process explanation',
                        right: '✅ Lead with outcome → Explain why it matters → State your ask → Leave time for questions'
                    },
                    {
                        title: 'Playback presentation',
                        wrong: '❌ Show all the work you did',
                        right: '✅ Set context → Show key decisions → Explain WHY → Get alignment'
                    }
                ],
                challenge: {
                    question: 'You have 5 minutes with an exec. What do you lead with?',
                    options: [
                        'Detailed process explanation',
                        'The outcome and why it matters',
                        'Your design portfolio'
                    ],
                    correctIndex: 1,
                    explanation: 'Executives need to understand the outcome and impact first. Details come later if they ask.'
                },
                validation: {
                    prompt: 'What should you always explain in playbacks?',
                    keywords: ['why', 'reason', 'purpose', 'matter'],
                    minLength: 15
                },
                mastery: { framework: 'Playbacks to Execs', points: 10 }
            },
            
            'storytelling': {
                title: '📖 Storytelling',
                icon: '📖',
                concept: {
                    title: 'Connecting with others to share the same emotion',
                    description: 'With AI, human connection matters more. Stories create shared understanding and change perspectives.',
                    principles: [
                        'Set the stage - Give context first',
                        'Make them feel - Share the user\'s emotion',
                        'Show impact - How does this change things?',
                        'Context changes everything'
                    ]
                },
                useCases: [
                    {
                        title: 'Presenting designs',
                        wrong: '❌ Jump straight to mockups',
                        right: '✅ Tell the user\'s story first → Show how design solves their problem'
                    },
                    {
                        title: 'Getting buy-in',
                        wrong: '❌ Present data alone',
                        right: '✅ Story + data = powerful. Make them feel what users feel.'
                    }
                ],
                challenge: {
                    question: 'Before showing your design, what should you do?',
                    options: [
                        'Jump straight to the mockups',
                        'Set the stage and give context',
                        'Show competitor designs'
                    ],
                    correctIndex: 1,
                    explanation: 'Context is everything! Setting the stage helps people understand WHY your design matters.'
                },
                validation: {
                    prompt: 'Why is storytelling important with AI?',
                    keywords: ['human', 'connect', 'emotion', 'understand', 'context'],
                    minLength: 20
                },
                mastery: { framework: 'Communication', points: 10 }
            },
            
            'sandbox_testing': {
                title: '🧪 Sandbox Testing',
                icon: '🧪',
                concept: {
                    title: 'Market → Sandbox → Business Opportunity',
                    description: 'Test ideas in a sandbox before full commitment. Small experiments reduce risk and validate quickly.',
                    principles: [
                        'Don\'t build full product immediately',
                        'Create sandbox/MVP to test',
                        'Learn quickly, fail fast and cheap',
                        'Scale what works'
                    ]
                },
                useCases: [
                    {
                        title: 'New product idea',
                        wrong: '❌ Build the full product immediately',
                        right: '✅ Create sandbox/MVP → Test and validate → Then commit resources'
                    },
                    {
                        title: 'Reducing risk',
                        wrong: '❌ Bet everything on one big launch',
                        right: '✅ Small experiments first → Learn quickly → Scale what works'
                    }
                ],
                challenge: {
                    question: 'New idea comes up. What\'s the first step?',
                    options: [
                        'Build the full product',
                        'Test in a sandbox/MVP',
                        'Present to executives'
                    ],
                    correctIndex: 1,
                    explanation: 'Sandbox testing lets you validate ideas quickly and cheaply before making big commitments.'
                },
                validation: {
                    prompt: 'What\'s the benefit of sandbox testing?',
                    keywords: ['test', 'validate', 'risk', 'learn', 'quick', 'cheap'],
                    minLength: 20
                },
                mastery: { framework: 'Execution', points: 10 }
            },
            
            'universal_experiences': {
                title: '🌐 Universal Experiences',
                icon: '🌐',
                concept: {
                    title: '9-stage customer journey',
                    description: 'IBM\'s shared language for the complete customer lifecycle. Understanding all 9 stages helps you design better experiences.',
                    principles: [
                        'Acquisition: Discover → Learn → Try → Buy',
                        'Retention: Onboard → Use → Get Help',
                        'Expansion: Expand → End Use'
                    ]
                },
                useCases: [
                    {
                        title: 'Designing new features',
                        wrong: '❌ Focus only on the "Use" stage',
                        right: '✅ Ask: Which stage does this serve? Are we covering the full journey? Where are the gaps?'
                    },
                    {
                        title: 'Improving product',
                        wrong: '❌ Fix random issues',
                        right: '✅ Map current experience to 9 stages → Find friction points → Prioritize improvements'
                    }
                ],
                challenge: {
                    question: 'User can\'t figure out how to use your product. Which stage needs work?',
                    options: [
                        'Discover',
                        'Onboard',
                        'Expand'
                    ],
                    correctIndex: 1,
                    explanation: 'Onboard is where users set up and learn to use the product. If they\'re confused, onboarding needs improvement.'
                },
                validation: {
                    prompt: 'Name 3 of the 9 Universal Experience stages:',
                    keywords: ['discover', 'learn', 'try', 'buy', 'onboard', 'use', 'help', 'expand', 'end'],
                    minLength: 15
                },
                mastery: { framework: 'Universal Experiences', points: 10 }
            }
        };
    }
    
    showFramework(frameworkId, onComplete) {
        try {
            console.log('[InteractiveLearningSystem] showFramework called with:', frameworkId);
            
            // Create modal on first use
            if (!this.modalCreated) {
                console.log('[InteractiveLearningSystem] Creating modal for first time');
                this.createModal();
            }
            
            // Validate framework exists
            this.currentFramework = this.frameworks[frameworkId];
            if (!this.currentFramework) {
                console.error('[InteractiveLearningSystem] Framework not found:', frameworkId);
                console.error('[InteractiveLearningSystem] Available frameworks:', Object.keys(this.frameworks));
                
                // Resume game even if framework not found
                if (onComplete) {
                    console.log('[InteractiveLearningSystem] Calling onComplete callback due to error');
                    onComplete(null);
                }
                return;
            }
            
            console.log('[InteractiveLearningSystem] Framework found:', this.currentFramework.title);
            
            this.currentStep = 0;
            this.isActive = true;
            this.onComplete = onComplete;
            
            // Validate DOM elements exist
            if (!this.overlay || !this.modal) {
                console.error('[InteractiveLearningSystem] Modal elements not created properly');
                if (onComplete) {
                    onComplete(null);
                }
                return;
            }
            
            // Show overlay
            this.overlay.classList.remove('hidden');
            console.log('[InteractiveLearningSystem] Modal overlay shown');
            
            // Update title
            const titleElement = document.getElementById('framework-title');
            if (titleElement) {
                titleElement.textContent = this.currentFramework.title;
            }
            
            // Show first step
            this.renderStep();
            console.log('[InteractiveLearningSystem] First step rendered');
            
        } catch (error) {
            console.error('[InteractiveLearningSystem] Error in showFramework:', error);
            console.error('[InteractiveLearningSystem] Stack trace:', error.stack);
            
            // Always resume game on error
            if (onComplete) {
                console.log('[InteractiveLearningSystem] Calling onComplete callback due to exception');
                onComplete(null);
            }
        }
    }
    
    renderStep() {
        const body = document.getElementById('modal-body');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        // Update progress dots
        this.updateProgressDots();
        
        // Update buttons
        prevBtn.disabled = this.currentStep === 0;
        prevBtn.style.display = this.currentStep === 0 ? 'none' : 'inline-block';
        
        switch(this.currentStep) {
            case 0: // Concept
                body.innerHTML = this.renderConcept();
                nextBtn.textContent = 'See Use Cases';
                nextBtn.disabled = false;
                break;
                
            case 1: // Use Cases
                body.innerHTML = this.renderUseCases();
                nextBtn.textContent = 'Take Challenge';
                nextBtn.disabled = false;
                break;
                
            case 2: // Challenge
                body.innerHTML = this.renderChallenge();
                nextBtn.textContent = 'Continue';
                nextBtn.disabled = true; // Enabled when correct answer selected
                this.setupChallengeListeners();
                break;
                
            case 3: // Validation
                body.innerHTML = this.renderValidation();
                nextBtn.textContent = 'Complete';
                nextBtn.disabled = true; // Enabled when validation passes
                this.setupValidationListeners();
                break;
        }
    }
    
    renderConcept() {
        const { concept } = this.currentFramework;
        return `
            <div class="concept-section">
                <div class="concept-icon">${this.currentFramework.icon}</div>
                <h3>${concept.title}</h3>
                <p class="concept-description">${concept.description}</p>
                <div class="principles">
                    <h4>Key Principles:</h4>
                    <ul>
                        ${concept.principles.map(p => `<li>${p}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    renderUseCases() {
        const { useCases } = this.currentFramework;
        return `
            <div class="use-cases-section">
                <h3>Real-World Use Cases</h3>
                ${useCases.map((uc, i) => `
                    <div class="use-case">
                        <h4>${i + 1}. ${uc.title}</h4>
                        <div class="comparison">
                            <div class="wrong">${uc.wrong}</div>
                            <div class="right">${uc.right}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderChallenge() {
        const { challenge } = this.currentFramework;
        return `
            <div class="challenge-section">
                <h3>🎯 Interactive Challenge</h3>
                <p class="challenge-question">${challenge.question}</p>
                <div class="challenge-options">
                    ${challenge.options.map((opt, i) => `
                        <button class="challenge-option" data-index="${i}">
                            ${String.fromCharCode(65 + i)}. ${opt}
                        </button>
                    `).join('')}
                </div>
                <div id="challenge-feedback" class="challenge-feedback hidden"></div>
            </div>
        `;
    }
    
    renderValidation() {
        const { validation } = this.currentFramework;
        return `
            <div class="validation-section">
                <h3>✍️ Demonstrate Your Understanding</h3>
                <p class="validation-prompt">${validation.prompt}</p>
                <textarea 
                    id="validation-input" 
                    class="validation-input" 
                    placeholder="Type your answer here..."
                    rows="4"
                ></textarea>
                <div id="validation-feedback" class="validation-feedback hidden"></div>
                <div class="validation-hint">
                    💡 Tip: Your answer should be at least ${validation.minLength} characters
                </div>
            </div>
        `;
    }
    
    setupChallengeListeners() {
        const options = document.querySelectorAll('.challenge-option');
        const feedback = document.getElementById('challenge-feedback');
        const nextBtn = document.getElementById('next-btn');
        const { challenge } = this.currentFramework;
        
        options.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                // Remove previous selections
                options.forEach(o => o.classList.remove('selected', 'correct', 'incorrect'));
                
                // Mark this option
                btn.classList.add('selected');
                
                if (index === challenge.correctIndex) {
                    btn.classList.add('correct');
                    feedback.className = 'challenge-feedback success';
                    feedback.innerHTML = `✅ Correct! ${challenge.explanation}`;
                    feedback.classList.remove('hidden');
                    nextBtn.disabled = false;
                } else {
                    btn.classList.add('incorrect');
                    feedback.className = 'challenge-feedback error';
                    feedback.innerHTML = `❌ Not quite. Think about the framework principles and try again.`;
                    feedback.classList.remove('hidden');
                    nextBtn.disabled = true;
                }
            });
        });
    }
    
    setupValidationListeners() {
        const input = document.getElementById('validation-input');
        const feedback = document.getElementById('validation-feedback');
        const nextBtn = document.getElementById('next-btn');
        const { validation } = this.currentFramework;
        
        input.addEventListener('input', () => {
            const text = input.value.trim().toLowerCase();
            
            // Check length
            if (text.length < validation.minLength) {
                feedback.className = 'validation-feedback hidden';
                nextBtn.disabled = true;
                return;
            }
            
            // Check keywords
            let foundKeywords = [];
            validation.keywords.forEach(keyword => {
                if (text.includes(keyword.toLowerCase())) {
                    foundKeywords.push(keyword);
                }
            });
            
            // Validation logic
            const isValid = validation.requireAll 
                ? foundKeywords.length === validation.keywords.length
                : foundKeywords.length > 0;
            
            if (isValid) {
                feedback.className = 'validation-feedback success';
                feedback.innerHTML = `✅ Great! You've demonstrated understanding of the key concepts.`;
                feedback.classList.remove('hidden');
                nextBtn.disabled = false;
            } else {
                feedback.className = 'validation-feedback warning';
                const missing = validation.keywords.filter(k => !foundKeywords.includes(k));
                feedback.innerHTML = `💡 Try to include: ${missing.join(', ')}`;
                feedback.classList.remove('hidden');
                nextBtn.disabled = true;
            }
        });
    }
    
    updateProgressDots() {
        const dotsContainer = document.getElementById('progress-dots');
        const totalSteps = 4;
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i < totalSteps; i++) {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            if (i < this.currentStep) {
                dot.classList.add('completed');
            } else if (i === this.currentStep) {
                dot.classList.add('active');
            }
            dotsContainer.appendChild(dot);
        }
    }
    
    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.renderStep();
        }
    }
    
    nextStep() {
        if (this.currentStep < 3) {
            this.currentStep++;
            this.renderStep();
        } else {
            // Complete the learning
            this.complete();
        }
    }
    
    complete() {
        this.isActive = false;
        this.overlay.classList.add('hidden');
        
        // Call completion callback with mastery info
        if (this.onComplete) {
            this.onComplete(this.currentFramework.mastery);
        }
    }
    
    closeModal() {
        // User closed modal without completing
        this.isActive = false;
        this.overlay.classList.add('hidden');
        
        // Call completion callback with null (no mastery gained)
        if (this.onComplete) {
            this.onComplete(null);
        }
    }
}

// Made with Bob
