import { app, BrowserWindow, Menu, Tray } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'url';
import log from 'electron-log';
import Store from 'electron-store';

import { setupIpcHandlers } from './ipcHandlers.js';

// Setup file URL derivation for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

log.initialize();

/* LOG LEVEL */
log.transports.console.level = 'debug';
log.transports.file.level = 'debug';

log.info('WLED-GUI started');
log.debug('Start arguments:', process.argv);

const store = new Store();

setupIpcHandlers(store);

const gotTheLock = app.requestSingleInstanceLock();
const autostarted = process.argv.indexOf('--hidden') !== -1;
const dev = process.argv.indexOf('--dev') !== -1;

const getIconDir = () => {
  const installPath = path.dirname(app.getPath('exe'));
  log.debug('installPath: ' + installPath);
  let dir;
  if (dev) {
    dir = path.join(__dirname, 'build');
  } else if (process.platform === 'darwin') {
    dir = path.join(installPath, '../', 'build');
  } else {
    dir = path.join(installPath, 'build');
  }
  return dir;
};

const iconDir = getIconDir();
log.debug('iconDir: ' + iconDir);

let win;
let tray;

function createWindow() {
  log.debug('Create browser window');
  win = new BrowserWindow({
    width: 1300,
    height: 900,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (dev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  if (!dev) {
    win.removeMenu();
  }

  // check if app was autostarted
  if (autostarted) {
    log.verbose('App is started by AutoLaunch');
  } else {
    log.verbose('App is started by User');
    win.once('ready-to-show', () => {
      win.show();
    });
  }
}

// Turn on lights
function checkAutostartLights() {
  const settings = store.get('settings', { autoTurnOnOnlyAtAutostart: false });
  // If autostarted OR (NOT only-at-autostart), turn on lights
  if (autostarted || !settings.autoTurnOnOnlyAtAutostart) {
    turnOnLights();
  }
}

function turnOnLights() {
  log.debug('Checking lights to turn on...');
  const lights = store.get('lights', []);
  lights.forEach((light) => {
    if (light.autostart) {
      log.verbose('Turn on ' + light.ip);
      fetch(`http://${light.ip}/win&T=1`)
        .then(() => log.debug(`Turned on ${light.ip}`))
        .catch((err) => log.error(`Failed to turn on ${light.ip}`, err));
    }
  });
}

// tray
function createTray() {
  log.debug('Create tray icon');
  let iconFile;
  // tray icon for macOS
  if (process.platform === 'darwin') {
    iconFile = 'trayIcon.png';
  } else {
    iconFile = 'icon.png';
  }
  const iconPath = path.join(iconDir, iconFile);
  log.debug('Tray icon path: ' + iconPath);
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click: function () {
        win.show();
      },
    },
    {
      label: 'Hide',
      click: function () {
        win.hide();
      },
    },
    {
      label: 'Quit',
      click: function () {
        log.debug('Quit app via tray');
        app.quit();
      },
    },
  ]);
  tray.setToolTip('WLED');
  tray.setContextMenu(contextMenu);

  tray.on('click', function () {
    win.show();
  });
}

function checkTray() {
  const settings = store.get('settings', { tray: true });
  if (autostarted) {
    createTray();
  } else {
    if (settings.tray) {
      createTray();
    }
  }
}

// check if second instance was started
if (!gotTheLock) {
  log.info('WLED-GUI quitted');
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (win) {
      log.info('Someone tried to run a second instance. Focus our main window');
      win.show();
    }
  });

  app.whenReady().then(() => {
    createWindow();
    checkTray();
    checkAutostartLights();
  });

  app.on('window-all-closed', () => {
    log.debug('All windows are closed');
    if (process.platform === 'darwin') {
      const settings = store.get('settings', { tray: true });
      if (settings.tray) {
        if (tray) tray.destroy();
      }
      log.info('WLED-GUI closed');
    } else {
      log.info('WLED-GUI quitted');
      app.quit();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}
