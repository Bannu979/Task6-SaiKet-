import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const Tasks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);

  // Mock data for tasks
  const mockTasks = [
    { id: 1, title: 'Website Redesign', status: 'In Progress', priority: 'High', assignee: 'John Doe' },
    { id: 2, title: 'Database Migration', status: 'Pending', priority: 'Medium', assignee: 'Jane Smith' },
    { id: 3, title: 'API Integration', status: 'Completed', priority: 'High', assignee: 'Mike Johnson' },
    { id: 4, title: 'Security Audit', status: 'In Progress', priority: 'Critical', assignee: 'Sarah Wilson' },
    { id: 5, title: 'Frontend Development', status: 'Completed', priority: 'Medium', assignee: 'John Doe' },
    { id: 6, title: 'Backend Development', status: 'In Progress', priority: 'High', assignee: 'Jane Smith' },
    { id: 7, title: 'Testing', status: 'Pending', priority: 'Low', assignee: 'Mike Johnson' },
    { id: 8, title: 'Deployment', status: 'Pending', priority: 'Critical', assignee: 'Sarah Wilson' },
  ];

  // Mock data for activities
  const mockActivities = [
    { id: 1, user: 'John Doe', action: 'completed', task: 'Frontend Development', time: '2 hours ago' },
    { id: 2, user: 'Jane Smith', action: 'created', task: 'Database Backup', time: '4 hours ago' },
    { id: 3, user: 'Mike Johnson', action: 'updated', task: 'User Authentication', time: '6 hours ago' },
    { id: 4, user: 'Sarah Wilson', action: 'commented on', task: 'Bug Fix #123', time: '8 hours ago' },
    { id: 5, user: 'John Doe', action: 'assigned', task: 'New Feature Development', time: '10 hours ago' },
    { id: 6, user: 'Jane Smith', action: 'completed', task: 'API Documentation', time: '12 hours ago' },
    { id: 7, user: 'Mike Johnson', action: 'created', task: 'Performance Optimization', time: '1 day ago' },
    { id: 8, user: 'Sarah Wilson', action: 'updated', task: 'Security Patch', time: '1 day ago' },
  ];

  useEffect(() => {
    // In a real application, you would fetch this data from your API
    setTasks(mockTasks);
    setActivities(mockActivities);

    // Set the active tab based on URL parameter
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'tasks' || tab === 'activities') {
      setActiveTab(tab);
    }
  }, [location.search]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/tasks?tab=${tab}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-6 animate-gradient-x">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Back to Dashboard"
            >
              <svg
                className="w-6 h-6 text-gray-600"
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
              <h1 className="text-2xl font-semibold text-gray-900">Tasks & Activities</h1>
              <p className="mt-2 text-sm text-gray-700">
                View and manage all tasks and activities
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleTabChange('tasks')}
                className={`${
                  activeTab === 'tasks'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                All Tasks
              </button>
              <button
                onClick={() => handleTabChange('activities')}
                className={`${
                  activeTab === 'activities'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Recent Activities
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'tasks' ? (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`status-badge ${
                          task.status === 'Completed' ? 'status-active' :
                          task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          'status-inactive'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                          task.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.assignee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="flow-root">
              <ul className="-mb-8">
                {activities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== activities.length - 1 ? (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                            <span className="text-sm font-medium text-white">
                              {activity.user.charAt(0)}
                            </span>
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 flex justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-900">{activity.user}</span>
                              {' '}{activity.action}{' '}
                              <span className="font-medium text-gray-900">{activity.task}</span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks; 