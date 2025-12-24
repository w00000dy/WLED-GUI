const { contextBridge, ipcRenderer, shell } = require('electron');

process.once('loaded', () => {
    // No need to require electron-log here anymore
});

contextBridge.exposeInMainWorld('api', {
    log: {
        info: (...args) => ipcRenderer.send('log', 'info', ...args),
        warn: (...args) => ipcRenderer.send('log', 'warn', ...args),
        error: (...args) => ipcRenderer.send('log', 'error', ...args),
        debug: (...args) => ipcRenderer.send('log', 'debug', ...args),
        verbose: (...args) => ipcRenderer.send('log', 'verbose', ...args),
        silly: (...args) => ipcRenderer.send('log', 'silly', ...args),
    },
    platform: process.platform,
    shell: {
        openExternal: (url) => ipcRenderer.send('open-external', url)
    },
    window: {
        close: () => ipcRenderer.send('window-close')
    },
    network: {
        getInterfaces: () => ipcRenderer.invoke('get-interfaces'),
        ping: (ip) => ipcRenderer.invoke('ping', ip)
    },
    bonjour: {
        find: (callback) => {
            ipcRenderer.on('bonjour-found', (event, service) => callback(service));
            ipcRenderer.send('bonjour-find');
        },
        destroy: () => ipcRenderer.send('bonjour-destroy')
    },
    autolaunch: {
        enable: (options) => ipcRenderer.invoke('autolaunch-enable', options),
        disable: (options) => ipcRenderer.invoke('autolaunch-disable', options),
        isEnabled: (options) => ipcRenderer.invoke('autolaunch-isenabled', options)
    },
    store: {
        get: (key, defaultValue) => ipcRenderer.invoke('store-get', key, defaultValue),
        set: (key, value) => ipcRenderer.invoke('store-set', key, value),
        delete: (key) => ipcRenderer.invoke('store-delete', key)
    }
});
