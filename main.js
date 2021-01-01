const { app, BrowserWindow, Menu, Tray } = require('electron')

const autostarted = process.argv.indexOf('--hidden') !== -1;

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1263,
    height: 900,
    icon: "build/icon.png",
    minimized: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  })

  // check if app was autostarted
  if (autostarted) {
    console.log('App is started by AutoLaunch');
    win.minimize();
  }
  else {
    console.log('App is started by User');
  }

  // and load the index.html of the app.
  win.loadFile('index.html')

  // remove menubar
  // win.removeMenu()

  // Open the DevTools.
  // win.webContents.openDevTools()

  // create hidden worker window
  const workerWindow = new BrowserWindow({
    show: false
  });
  // and load the autostart.html
  workerWindow.loadFile('autostart.html');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

let tray = null
app.whenReady().then(() => {
  tray = new Tray('build/icon.png')
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open' },
    { label: 'Close' }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.