import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

const AddDevice = () => {
  const navigate = useNavigate();
  const [ip, setIp] = useState('');
  const [discovering, setDiscovering] = useState(false);
  const [discoveredLights, setDiscoveredLights] = useState([]);

  useEffect(() => {
    // Start discovery on mount
    startDiscovery();

    return () => {
      window.api.bonjour.destroy();
    };
  }, []);

  const startDiscovery = () => {
    setDiscovering(true);
    window.api.bonjour.find((service) => {
      console.log('Found service:', service);
      // Service object usually has addresses array
      if (service.addresses && service.addresses.length > 0) {
        const ip = service.addresses[0]; // Take first
        setDiscoveredLights((prev) => {
          if (prev.find((l) => l.ip === ip)) return prev;
          return [...prev, { ip, name: service.name }];
        });
      }
    });
  };

  const handleAdd = async (deviceIp, deviceName = 'WLED Light') => {
    if (!deviceIp) return;

    try {
      const currentLights = await window.api.store.get('lights', []);
      // Check if exists
      if (currentLights.find((l) => l.ip === deviceIp)) {
        alert('Light already exists!');
        return;
      }

      // Try to fetch info to get name if not provided
      let name = deviceName;
      try {
        const res = await fetch(`http://${deviceIp}/json/info`);
        const data = await res.json();
        if (data.name) name = data.name;
      } catch (e) {
        console.warn('Could not fetch info from light', e);
      }

      const newLight = {
        ip: deviceIp,
        name: name,
        autostart: false,
      };

      await window.api.store.set('lights', [...currentLights, newLight]);
      navigate('/');
    } catch (error) {
      console.error('Error adding light', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Add New Light</h1>

      {/* Manual Add */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-8">
        <h2 className="text-xl text-white mb-4">Manually Add by IP</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="e.g. 192.168.1.50"
            className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500 transition-colors"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
          />
          <button
            onClick={() => handleAdd(ip)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
            disabled={!ip}
          >
            Add
          </button>
        </div>
      </div>

      {/* Discovery */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-white">Discovered Lights</h2>
          {discovering && <span className="text-orange-400 text-sm animate-pulse">Scanning network...</span>}
        </div>

        {discoveredLights.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No lights found automatically yet.</div>
        ) : (
          <ul className="space-y-3">
            {discoveredLights.map((light, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-gray-700/50 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
              >
                <div>
                  <div className="text-white font-medium">{light.name}</div>
                  <div className="text-gray-400 text-sm">{light.ip}</div>
                </div>
                <button
                  onClick={() => handleAdd(light.ip, light.name)}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-1 px-4 rounded transition-colors"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddDevice;
