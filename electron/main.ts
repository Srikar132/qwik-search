// electron/main.ts
import { app, BrowserWindow, globalShortcut, screen, protocol, net } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let mainWindow: BrowserWindow | null = null;

// Register custom protocol BEFORE app is ready.
// This gives the packaged app a real origin (app://localhost) instead of file://
// Puter's SDK blocks file:// as a null/opaque origin → 403. app:// is accepted.
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true,
    },
  },
]);

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
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hidden'
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    // Load via custom protocol so origin = app://localhost (not file://)
    mainWindow.loadURL('app://localhost/index.html');
  }

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
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    const windowBounds = mainWindow.getBounds();
    const x = Math.floor((width - windowBounds.width) / 2);
    const y = Math.floor(height / 4);

    mainWindow.setPosition(x, y);
    mainWindow.show();
    mainWindow.focus();
  }
}

app.whenReady().then(() => {
  // Serve built files via app:// protocol
  protocol.handle('app', (request) => {
    const url = new URL(request.url);
    let filePath = url.pathname;

    if (filePath.startsWith('/')) filePath = filePath.slice(1);
    if (!filePath) filePath = 'index.html';

    const distPath = path.join(__dirname, '../dist', filePath);

    // Serve file if it exists, otherwise fall back to index.html (SPA routing)
    const resolvedPath = fs.existsSync(distPath)
      ? distPath
      : path.join(__dirname, '../dist/index.html');

    return net.fetch(`file://${resolvedPath}`);
  });

  createWindow();

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