import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { LightbulbOff, Plus, Trash2, ExternalLink } from 'lucide-react';

const Dashboard = () => {
    const [lights, setLights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLights();
        const interval = setInterval(() => {
            syncLights();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const syncLights = async () => {
        const storedLights = await window.api.store.get('lights', []);
        
        const updatedLights = await Promise.all(storedLights.map(async (light) => {
            try {
                const res = await window.api.network.ping(light.ip);
                return { ...light, online: res.alive };
            } catch (e) {
                return { ...light, online: false };
            }
        }));
        
        setLights(updatedLights);
    };

    const loadLights = async () => {
        try {
            const storedLights = await window.api.store.get('lights', []);
            // Initialize with undefined online status (pending)
            setLights(storedLights.map(l => ({ ...l, online: undefined })));
        } catch (error) {
            console.error("Failed to load lights", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleLight = async (ip, index) => {
        // Toggle logic (calling WLED API)
        // Existing app logic: ip + "/win&T=2" (Toggle)
        try {
            await fetch(`http://${ip}/win&T=2`);
            // Optimistic UI update or re-fetch?
        } catch (e) {
            console.error(e);
        }
    };

    const toggleAutostart = async (index, currentValue) => {
        const newLights = [...lights];
        newLights[index].autostart = !currentValue;
        setLights(newLights);
        await window.api.store.set('lights', newLights);
    };

    const deleteLight = async (index) => {
        const newLights = lights.filter((_, i) => i !== index);
        setLights(newLights);
        await window.api.store.set('lights', newLights);
    }

    if (loading) {
        return <div className="text-white text-center mt-10">Loading lights...</div>;
    }

    if (lights.length === 0) {
         return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <LightbulbOff size={80} className="mb-4 opacity-20" />
                <p className="text-xl mb-4">No lights found</p>
                <Link to="/add" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-full transition-colors flex items-center">
                    <Plus size={20} className="mr-2" />
                    Add a Light
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">My Lights</h1>
                <Link to="/add" className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition-colors" title="Add Light">
                    <Plus size={24} />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lights.map((light, index) => {
                    let statusColor = 'bg-gray-500';
                    if (light.online === true) statusColor = 'bg-green-500';
                    else if (light.online === false) statusColor = 'bg-red-500';

                    return (
                    <div key={index} className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-orange-500/50 transition-all group relative">
                        {/* Delete Button (visible on hover) */}
                        <button 
                            onClick={(e) => { e.stopPropagation(); deleteLight(index); }}
                            className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove Light"
                        >
                            <Trash2 size={20} />
                        </button>

                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-white truncate pr-6">{light.name}</h2>
                            <div className={`w-3 h-3 rounded-full ${statusColor}`} title={light.online === undefined ? 'Checking...' : (light.online ? 'Online' : 'Offline')}></div>
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-4 font-mono">{light.ip}</p>

                        <div className="flex items-center justify-between mt-4 border-t border-gray-700 pt-4">
                            <div className="flex items-center">
                                <label className="flex items-center cursor-pointer relative">
                                    <input type="checkbox" className="sr-only peer" checked={light.autostart || false} onChange={() => toggleAutostart(index, light.autostart)} />
                                    <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600"></div>
                                    <span className="ml-2 text-xs text-gray-400 font-medium">Autostart</span>
                                </label>
                            </div>
                            
                            <button 
                                onClick={() => window.api.shell.openExternal(`http://${light.ip}`)}
                                className="text-orange-500 hover:text-orange-400 text-sm font-semibold flex items-center"
                            >
                                Open UI
                                <ExternalLink size={16} className="ml-1" />
                            </button>
                        </div>
                    </div>
                )})}
            </div>
        </div>
    );
};

export default Dashboard;
