const { app, BrowserWindow, desktopCapturer, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });
  win.loadURL('http://localhost:3000');
}

app.whenReady().then(createWindow);

ipcMain.handle('capture-screen', async () => {
  const sources = await desktopCapturer.getSources({ types: ['screen'] });
  // Return first screen as dataURL
  const screen = sources[0];
  return screen.thumbnail.toDataURL();
});