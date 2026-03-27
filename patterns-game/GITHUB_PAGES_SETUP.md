# 🚀 GitHub Pages Setup Guide

Share your Patterns Journey game with peers using GitHub Pages - it's free and takes just 5 minutes!

## Prerequisites
- A GitHub account (create one at github.com if you don't have one)
- Git installed on your computer (check with `git --version`)

## Step-by-Step Instructions

### Option 1: Using GitHub Web Interface (Easiest - No Git Required!)

1. **Create a New Repository**
   - Go to https://github.com/new
   - Repository name: `patterns-journey-game` (or any name you like)
   - Description: "Interactive learning game for IBM Patterns Design Academy"
   - Make it **Public** (required for free GitHub Pages)
   - ✅ Check "Add a README file"
   - Click "Create repository"

2. **Upload Your Game Files**
   - In your new repository, click "Add file" → "Upload files"
   - Drag and drop the ENTIRE `patterns-game` folder from your computer
   - Or click "choose your files" and select all files/folders inside `patterns-game/`
   - Add commit message: "Initial game upload"
   - Click "Commit changes"

3. **Enable GitHub Pages**
   - Go to your repository Settings (gear icon)
   - Scroll down to "Pages" in the left sidebar
   - Under "Source", select "Deploy from a branch"
   - Branch: Select "main" (or "master")
   - Folder: Select "/ (root)"
   - Click "Save"

4. **Get Your Game URL**
   - Wait 1-2 minutes for deployment
   - Your game will be live at:
     ```
     https://YOUR-USERNAME.github.io/patterns-journey-game/
     ```
   - Share this URL with your peers!

### Option 2: Using Git Command Line (For Git Users)

```bash
# Navigate to the Patterns directory
cd /Users/ms/Downloads/Patterns

# Initialize git repository in patterns-game folder
cd patterns-game
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Patterns Journey Game"

# Create repository on GitHub first, then:
git remote add origin https://github.com/YOUR-USERNAME/patterns-journey-game.git

# Push to GitHub
git branch -M main
git push -u origin main

# Enable GitHub Pages in repository settings (see Option 1, step 3)
```

## 📁 What Gets Uploaded

Make sure your repository has this structure:
```
patterns-journey-game/
├── index.html          ← Main entry point
├── css/
│   ├── game.css
│   └── interactive-learning.css
└── js/
    ├── engine/
    ├── entities/
    ├── systems/
    └── main.js
```

## 🎮 Sharing with Peers

Once deployed, share:
```
🎮 Play the Patterns Journey Game!
https://YOUR-USERNAME.github.io/patterns-journey-game/

Learn IBM Design Thinking frameworks through interactive gameplay.
Use Arrow Keys or WASD to move, Space to jump.
```

## 🔧 Updating Your Game

### Via Web Interface:
1. Go to your repository
2. Navigate to the file you want to update
3. Click the pencil icon (Edit)
4. Make changes
5. Commit changes

### Via Git:
```bash
cd patterns-game
# Make your changes
git add .
git commit -m "Update game"
git push
```

Changes appear on your site within 1-2 minutes!

## 🐛 Troubleshooting

**Problem: 404 Page Not Found**
- Solution: Make sure `index.html` is in the root of your repository
- Check that GitHub Pages is enabled in Settings → Pages

**Problem: Game doesn't load**
- Solution: Open browser console (F12) to check for errors
- Verify all file paths are relative (no absolute paths)

**Problem: Styles/Scripts not loading**
- Solution: Check that CSS and JS folders are uploaded correctly
- Verify file paths in index.html match your folder structure

**Problem: Changes not appearing**
- Solution: Wait 1-2 minutes for GitHub Pages to rebuild
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache

## 📊 Bonus: Add a Custom Domain (Optional)

If you own a domain:
1. Go to Settings → Pages
2. Add your custom domain
3. Configure DNS settings with your domain provider
4. Enable "Enforce HTTPS"

## 🎯 Quick Checklist

- [ ] GitHub account created
- [ ] Repository created and set to Public
- [ ] All game files uploaded
- [ ] GitHub Pages enabled in Settings
- [ ] Game URL tested and working
- [ ] URL shared with peers

## 💡 Pro Tips

1. **Add a README**: Create a README.md in your repository to explain the game
2. **Use Releases**: Tag versions (v1.0, v1.1) to track updates
3. **Enable Issues**: Let peers report bugs via GitHub Issues
4. **Add Screenshots**: Include game screenshots in your README
5. **Analytics**: Add Google Analytics to track visitors (optional)

## 🆘 Need Help?

- GitHub Pages Documentation: https://pages.github.com/
- GitHub Support: https://support.github.com/
- Git Tutorial: https://try.github.io/

---

**Your game is ready to share! 🎉**

Once deployed, anyone with the URL can play your game instantly in their browser - no installation required!