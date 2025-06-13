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
        const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
        const response = await fetch(`${baseUrl}/api/settings`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          mode: 'cors'
        });

        if (response.ok) {
          const data = await response.json();
          setSettings(prev => ({
            ...prev,
            ...data.settings,
            darkMode: isDarkMode // Always use the current theme state
          }));
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || 'Failed to load settings');
        }
      } catch (error) {
        console.error('Error loading settings:', error);
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
              const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
              const response = await fetch(`${baseUrl}/api/settings`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${user.token}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify({ settings })
              });

              if (response.ok) {
                toast.success('Settings saved successfully');
              } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Failed to save settings');
              }
            } catch (error) {
              console.error('Error saving settings:', error);
              toast.error('Failed to save settings');
            } finally {
              setIsSaving(false);
            }
          }}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {settingsGroups.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              className="card"
              variants={fadeInScale}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              transition={{ delay: groupIndex * 0.1 }}
            >
              <div className="flex items-center mb-4">
                <group.icon className="h-6 w-6 text-gray-400" />
                <h2 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                  {group.title}
                </h2>
              </div>
              <div className="space-y-4">
                {group.settings.map((setting) => (
                  <div key={setting.name} className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {setting.label}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {setting.description}
                      </p>
                    </div>
                    <Switch
                      checked={setting.current}
                      onChange={() => handleToggle(setting.name)}
                      className={`${
                        setting.current ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          setting.current ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Settings; 