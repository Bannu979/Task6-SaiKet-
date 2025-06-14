import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Notifications = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState([]);
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      title: 'Task Completed',
      message: 'John Doe completed the Frontend Development task',
      time: '2 hours ago',
      unread: true,
      type: 'success'
    },
    {
      id: 2,
      title: 'New Task Assigned',
      message: 'You have been assigned to Database Migration task',
      time: '4 hours ago',
      unread: true,
      type: 'info'
    },
    {
      id: 3,
      title: 'Task Updated',
      message: 'Mike Johnson updated the User Authentication task',
      time: '6 hours ago',
      unread: false,
      type: 'warning'
    },
    {
      id: 4,
      title: 'Comment Added',
      message: 'Sarah Wilson commented on Bug Fix #123',
      time: '8 hours ago',
      unread: false,
      type: 'info'
    },
    {
      id: 5,
      title: 'Task Deadline',
      message: 'API Integration task deadline is approaching',
      time: '10 hours ago',
      unread: true,
      type: 'warning'
    },
    {
      id: 6,
      title: 'Project Update',
      message: 'New features have been deployed to production',
      time: '12 hours ago',
      unread: false,
      type: 'success'
    }
  ];

  useEffect(() => {
    // In a real application, you would fetch notifications from your API
    setNotifications(mockNotifications);

    // Get notification ID from URL if present
    const params = new URLSearchParams(location.search);
    const notificationId = params.get('id');
    if (notificationId) {
      setSelectedNotificationId(parseInt(notificationId));
    }
  }, [location.search]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 animate-gradient-x">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
              aria-label="Back to Dashboard"
            >
              <svg
                className="w-6 h-6 text-gray-600 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Notifications</h1>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                View all your notifications
              </p>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                className={`p-4 transition-colors duration-200 ${
                  selectedNotificationId === notification.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/30'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${
                        notification.unread 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {notification.time}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {notification.message}
                    </p>
                  </div>
                  {notification.unread && (
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                        New
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications; 