import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Switch } from '@headlessui/react';
import { BellIcon, GlobeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const defaultSettings = {
  theme: 'light',
  notifications: {
    email: true,
    push: true
  },
  privacy: {
    profileVisibility: true,
    activityTracking: true
  }
};

const Settings = () => {
  const { toggleDarkMode } = useTheme();
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user, getAuthHeader } = useAuth();
  const navigate = useNavigate();

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/settings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...getAuthHeader()
          },
          credentials: 'include',
          mode: 'cors'
        });

        if (!response.ok) {
          if (response.status === 401) {
            toast.error('Please log in to access settings');
            navigate('/login');
            return;
          }
          throw new Error('Failed to load settings');
        }

        const data = await response.json();
        // Merge received data with default settings to ensure all properties exist
        setSettings({
          ...defaultSettings,
          ...data,
          notifications: {
            ...defaultSettings.notifications,
            ...(data.notifications || {})
          },
          privacy: {
            ...defaultSettings.privacy,
            ...(data.privacy || {})
          }
        });
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Failed to load settings');
        // Use default settings if loading fails
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
    loadSettings();
    }
  }, [user, getAuthHeader, navigate]);

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const response = await fetch('http://localhost:5000/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...getAuthHeader()
        },
        credentials: 'include',
        mode: 'cors',
        body: JSON.stringify({
          theme: settings.theme || defaultSettings.theme,
          notifications: {
            email: settings.notifications?.email ?? defaultSettings.notifications.email,
            push: settings.notifications?.push ?? defaultSettings.notifications.push
          },
          privacy: {
            profileVisibility: settings.privacy?.profileVisibility ?? defaultSettings.privacy.profileVisibility,
            activityTracking: settings.privacy?.activityTracking ?? defaultSettings.privacy.activityTracking
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          toast.error('Please log in to save settings');
          navigate('/login');
          return;
        }
        throw new Error(errorData.message || 'Failed to save settings');
      }

      const updatedSettings = await response.json();
      setSettings({
        ...defaultSettings,
        ...updatedSettings,
        notifications: {
          ...defaultSettings.notifications,
          ...(updatedSettings.notifications || {})
        },
        privacy: {
          ...defaultSettings.privacy,
          ...(updatedSettings.privacy || {})
        }
      });
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
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
          current: settings.privacy.profileVisibility,
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
          current: settings.notifications.email,
        },
        {
          name: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Receive push notifications about account activity',
          current: settings.notifications.push,
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
          current: false,
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
          current: settings.theme === 'dark',
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Failed to load settings</h2>
        <p className="text-gray-600 dark:text-gray-400">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 animate-gradient-x">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
        <div
          className="flex flex-col items-start"
        >
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            <span
              className="opacity-0"
            >
              Settings
            </span>
          </h1>
          <p 
            className="mt-2 text-sm text-gray-700 dark:text-gray-300"
          >
            Manage your account settings and preferences.
          </p>
        </div>
        <button 
            className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
          }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
            onClick={handleSaveChanges}
            disabled={saving}
          >
            {saving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
        </button>
      </div>

        <div className="grid grid-cols-1 gap-6">
          {settingsGroups.map((group, groupIndex) => (
            <div
              key={group.title}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
              <div className="flex items-center mb-4">
                  <group.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
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
                      onChange={() => {
                        if (setting.name === 'darkMode') {
                          toggleDarkMode();
                        } else {
                          setSettings((prev) => ({
                            ...prev,
                            [setting.name]: !prev[setting.name],
                          }));
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                        setting.current ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-1 ring-black/5 transition-transform duration-200 ${
                          setting.current ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </Switch>
                  </div>
                ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings; 