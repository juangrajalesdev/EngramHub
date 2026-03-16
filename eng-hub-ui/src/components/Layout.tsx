import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Activity, Search, RefreshCw, Database } from 'lucide-react';

const Layout: React.FC = () => {
  const [activeProject, setActiveProject] = useState<string>('');

  const navItems = [
    { to: '/', icon: Activity, label: 'Timeline' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/sync', icon: RefreshCw, label: 'Sync Hub' },
  ];

  return (
    <div className="flex h-screen bg-mocha-base text-mocha-text font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 bg-[#181825] flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-gray-800">
          <Database className="w-6 h-6 text-mocha-lavender" />
          <h1 className="text-xl font-bold text-mocha-text tracking-wide">EngramHub</h1>
        </div>

        <div className="p-4">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Active Project
          </label>
          <input
            type="text"
            placeholder="Filter by project..."
            value={activeProject}
            onChange={(e) => setActiveProject(e.target.value)}
            className="w-full bg-[#1e1e2e] border border-gray-700 rounded px-3 py-2 text-sm text-mocha-text focus:outline-none focus:border-mocha-lavender transition-colors"
          />
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                  isActive
                    ? 'bg-mocha-lavender/10 text-mocha-lavender'
                    : 'text-gray-400 hover:bg-[#1e1e2e] hover:text-mocha-text'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 text-xs text-gray-500 border-t border-gray-800 text-center">
          Connected to local Engram engine
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Pass activeProject context to child routes if needed, using React Context or Outlet context */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet context={{ activeProject }} />
        </div>
      </main>
    </div>
  );
};

export default Layout;
