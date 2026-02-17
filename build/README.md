# Qwik Search - Icon Placeholder

Please add your application icons to this folder:

## Required Icons:

### Windows
- **icon.ico** - 256x256 pixels
  - Used for Windows .exe installer
  - Can be created from PNG using: https://icoconvert.com/

### macOS
- **icon.icns** - Multiple sizes (16x16 to 512x512)
  - Used for macOS .dmg installer
  - Can be created from PNG using: https://cloudconvert.com/png-to-icns

### Linux
- **icon.png** - 512x512 pixels
  - Used for Linux .AppImage and .deb
  - Standard PNG format

## Free Icon Tools:
- https://icoconvert.com/ - Convert PNG to ICO
- https://cloudconvert.com/ - Convert to ICNS
- https://www.canva.com/ - Design icons
- https://www.figma.com/ - Design icons

## Temporary Solution:
Until you add custom icons, electron-builder will use default Electron icons.

## Quick Start:
1. Create or download a 512x512 PNG logo
2. Convert to required formats using online tools
3. Save files in this folder
4. Rebuild: `npm run package:win`
