import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Switch } from '@headlessui/react';
import { BellIcon, GlobeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: isDarkMode,
    twoFactorAuth: false,
    publicProfile: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (!user?.token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/settings', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSettings(prev => ({
            ...data,
            darkMode: isDarkMode // Always use the current theme state
          }));
        } else {
          toast.error('Failed to load settings');
        }
      } catch (error) {
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [user, isDarkMode]);

  const handleToggle = (setting) => {
    if (setting === 'darkMode') {
      toggleDarkMode();
    }
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const settingsGroups = [
    {
      title: 'Profile Settings',
      icon: UserIcon,
      settings: [
        {
          name: 'publicProfile',
          label: 'Public Profile',
          description: 'Make your profile visible to everyone',
          current: settings.publicProfile,
        },
      ],
    },
    {
      title: 'Notifications',
      icon: BellIcon,
      settings: [
        {
          name: 'emailNotifications',
          label: 'Email Notifications',
          description: 'Receive email notifications about account activity',
          current: settings.emailNotifications,
        },
        {
          name: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Receive push notifications about account activity',
          current: settings.pushNotifications,
        },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: LockClosedIcon,
      settings: [
        {
          name: 'twoFactorAuth',
          label: 'Two-Factor Authentication',
          description: 'Add an extra layer of security to your account',
          current: settings.twoFactorAuth,
        },
      ],
    },
    {
      title: 'Appearance',
      icon: GlobeIcon,
      settings: [
        {
          name: 'darkMode',
          label: 'Dark Mode',
          description: 'Use dark theme across the application',
          current: settings.darkMode,
        },
      ],
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="show"
      variants={container}
      ref={ref}
    >
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Settings
            </motion.span>
          </h1>
          <motion.p 
            className="mt-2 text-sm text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Manage your account settings and preferences.
          </motion.p>
        </motion.div>
        <motion.button 
          className="btn btn-primary dark:bg-primary-600 dark:hover:bg-primary-700"
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
          }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onClick={async () => {
            if (!user?.token) {
              toast.error('Please log in to save settings');
              return;
            }

            setIsSaving(true);
            try {
              const response = await fetch('http://localhost:5000/settings', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify(settings),
              });

              if (response.ok) {
                const data = await response.json();
                setSettings(data.settings);
                toast.success('Settings saved successfully!');
              } else {
                const data = await response.json();
                toast.error(data.message || 'Failed to save settings');
              }
            } catch (error) {
              toast.error('Something went wrong. Please try again.');
            } finally {
              setIsSaving(false);
            }
          }}
          disabled={isSaving || isLoading}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <motion.div
            className="w-6 h-6 border-4 border-primary-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      ) : (
        <motion.div 
          className="space-y-8"
          variants={container}
        >
          <AnimatePresence>
            {settingsGroups.map((group, groupIndex) => (
              <motion.div 
                key={group.title} 
                className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                variants={fadeInScale}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                transition={{ delay: groupIndex * 0.1 }}
                whileHover={{ 
                  y: -4,
                  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  transition: { duration: 0.2 }
                }}
                layout
              >
                <motion.div 
                  className="px-4 py-5 sm:px-6 flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <group.icon className="h-6 w-6 text-primary-500" />
                  </motion.div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{group.title}</h3>
                </motion.div>
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {group.settings.map((setting, settingIndex) => (
                      <motion.div 
                        key={setting.name} 
                        className="px-4 py-5 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: (groupIndex * 0.1) + (settingIndex * 0.05),
                          type: "spring",
                          stiffness: 100
                        }}
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center justify-between">
                          <motion.div 
                            className="flex-1 min-w-0"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (groupIndex * 0.1) + (settingIndex * 0.05) + 0.1 }}
                          >
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">{setting.label}</h4>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{setting.description}</p>
                          </motion.div>
                          <Switch
                            checked={setting.current}
                            onChange={() => handleToggle(setting.name)}
                            className={`${
                              setting.current ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:ring-offset-gray-800`}
                          >
                            <span className="sr-only">Toggle {setting.label}</span>
                            <motion.span
                              className={`${
                                setting.current ? 'translate-x-5' : 'translate-x-0'
                              } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                              layout
                              transition={{
                                type: "spring",
                                stiffness: 700,
                                damping: 30
                              }}
                            />
                          </Switch>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Settings; 