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
    if (notification.unread) {
      setUnreadCount(prev => Math.max(0, prev - 1));
      // Here you would typically make an API call to mark the notification as read
    }
    setShowNotifications(false);
    navigate(notification.link);
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
          <div className="relative" ref={notificationRef}>
            <motion.button
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 relative"
              whileHover="hover"
              whileTap="tap"
              variants={iconVariants}
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label={`Notifications (${unreadCount} unread)`}
            >
              <BellIcon className="h-6 w-6" />
              {unreadCount > 0 && (
                <motion.span
                  className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 focus:outline-none"
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                >
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
                    <div className="mt-4 space-y-3">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          className={`p-3 rounded-lg transition-colors duration-200 cursor-pointer
                            ${notification.unread
                              ? 'bg-primary-50 dark:bg-primary-900/20'
                              : 'bg-gray-50 dark:bg-gray-700/50'
                            } hover:bg-gray-100 dark:hover:bg-gray-700`}
                          onClick={() => handleNotificationClick(notification)}
                          whileHover={{ x: 5 }}
                          variants={notificationVariants}
                        >
                          <div className="flex items-start">
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                notification.unread
                                  ? 'text-primary-900 dark:text-primary-100'
                                  : 'text-gray-900 dark:text-gray-100'
                              }`}>
                                {notification.title}
                              </p>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {notification.message}
                              </p>
                              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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