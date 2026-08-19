const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron');
const path = require('path');
let win = null, ignore = false;
function createWindow() {
  win = new BrowserWindow({
    width: 520, height: 720, frame: false, transparent: true, hasShadow: false,
    alwaysOnTop: true, backgroundColor: '#00000000',
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true }
  });
  win.setAlwaysOnTop(true, 'screen-saver');
  win.loadFile('index.html');
}
app.whenReady().then(() => {
  createWindow();
  globalShortcut.register('Control+Shift+X', () => { if (win) win.isVisible() ? win.hide() : win.show(); });
  globalShortcut.register('Control+Shift+S', () => { if (win) { ignore = !ignore; win.setIgnoreMouseEvents(ignore, { forward: true }); win.webContents.send('ignore-changed', ignore); } });
});
ipcMain.handle('set-opacity', (e, v) => win && win.setOpacity(Number(v)));
ipcMain.handle('set-ignore', (e, v) => { if (win) { ignore = !!v; win.setIgnoreMouseEvents(ignore, { forward: true }); } });
ipcMain.handle('set-top', (e, v) => win && win.setAlwaysOnTop(!!v, 'screen-saver'));
ipcMain.handle('hide', () => win && win.hide());
ipcMain.handle('quit', () => app.quit());
app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('window-all-closed', () => app.quit());