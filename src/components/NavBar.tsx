import React from 'react';

interface NavBarProps {
  activeView?: string;
  onNavigate?: (view: string) => void;
  onNewApplicationClick?: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ activeView, onNavigate, onNewApplicationClick }) => {
  const navItems = [
    { id: 'offers', label: 'Offers', bgColor: 'bg-green-600', icon: '⚙️' },
    { id: 'interview', label: 'Interview', bgColor: 'bg-purple-600', icon: '📈' },
    { id: 'applied', label: 'Applied', bgColor: 'bg-blue-600', icon: '📊' },
    { id: 'rejected', label: 'Rejected', bgColor: 'bg-red-600', icon: '📝' },
    { id: 'graveyard', label: 'Graveyard', bgColor: 'bg-gray-600', icon: '⚙️' },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white shadow-lg">
      <div className="flex flex-col h-full">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold">Job Tracker</h1>
        </div>

        {/* Navigation Items */}
        <ul className="flex-1 p-4 space-y-2 ">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate?.(item.id)}
                className={`${item.bgColor} w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-white ${
                  activeView === item.id ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Create New Application Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => onNewApplicationClick?.()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <span className="text-xl">+</span>
            <span>New Application</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <p className="text-sm text-gray-400">© 2026 Job Tracker</p>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

