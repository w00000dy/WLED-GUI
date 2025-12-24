import React, { useState, useEffect } from 'react';

const Settings = () => {
    const [settings, setSettings] = useState({
        autostartHidden: false,
        tray: true,
        autoTurnOnOnlyAtAutostart: false
    });
    const [autostartEnabled, setAutostartEnabled] = useState(false);

    useEffect(() => {
        loadSettings();
        checkOSAutostart();
    }, []);

    const loadSettings = async () => {
        const s = await window.api.store.get('settings', {
             autostartHidden: false,
             tray: true,
             autoTurnOnOnlyAtAutostart: false
        });
        setSettings(s);
    };

    const checkOSAutostart = async () => {
        const enabled = await window.api.autolaunch.isEnabled({ name: 'WLED' });
        setAutostartEnabled(enabled);
    };

    const saveSetting = async (key, value) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        await window.api.store.set('settings', newSettings);
        
        // Side effects for specific settings
        if (key === 'autostartHidden') {
             // If hidden autostart is enabled, we map that to the OS autostart args
             // Logic typically handled in main.js or here by updating OS autostart args.
             // But existing logic did:
             // if hidden checked -> appPath = " --hidden"
             // enable({ appPath })
             toggleOSAutostart(autostartEnabled, value);
        }
    };

    const toggleOSAutostart = async (checked, hidden = settings.autostartHidden) => {
        setAutostartEnabled(checked);
        if (checked) {
            const isWin = await window.api.platform === 'win32'; // platform is exposed as prop, not string directly maybe? Check preload.
            // Actually preload: platform: process.platform
            const platform = window.api.platform; // property
            
            let appPath = undefined;
            if (hidden) {
                appPath = (platform === 'win32') ? '" --hidden"' : ' --hidden';
            }
            
            await window.api.autolaunch.enable({ name: 'WLED', appPath });
        } else {
            await window.api.autolaunch.disable({ name: 'WLED' });
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>
            
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700 space-y-6">
                
                {/* OS Autostart */}
                <div className="flex items-center justify-between py-2">
                    <div>
                        <h3 className="text-lg font-medium text-white">Start with System</h3>
                        <p className="text-gray-400 text-sm">Automatically launch WLED-GUI when your computer starts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={autostartEnabled}
                            onChange={(e) => toggleOSAutostart(e.target.checked)}
                        />
                         <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                </div>

                <hr className="border-gray-700" />

                {/* Hidden Autostart */}
                <div className="flex items-center justify-between py-2">
                    <div>
                        <h3 className="text-lg font-medium text-white">Start Hidden</h3>
                        <p className="text-gray-400 text-sm">Launch in the tray area without showing the window</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={settings.autostartHidden}
                            onChange={(e) => saveSetting('autostartHidden', e.target.checked)}
                            disabled={!autostartEnabled}
                        />
                         <div className={`w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600 ${!autostartEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                    </label>
                </div>

                <hr className="border-gray-700" />

                {/* Tray Icon */}
                <div className="flex items-center justify-between py-2">
                    <div>
                        <h3 className="text-lg font-medium text-white">Show Tray Icon</h3>
                        <p className="text-gray-400 text-sm">Keep icon in system tray</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={settings.tray}
                            onChange={(e) => saveSetting('tray', e.target.checked)}
                             // Force tray if hidden is checked
                            disabled={settings.autostartHidden}
                        />
                         <div className={`w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600 ${settings.autostartHidden ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                    </label>
                </div>

                 <hr className="border-gray-700" />

                {/* Turn on only at autostart */}
                <div className="flex items-center justify-between py-2">
                    <div>
                        <h3 className="text-lg font-medium text-white">Turn on lights only at Autostart</h3>
                        <p className="text-gray-400 text-sm">If disabled, lights configured to autostart will turn on every time you open the app manually too.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={settings.autoTurnOnOnlyAtAutostart}
                            onChange={(e) => saveSetting('autoTurnOnOnlyAtAutostart', e.target.checked)}
                        />
                         <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                </div>

            </div>
            
            <div className="mt-8 text-center">
                 <button 
                    onClick={() => window.api.shell.openExternal('https://github.com/w00000dy/WLED-GUI/wiki/Settings')}
                    className="text-gray-400 hover:text-white underline text-sm"
                 >
                     Open Settings Documentation
                 </button>
            </div>
        </div>
    );
};

export default Settings;
