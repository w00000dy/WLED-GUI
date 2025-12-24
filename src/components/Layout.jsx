import React from 'react';
import { NavLink } from 'react-router';

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 flex flex-col border-r border-gray-700">
                <div className="h-20 flex items-center justify-center border-b border-gray-700">
                    <img src="./images/wled_logo.png" alt="WLED Logo" className="h-12" />
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Settings
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-700">
                     <p className="text-xs text-gray-500 text-center">WLED-GUI v0.8.0</p>
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
