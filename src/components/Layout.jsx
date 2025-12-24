import React from 'react';
import { NavLink } from 'react-router';
import { Lightbulb, Plus, Settings } from 'lucide-react';

import pkg from '../../package.json';

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 flex flex-col border-r border-gray-700">
                <div className="h-20 flex items-center justify-center border-b border-gray-700">
                    <img src="./images/wled_akemi_original.png" alt="WLED Logo" className="h-12" />
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-2 px-2">
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-orange-600 text-white'
                                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                    }`
                                }
                            >
                                <Lightbulb size={24} className="mr-3" />
                                Lights
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/add"
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-orange-600 text-white'
                                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                    }`
                                }
                            >
                                <Plus size={24} className="mr-3" />
                                Add Light
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/settings"
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-orange-600 text-white'
                                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                    }`
                                }
                            >
                                <Settings size={24} className="mr-3" />
                                Settings
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-700">
                     <p className="text-xs text-gray-500 text-center">WLED-GUI v{pkg.version}</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-gray-900 p-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
