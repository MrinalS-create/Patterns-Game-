# 🎮 The Patterns Journey: Designer's Quest

An interactive learning game for IBM Patterns Design Academy - Learn design thinking frameworks through gameplay!

![Game Preview](https://img.shields.io/badge/Status-Day%201%20Complete-success)
![Platform](https://img.shields.io/badge/Platform-Web%20Browser-blue)
![License](https://img.shields.io/badge/License-Educational-orange)

## 🌟 About

**The Patterns Journey** is a 2D platformer game that teaches IBM Design Thinking frameworks through interactive gameplay. Players explore a vibrant world, collect framework tools, and demonstrate understanding through hands-on challenges.

### Day 1 Content: Foundation Frameworks

Master 7 essential frameworks from IBM Patterns Design Academy:

1. **🎯 Marginal Thinking** - Focus on outcomes before outputs
2. **🔍 Problem Definition** - Ensure solutions are Usable, Feasible, and Valuable
3. **🔄 EDT Framework** - Observe, Reflect, Make cycle
4. **📊 PDLC Framework** - Discovery, Delivery, Launch & Scale phases
5. **🛡️ Psychological Safety** - Build trust to enable high performance
6. **🎤 Playbacks to Execs** - Communicate effectively with leadership
7. **🌐 Universal Experiences** - Design for the 9-stage customer journey

## 🎯 Learning Approach

Each framework follows a structured learning path:
1. **Concept Introduction** - Learn the core framework
2. **Real-World Use Cases** - See practical applications
3. **Interactive Challenge** - Apply your knowledge
4. **Validation** - Demonstrate understanding through text input

## 🕹️ How to Play

### Controls
- **Arrow Keys** or **WASD** - Move left/right
- **Space Bar** - Jump
- **ESC** - Pause game

### Gameplay
1. Navigate through the level using platformer controls
2. Collect hexagonal framework tools (🔷)
3. Read framework explanations and use cases
4. Complete interactive challenges to prove understanding
5. Track your progress in the Framework Mastery card (top-right)

## 🚀 Quick Start

### Play Online
Visit the live game: `https://YOUR-USERNAME.github.io/patterns-journey-game/`

### Play Locally
1. Download or clone this repository
2. Open `index.html` in any modern web browser
3. Start playing immediately - no installation required!

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/patterns-journey-game.git

# Open in browser
cd patterns-journey-game
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

## 📁 Project Structure

```
patterns-game/
├── index.html                 # Main game page
├── css/
│   ├── game.css              # Core game styling
│   └── interactive-learning.css  # Learning system UI
├── js/
│   ├── engine/               # Game engine core
│   │   ├── Game.js          # Main game loop
│   │   ├── Entity.js        # Base entity class
│   │   ├── Physics.js       # Physics simulation
│   │   ├── Renderer.js      # Canvas rendering
│   │   ├── InputManager.js  # Input handling
│   │   └── AssetManager.js  # Asset loading
│   ├── entities/            # Game entities
│   │   ├── Player.js        # Player character
│   │   ├── Enemy.js         # Enemy entities
│   │   └── Collectible.js   # Collectible items
│   ├── systems/             # Game systems
│   │   ├── CollisionSystem.js
│   │   ├── ProgressSystem.js
│   │   ├── ToolSystem.js
│   │   ├── InteractiveLearningSystem.js
│   │   ├── TutorialSystem.js
│   │   └── NotificationSystem.js
│   └── main.js              # Entry point
└── README.md                # This file
```

## 🎓 Educational Value

This game teaches:
- **IBM Design Thinking** principles and frameworks
- **Product Development Lifecycle (PDLC)** methodology
- **Enterprise Design Thinking (EDT)** practices
- **Team collaboration** and psychological safety
- **Executive communication** strategies
- **Universal design** principles

## 🛠️ Technical Details

- **Pure JavaScript** (ES6+) - No frameworks required
- **HTML5 Canvas** - Hardware-accelerated rendering
- **Responsive Design** - Scales to any screen size
- **60 FPS** target performance
- **LocalStorage** - Progress persistence
- **Modular Architecture** - Clean, maintainable code

## 📊 Features

✅ Interactive learning system with text validation  
✅ Framework mastery tracking  
✅ Progress persistence (LocalStorage)  
✅ Responsive canvas scaling  
✅ Smooth physics and collision detection  
✅ Professional UI with IBM Design Language  
✅ Comprehensive error handling  
✅ Debug mode for development  

## 🎨 Design Philosophy

Built following IBM Design principles:
- **User-Centered**: Learn by doing, not just reading
- **Iterative**: Immediate feedback on understanding
- **Collaborative**: Share knowledge with peers
- **Accessible**: Works on any modern browser

## 🐛 Known Issues

None currently! The game has been thoroughly tested and debugged.

## 🔮 Future Enhancements

- [ ] Day 2 content (Accessibility, Instrumentation, Problem Solving)
- [ ] Day 3 content (Hills Writing)
- [ ] Multiplayer collaboration mode
- [ ] Achievement system
- [ ] Leaderboards
- [ ] Mobile touch controls optimization
- [ ] Sound effects and background music
- [ ] Custom character skins

## 📝 Version History

### v1.0.0 - Day 1 Complete (Current)
- ✅ Complete Day 1 framework content
- ✅ Interactive learning system
- ✅ Framework mastery tracking
- ✅ All 7 frameworks implemented
- ✅ Comprehensive testing and debugging

## 🤝 Contributing

This is an educational project for IBM Patterns Design Academy. Feedback and suggestions are welcome!

## 📄 License

Educational use only. Created for IBM Patterns Design Academy cohort learning.

## 🙏 Acknowledgments

- IBM Patterns Design Academy instructors
- IBM Design Language team
- Cohort 11 Dublin participants

## 📧 Contact

Questions or feedback? Reach out to your cohort facilitator or instructor.

---

**Made with ❤️ for IBM Patterns Design Academy**

*Learn. Play. Master Design Thinking.*