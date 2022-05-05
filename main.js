// 模組
const {app, BrowserWindow} = require('electron')

// 視窗全域變數
let win

function createWindow () {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  })

  win.loadFile('index.html');

  win.once('ready-to-show', function () {
    win.show();
  })

  // 開發者工具
  //win.webContents.openDevTools()

  win.on('closed', function () {
    win = null;
  })
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
})

app.on('activate', function () {
  if (win === null) createWindow();
})