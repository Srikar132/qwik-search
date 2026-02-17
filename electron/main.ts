// electron/main.ts
import { app, BrowserWindow, globalShortcut, screen, shell } from 'electron';
import * as path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 500,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true, // Keep security enabled
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, 'preload.js')
    },
    // Enable window dragging without title bar
    titleBarStyle: 'hidden'
  });

  // Load the app
  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    // Enable DevTools in production for debugging
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // Enable external resource loading for Puter SDK
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.puter.com; " +
          "connect-src 'self' https://*.puter.com https://puter.com wss://*.puter.com; " +
          "style-src 'self' 'unsafe-inline'; " +
          "img-src 'self' data: https:;"
        ]
      }
    });
  });

  // Open external links in default browser (for Puter auth)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Handle navigation to external URLs
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url.startsWith('http') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  // Hide window when it loses focus
  mainWindow.on('blur', () => {
    if (mainWindow && !mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide();
    }
  });
}

function toggleWindow() {
  if (!mainWindow) return;

  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    // Center the window on the primary display
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    
    const windowBounds = mainWindow.getBounds();
    const x = Math.floor((width - windowBounds.width) / 2);
    const y = Math.floor(height / 4); // Position in upper third of screen
    
    mainWindow.setPosition(x, y);
    mainWindow.show();
    mainWindow.focus();
  }
}

app.whenReady().then(() => {
  createWindow();

  // Register global shortcut
  // Try to unregister first in case it's already registered
  globalShortcut.unregister('Alt+Q');

  const ret = globalShortcut.register('Alt+Q', () => {
    toggleWindow();
  });

  if (!ret) {
    console.log('Shortcut registration failed - Alt+Q may be in use by another application');
  } else {
    console.log('Shortcut Alt+Q registered successfully');
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});