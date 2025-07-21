const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let overlayWindow;

function createOverlayWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  overlayWindow = new BrowserWindow({
    width: 400,
    height: 600,
    x: width - 420, // Position on right side
    y: 20,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  overlayWindow.loadFile('renderer/index.html');
  
  // Enable click-through for certain areas
  overlayWindow.setIgnoreMouseEvents(false);
  
  // Development tools
  if (process.env.NODE_ENV === 'development') {
    overlayWindow.webContents.openDevTools();
  }

  overlayWindow.on('closed', () => {
    overlayWindow = null;
  });
}

// IPC handlers for window control
ipcMain.handle('minimize-window', () => {
  if (overlayWindow) overlayWindow.minimize();
});

ipcMain.handle('close-window', () => {
  if (overlayWindow) overlayWindow.close();
});

ipcMain.handle('toggle-click-through', (event, enabled) => {
  if (overlayWindow) {
    overlayWindow.setIgnoreMouseEvents(enabled, { forward: true });
  }
});

app.whenReady().then(createOverlayWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createOverlayWindow();
  }
});