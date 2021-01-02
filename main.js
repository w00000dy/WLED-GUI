const { app, BrowserWindow, Menu, Tray } = require('electron')
const path = require('path')

const autostarted = process.argv.indexOf('--hidden') !== -1;
const dev = process.argv.indexOf('--dev') !== -1;

var win;
var tray;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1263,
    height: 900,
    icon: "build/icon.png",
    show: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  })

  // and load the index.html of the app.
  win.loadFile('index.html')

  // remove menubar
  // win.removeMenu()

  // Open the DevTools.
  // win.webContents.openDevTools()

  // check if app was autostarted
  if (autostarted) {
    console.log('App is started by AutoLaunch');
  }
  else {
    console.log('App is started by User');
    win.once('ready-to-show', () => {
      win.show()
    })
  }
}

function createWorker() {
  // create hidden worker window
  const workerWindow = new BrowserWindow({
    show: false
  });
  // and load the autostart.html
  workerWindow.loadFile('autostart.html');
}

// tray
function createTray() {
  let iconPath;
  if (dev) {
    // icon path while developing
    iconPath = "build/icon.png";
  } else {
    // this is the path after building the app
    const installPath = path.dirname(app.getPath("exe"));
    console.log("installPath: " + installPath);
    iconPath = path.join(installPath, "build", "icon.png");
  }
  console.log("Tray icon path: " + iconPath);
  tray = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open', click: function () {
        win.show();
      }
    },
    {
      label: 'Hide', click: function () {
        win.hide();
      }
    },
    {
      label: 'Close', click: function () {
        app.quit();
      }
    },
  ])
  tray.setToolTip('WLED')
  tray.setContextMenu(contextMenu)

  tray.on('click', function () {
    win.show();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)
app.whenReady().then(createWorker)
app.whenReady().then(createTray)

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