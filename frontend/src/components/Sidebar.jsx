import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  UserCircleIcon, 
  CogIcon,
  XIcon 
} from '@heroicons/react/outline';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Users', href: '/users', icon: UsersIcon },
    { name: 'Profile', href: '/profile', icon: UserCircleIcon },
    { name: 'Settings', href: '/settings', icon: CogIcon },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavClick = () => {
    // Close sidebar on mobile when a navigation item is clicked
    if (window.innerWidth < 1024) { // 1024px is the 'lg' breakpoint in Tailwind
      onClose();
    }
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600/75 backdrop-blur-sm transition-opacity duration-300 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl transform transition-all duration-300 ease-in-out z-30 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 border-r border-gray-200/50 dark:border-gray-700/50`}
      >
        {/* Logo and Close Button */}
        <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-primary-600 to-primary-700">
          <Link to="/users" className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors" onClick={handleNavClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
              />
            </svg>
            <span>User Management</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-0 mt-[-14px]  h-6 flex items-center justify-center z-50"
            aria-label="Close sidebar"
          >
            <svg
              viewBox="0 0 24 24"
              width="10"
              height="10"
            >
              <path
                d="M3 3L21 21M21 3L3 21"
                stroke="#000000"
                strokeWidth="5"
                strokeLinecap="butt"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          <div className="space-y-1">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={handleNavClick}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]
                    ${active
                      ? 'bg-primary-50/80 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm ring-1 ring-primary-100 dark:ring-primary-900/50'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200 hover:shadow-sm'
                    }`}
                >
                  <item.icon
                    className={`h-5 w-5 mr-3 transition-colors duration-200 ${
                      active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar; 