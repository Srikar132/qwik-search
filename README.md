# 🔍 Qwik Search

> A beautiful, fast AI-powered search tool built with Electron, React, and Puter AI

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)

## ✨ Features

- 🎯 **Quick Access** - Press `Alt+Q` anywhere to open
- 💬 **AI-Powered** - Get instant answers using Puter AI
- 🎨 **Beautiful UI** - Premium design with markdown support
- ⚡ **Streaming Responses** - Real-time ChatGPT-style responses
- 🎭 **Code Highlighting** - Syntax highlighting for code blocks
- 📊 **Table Support** - Renders tables beautifully
- 🌙 **Dark Theme** - Easy on the eyes
- 🪟 **Always on Top** - Floats above other windows
- 🎯 **Draggable** - Move anywhere on screen
- 🧹 **Clear Button** - Easy response management

## 🚀 Quick Start

### For Users

1. **Download** the latest release from [Releases page](https://github.com/Srikar132/qwik-search/releases)
2. **Install** the application
3. **Press `Alt+Q`** to open anywhere
4. **Type your question** and press Enter
5. **Get AI-powered answers** instantly!

### For Developers

```bash
# Clone the repository
git clone https://github.com/Srikar132/qwik-search.git
cd qwik-search

# Install dependencies
npm install

# Run in development mode
npm run electron:dev

# Build for production
npm run package:win
```

## 📸 Screenshots

_[Add screenshots here]_

## 🛠️ Tech Stack

- **Electron** - Desktop application framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Puter AI** - AI chat service
- **React Markdown** - Markdown rendering
- **Highlight.js** - Code syntax highlighting
- **Remark GFM** - GitHub Flavored Markdown

## 📦 Building & Deployment

### Quick Build
```bash
npm run package:win    # Build for Windows
npm run package:mac    # Build for macOS
npm run package:linux  # Build for Linux
npm run package:all    # Build for all platforms
```

### Detailed Guides
- 📘 [Quick Start Deployment](QUICK-START-DEPLOYMENT.md) - Get started in 5 minutes
- 📗 [Complete Deployment Guide](DEPLOYMENT.md) - Detailed instructions for all platforms

## 🎯 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Alt+Q` | Toggle window |
| `Enter` | Send query |
| `Esc` | Hide window (when focused elsewhere) |

## 🏗️ Project Structure

```
qwik-search/
├── electron/          # Electron main process
│   ├── main.ts       # Main window configuration
│   └── preload.ts    # Preload script
├── src/              # React application
│   ├── App.tsx       # Main component
│   ├── App.css       # Styling
│   └── hooks/        # Custom React hooks
│       └── usePuterAI.ts  # AI integration
├── build/            # Application icons
├── dist/             # Built web files
├── dist-electron/    # Built Electron files
└── release/          # Distribution packages
```

## 🔧 Development

### Available Scripts

```bash
npm run dev              # Start Vite dev server
npm run build            # Build the application
npm run electron:dev     # Run in development mode
npm run package          # Package for current platform
npm run package:win      # Package for Windows
npm run package:mac      # Package for macOS
npm run package:linux    # Package for Linux
```

### Environment Variables

No environment variables needed! The app works out of the box.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Puter AI](https://puter.com) - For the amazing AI service
- [Electron](https://www.electronjs.org/) - For the desktop framework
- [React](https://react.dev/) - For the UI library
- Inspired by [Raycast](https://www.raycast.com/)

## 📧 Contact

- **Author:** Srikar
- **GitHub:** [@Srikar132](https://github.com/Srikar132)
- **Repository:** [qwik-search](https://github.com/Srikar132/qwik-search)

## 🐛 Bug Reports

Found a bug? Please open an issue on [GitHub Issues](https://github.com/Srikar132/qwik-search/issues).

## 🗺️ Roadmap

- [ ] Multi-model support (GPT-4, Claude, etc.)
- [ ] History/conversation tracking
- [ ] Custom themes
- [ ] Plugin system
- [ ] Multi-language support
- [ ] Auto-updates
- [ ] Offline mode with local models

## ⭐ Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Made with ❤️ by [Srikar](https://github.com/Srikar132)**
