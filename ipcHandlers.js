import { ipcMain, shell, BrowserWindow } from 'electron';
import os from 'os';
import { Bonjour } from 'bonjour-service';
import AutoLaunch from 'auto-launch';
import log from 'electron-log';

let bonjourInstance;

export function setupIpcHandlers(store) {
  // IPC listener for window closing
  ipcMain.on('window-close', (event) => {
    const w = BrowserWindow.fromWebContents(event.sender);
    if (w) w.close();
  });

  ipcMain.on('log', (event, level, ...args) => {
    if (log[level]) {
      log[level](...args);
    }
  });

  ipcMain.on('open-external', (event, url) => {
    shell.openExternal(url);
  });

  // Network Interfaces
  ipcMain.handle('get-interfaces', () => {
    return os.networkInterfaces();
  });

  // Bonjour
  ipcMain.on('bonjour-find', (event) => {
    if (!bonjourInstance) bonjourInstance = new Bonjour();
    bonjourInstance.find({ type: "http" }, function (service) {
      event.sender.send('bonjour-found', service);
    });
  });
  ipcMain.on('bonjour-destroy', () => {
    if (bonjourInstance) {
      bonjourInstance.destroy();
      bonjourInstance = null;
    }
  });

  // AutoLaunch
  ipcMain.handle('autolaunch-enable', async (event, options) => {
    const launcher = new AutoLaunch(options);
    if (options.appPath) launcher.opts.appPath = options.appPath; // Handle path override
    return launcher.enable();
  });
  ipcMain.handle('autolaunch-disable', async (event, options) => {
    const launcher = new AutoLaunch(options);
    return launcher.disable();
  });
  ipcMain.handle('autolaunch-isenabled', async (event, options) => {
    const launcher = new AutoLaunch(options);
    return launcher.isEnabled();
  });

  // Store IPC
  ipcMain.handle('store-get', (event, key, defaultValue) => {
    return store.get(key, defaultValue);
  });
  ipcMain.handle('store-set', (event, key, value) => {
    store.set(key, value);
  });
  ipcMain.handle('store-delete', (event, key) => {
    store.delete(key);
  });
}
