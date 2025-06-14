import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, BellIcon, MenuIcon, UserCircleIcon, CogIcon, LogoutIcon } from '@heroicons/react/outline';
import { Menu } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { XIcon } from '@heroicons/react/outline';

const Navbar = ({ onMenuClick }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const notifications = [
    {
      id: 1,
      title: 'New User Registration',
      message: 'John Doe has registered',
      time: '5 minutes ago',
      unread: true,
      link: '/users/profile'
    },
    {
      id: 2,
      title: 'System Update',
      message: 'System maintenance scheduled',
      time: '1 hour ago',
      unread: false,
      link: '/settings'
    },
    {
      id: 3,
      title: 'New Message',
      message: 'You have a new message',
      time: '2 hours ago',
      unread: true,
      link: '/messages'
    },
  ];

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query) => {
    setSearchValue(query);
    
    if (query.trim()) {
      // Mock search results - in a real app, this would be from your API
      const results = [
        {
          type: 'user',
          title: 'John Doe',
          subtitle: 'Admin',
          path: '/users',
          searchText: 'john doe admin',
        },
        {
          type: 'user',
          title: 'Jane Smith',
          subtitle: 'User',
          path: '/users',
          searchText: 'jane smith user',
        },
        {
          type: 'setting',
          title: 'Profile Settings',
          subtitle: 'Manage your profile',
          path: '/profile',
          searchText: 'profile settings manage account',
        },
        {
          type: 'setting',
          title: 'Security Settings',
          subtitle: 'Password and security',
          path: '/settings',
          searchText: 'security settings password authentication',
        },
      ];

      const filtered = results.filter(item => 
        item.searchText.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (result) => {
    navigate(result.path);
    setSearchValue('');
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleResultClick(searchResults[0]);
    }
  };

  const handleNotificationClick = (notification) => {
    navigate(`/notifications?id=${notification.id}`);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const navbarVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const searchVariants = {
    focused: {
      width: "100%",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
    unfocused: {
      width: "100%",
      boxShadow: "none",
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const notificationVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.nav 
      className="fixed top-0 right-0 left-0 lg:left-[250px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg z-20 transition-all duration-300 hover:bg-white dark:hover:bg-gray-800"
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
    >
      <div className="h-16 px-4 flex items-center justify-between">
        {/* Left section with menu button */}
        <div className="flex items-center">
          <motion.button
            className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none hover:scale-110 transform transition-all duration-200 active:scale-95"
            whileHover="hover"
            whileTap="tap"
            variants={iconVariants}
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <MenuIcon className="h-6 w-6" />
          </motion.button>
        </div>

        {/* Search bar - centered with proper spacing */}
        <div className="flex-1 max-w-2xl mx-4">
          <motion.div
            className="relative group"
            initial="unfocused"
            animate={isSearchFocused ? "focused" : "unfocused"}
            variants={searchVariants}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <motion.div
                animate={isSearchFocused ? { rotate: -10, scale: 1.1 } : { rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-primary-500 transition-colors duration-200" />
              </motion.div>
            </div>
            <input
              type="text"
              placeholder="Search users, settings, or documents..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-400 dark:hover:border-primary-500 sm:text-sm transition-all duration-200 ease-in-out text-gray-900 dark:text-white"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsSearchFocused(false);
                  setSearchResults([]);
                }, 200);
              }}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              aria-label="Search"
            />

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && isSearchFocused && (
              <motion.div
                className="absolute mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ul className="divide-y divide-gray-200">
                  {searchResults.map((result, index) => (
                    <motion.li
                      key={index}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleResultClick(result)}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                    >
                      <div className="flex items-center">
                        {result.type === 'user' ? (
                          <UserCircleIcon className="h-5 w-5 text-gray-400 mr-3" />
                        ) : (
                          <CogIcon className="h-5 w-5 text-gray-400 mr-3" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {result.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {result.subtitle}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 transform origin-top-right transition-all duration-200 ease-out">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      No new notifications
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {notifications.map((notification) => (
                        <div
                          key={notification._id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150 ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {notification.title}
                              </p>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {notification.message}
                              </p>
                              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="ml-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  New
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => navigate('/notifications')}
                      className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User menu */}
          <Menu as="div" className="relative">
            <Menu.Button as={motion.button}
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div className="relative">
                <motion.img
                  className="h-8 w-8 rounded-full ring-2 ring-primary-500"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User avatar"
                  whileHover={{ scale: 1.1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary-500 opacity-0"
                  whileHover={{ opacity: 0.2 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
              <motion.div 
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                John Doe
              </motion.div>
            </Menu.Button>

            <AnimatePresence>
              <Menu.Items
                as={motion.div}
                className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 focus:outline-none"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
              >
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <motion.button
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                        } flex items-center w-full px-4 py-2 text-sm`}
                        onClick={() => navigate('/profile')}
                        whileHover={{ x: 5 }}
                      >
                        <UserCircleIcon className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                        Profile
                      </motion.button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <motion.button
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                        } flex items-center w-full px-4 py-2 text-sm`}
                        onClick={() => navigate('/settings')}
                        whileHover={{ x: 5 }}
                      >
                        <CogIcon className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                        Settings
                      </motion.button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <motion.button
                        className={`${
                          active ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                        } flex items-center w-full px-4 py-2 text-sm`}
                        onClick={handleLogout}
                        whileHover={{ x: 5 }}
                      >
                        <LogoutIcon className="h-5 w-5 mr-3 text-gray-400 dark:text-gray-500" />
                        Logout
                      </motion.button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </AnimatePresence>
          </Menu>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 