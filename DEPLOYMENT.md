# 🚀 Qwik Search - Deployment Guide

## 📦 Building the Application

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Install Dependencies
```bash
npm install
```

---

## 🏗️ Build for Distribution

### Build for Windows (Current Platform)
```bash
npm run package:win
```
This creates:
- `release/Qwik Search Setup x.x.x.exe` - Installer
- `release/Qwik Search x.x.x.exe` - Portable version

### Build for macOS (Requires macOS)
```bash
npm run package:mac
```
Creates `.dmg` and `.zip` files

### Build for Linux
```bash
npm run package:linux
```
Creates `.AppImage` and `.deb` files

### Build for All Platforms
```bash
npm run package:all
```

---

## 📂 Output Files

After building, find your installers in the `release/` folder:

**Windows:**
- `Qwik Search Setup x.x.x.exe` - Full installer with uninstaller
- `Qwik Search x.x.x.exe` - Portable version (no installation needed)

**macOS:**
- `Qwik Search-x.x.x.dmg` - Disk image installer
- `Qwik Search-x.x.x-mac.zip` - Zipped app

**Linux:**
- `Qwik Search-x.x.x.AppImage` - Universal Linux executable
- `qwik-search_x.x.x_amd64.deb` - Debian/Ubuntu package

---

## 🌐 Distribution Options

### 1. **GitHub Releases** (Recommended for Free)
1. Go to your GitHub repository
2. Click "Releases" → "Create a new release"
3. Tag version (e.g., `v1.0.0`)
4. Upload files from `release/` folder
5. Write release notes
6. Publish release

Users can download directly from GitHub.

### 2. **Microsoft Store** (Windows)
- Requires Windows Developer account ($19 one-time)
- Use `appx` target in electron-builder
- Submit through Partner Center

### 3. **Mac App Store** (macOS)
- Requires Apple Developer account ($99/year)
- Requires macOS to build and sign
- Submit through App Store Connect

### 4. **Snapcraft** (Linux)
- Free distribution
- Cross-distro compatibility
- Automatic updates

### 5. **Self-Hosting**
- Upload to your own website
- Share direct download links
- Use CDN for faster downloads

### 6. **Chocolatey** (Windows Package Manager)
- Free community repository
- Easy installation via `choco install qwik-search`

---

## 📝 Pre-Build Checklist

### 1. Add Application Icons
Create a `build/` folder and add:
- `icon.ico` (Windows) - 256x256 pixels
- `icon.icns` (macOS) - Multiple sizes
- `icon.png` (Linux) - 512x512 pixels

You can use online tools:
- https://icoconvert.com/
- https://cloudconvert.com/

### 2. Update package.json
```json
{
  "name": "qwik-search",
  "version": "1.0.0",
  "description": "Fast AI-powered search tool",
  "author": "Your Name <your@email.com>",
  "license": "MIT"
}
```

### 3. Add LICENSE file
```bash
# Example: MIT License
touch LICENSE
```

### 4. Test the Build
```bash
# Build the app
npm run package:win

# Test the installer
# Install from release/ folder
# Test Alt+Q shortcut
# Test search functionality
# Test clear button
# Check for errors
```

---

## 🔧 Troubleshooting

### "electron-builder not found"
```bash
npm install --save-dev electron-builder
```

### Build fails on Windows
```bash
# Install Windows Build Tools
npm install --global windows-build-tools
```

### Icons not showing
- Ensure icons are in `build/` folder
- Check icon file formats (ico, icns, png)
- Rebuild: `npm run package:win`

### App won't start after installation
- Check dist-electron/main.js exists
- Verify preload.js is compiled
- Check console for errors in production mode

---

## 📱 Auto-Updates (Optional)

To add auto-update functionality:

1. Install electron-updater:
```bash
npm install electron-updater
```

2. Configure in main.ts:
```typescript
import { autoUpdater } from 'electron-updater';

app.whenReady().then(() => {
  autoUpdater.checkForUpdatesAndNotify();
});
```

3. Host releases on GitHub Releases or custom server

---

## 🎯 Quick Start for Users

### Windows
1. Download `Qwik Search Setup.exe`
2. Run installer
3. Press `Alt+Q` to open
4. Type your question and press Enter

### macOS
1. Download `.dmg` file
2. Drag to Applications
3. Press `Alt+Q` to open

### Linux
1. Download `.AppImage`
2. Make executable: `chmod +x Qwik*.AppImage`
3. Run: `./Qwik*.AppImage`
4. Press `Alt+Q` to open

---

## 📊 Version Management

### Bumping Version
```bash
# Update version in package.json
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

### Tagging Releases
```bash
git add .
git commit -m "Release v1.0.0"
git tag v1.0.0
git push origin main --tags
```

---

## 🔐 Code Signing (Optional but Recommended)

### Windows
- Get code signing certificate (~$100-300/year)
- Sign with SignTool or electron-builder

### macOS
- Requires Apple Developer account ($99/year)
- Sign with Xcode tools
- Notarize with Apple

### Linux
- No signing required
- Checksums automatically generated

---

## 📈 Analytics (Optional)

Track usage with:
- Google Analytics for Desktop
- Mixpanel
- Custom analytics server

---

## 🎉 Post-Deployment

1. **Create Release Notes**
   - List new features
   - Bug fixes
   - Breaking changes

2. **Promote Your App**
   - Share on social media
   - Product Hunt launch
   - Reddit communities
   - Dev.to article

3. **Gather Feedback**
   - GitHub Issues
   - Email support
   - User surveys

4. **Monitor Performance**
   - Error tracking (Sentry)
   - Usage metrics
   - User feedback

---

## 📞 Support

For deployment issues:
1. Check electron-builder docs: https://www.electron.build/
2. GitHub Issues: [Your Repo]/issues
3. Electron Discord: https://discord.gg/electron

---

## 🔄 CI/CD (Advanced)

Automate builds with GitHub Actions:

```yaml
# .github/workflows/build.yml
name: Build

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [windows-latest, macos-latest, ubuntu-latest]
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run package
      - uses: actions/upload-artifact@v3
        with:
          name: release-${{ matrix.os }}
          path: release/*
```

---

## ✅ Final Checklist

- [ ] Icons added to `build/` folder
- [ ] Version number updated in package.json
- [ ] LICENSE file added
- [ ] README.md updated
- [ ] Code tested on target platform
- [ ] Build successful: `npm run package:win`
- [ ] Installer tested
- [ ] Git repository up to date
- [ ] GitHub release created
- [ ] Release notes written
- [ ] Download links shared

---

**Ready to deploy!** 🚀

Start with: `npm run package:win`
