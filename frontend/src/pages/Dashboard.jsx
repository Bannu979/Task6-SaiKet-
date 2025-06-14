import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isGenerateReportModalOpen, setIsGenerateReportModalOpen] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    assignee: ''
  });

  const finalStats = [
    { name: 'Total Users', value: '120', change: '+12%', changeType: 'increase' },
    { name: 'Active Tasks', value: '45', change: '+8%', changeType: 'increase' },
    { name: 'Completed Tasks', value: '89', change: '+24%', changeType: 'increase' },
    { name: 'Pending Tasks', value: '12', change: '-5%', changeType: 'decrease' },
  ];

  const [stats, setStats] = useState(finalStats.map(stat => ({ ...stat, value: '0' })));

  const recentTasks = [
    { id: 1, title: 'Website Redesign', status: 'In Progress', priority: 'High', assignee: 'John Doe' },
    { id: 2, title: 'Database Migration', status: 'Pending', priority: 'Medium', assignee: 'Jane Smith' },
    { id: 3, title: 'API Integration', status: 'Completed', priority: 'High', assignee: 'Mike Johnson' },
    { id: 4, title: 'Security Audit', status: 'In Progress', priority: 'Critical', assignee: 'Sarah Wilson' },
  ];

  const recentActivity = [
    { id: 1, user: 'John Doe', action: 'completed', task: 'Frontend Development', time: '2 hours ago' },
    { id: 2, user: 'Jane Smith', action: 'created', task: 'Database Backup', time: '4 hours ago' },
    { id: 3, user: 'Mike Johnson', action: 'updated', task: 'User Authentication', time: '6 hours ago' },
    { id: 4, user: 'Sarah Wilson', action: 'commented on', task: 'Bug Fix #123', time: '8 hours ago' },
  ];

  // Data for Task Progress Chart
  const taskProgressData = [
    { month: 'Jan', completed: 45, active: 28, pending: 15 },
    { month: 'Feb', completed: 52, active: 32, pending: 17 },
    { month: 'Mar', completed: 48, active: 24, pending: 13 },
    { month: 'Apr', completed: 61, active: 35, pending: 19 },
    { month: 'May', completed: 55, active: 29, pending: 14 },
    { month: 'Jun', completed: 67, active: 38, pending: 21 },
  ];

  // Data for User Activity Chart
  const userActivityData = [
    { day: 'Mon', tasks: 24 },
    { day: 'Tue', tasks: 32 },
    { day: 'Wed', tasks: 28 },
    { day: 'Thu', tasks: 35 },
    { day: 'Fri', tasks: 30 },
    { day: 'Sat', tasks: 15 },
    { day: 'Sun', tasks: 12 },
  ];

  // Data for Task Distribution
  const taskDistributionData = [
    { name: 'Development', value: 35 },
    { name: 'Design', value: 25 },
    { name: 'Testing', value: 20 },
    { name: 'Planning', value: 15 },
    { name: 'Other', value: 5 },
  ];

  // Function to fetch users
  const fetchUsers = async () => {
    try {
      // For now, we'll use the mock data from UserList
      const mockUsers = [
        {
          id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'Active',
    },
    {
          id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      status: 'Active',
    },
    {
          id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'User',
      status: 'Inactive',
        },
      ];
      return mockUsers;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  // Function to fetch tasks
  const fetchTasks = async () => {
    try {
      // Mock tasks data
      const mockTasks = [
        { id: 1, title: 'Task 1', status: 'Completed', priority: 'High' },
        { id: 2, title: 'Task 2', status: 'In Progress', priority: 'Medium' },
        { id: 3, title: 'Task 3', status: 'In Progress', priority: 'Low' },
        { id: 4, title: 'Task 4', status: 'Completed', priority: 'High' },
        { id: 5, title: 'Task 5', status: 'Pending', priority: 'Medium' },
      ];
      return mockTasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  };

  // Function to calculate stats
  const calculateStats = async () => {
    const users = await fetchUsers();
    const tasks = await fetchTasks();

    // Calculate total users and active users
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === 'Active').length;
    const userChange = ((activeUsers / totalUsers) * 100).toFixed(0);

    // Calculate task stats
    const totalTasks = tasks.length;
    const activeTasks = tasks.filter(task => task.status === 'In Progress').length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const taskChange = ((activeTasks / totalTasks) * 100).toFixed(0);

    // Calculate completion rate
    const completionRate = ((completedTasks / totalTasks) * 100).toFixed(0);
    const previousCompletionRate = 65; // Mock previous rate
    const completionChange = (completionRate - previousCompletionRate).toFixed(0);

    // Calculate overall progress
    const progress = ((completedTasks + (activeTasks * 0.5)) / totalTasks * 100).toFixed(0);
    const previousProgress = 45; // Mock previous progress
    const progressChange = (progress - previousProgress).toFixed(0);

    setStats(finalStats.map(stat => ({
      ...stat,
      value: stat.value.toString()
    })));
  };

  useEffect(() => {
    finalStats.forEach((stat, index) => {
      const target = parseInt(stat.value);
      let current = 0;
      const step = Math.ceil(target / 30); // Will complete in 30 steps
      const timer = setInterval(() => {
        if (current < target) {
          current = Math.min(current + step, target);
          setStats(prev => prev.map((s, i) => 
            i === index ? { ...s, value: current.toString() } : s
          ));
        } else {
          clearInterval(timer);
        }
      }, 50);
      return () => clearInterval(timer);
    });
  }, []);

  const handleNewTask = (e) => {
    e.preventDefault();
    console.log('Creating new task:', newTaskForm);
    toast.success('Task created successfully!');
    setNewTaskForm({
      title: '',
      description: '',
      priority: 'Medium',
      assignee: ''
    });
    setIsNewTaskModalOpen(false);
  };

  const handleGenerateReport = (reportType) => {
    console.log('Generating report:', reportType);
    toast.success(`${reportType} generated successfully!`);
    
    setTimeout(() => {
      const csvContent = `Report Type: ${reportType}\nGenerated At: ${new Date().toLocaleString()}\n\nMock Data,Value\nItem 1,100\nItem 2,200`;
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 1000);

    setIsGenerateReportModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-6 animate-gradient-x">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Overview of your task management system
          </p>
      </div>

      {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="card bg-white dark:bg-gray-800 overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="p-5 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{stat.name}</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{stat.value}</p>
                  </div>
                  <div className={`ml-3 flex items-center text-sm font-medium px-2.5 py-0.5 rounded-full ${
                    stat.changeType === 'increase' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                      : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                  } transition-colors duration-200`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
          {/* Task Progress Chart */}
          <div className="card bg-white dark:bg-gray-800 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Task Progress Overview</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={taskProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: '#F3F4F6'
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="completed" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Completed" />
                    <Area type="monotone" dataKey="active" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Active" />
                    <Area type="monotone" dataKey="pending" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="Pending" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
                      </div>
                </div>

          {/* User Activity Chart */}
          <div className="card bg-white dark:bg-gray-800 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Weekly User Activity</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: '#F3F4F6'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="tasks" fill="#6366F1" name="Tasks Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Task Distribution Chart */}
          <div className="card bg-white dark:bg-gray-800 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Task Distribution</h2>
              <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={taskDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: '#F3F4F6'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} name="Tasks" />
              </LineChart>
            </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="card bg-white dark:bg-gray-800 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Tasks</h2>
                <Link to="/tasks?tab=tasks" className="btn btn-primary text-sm">View all</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Task</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assignee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                        <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{task.title}</td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">
                          <span className={`status-badge ${
                            task.status === 'Completed' ? 'status-active dark:bg-green-900/30 dark:text-green-300' :
                            task.status === 'In Progress' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                            'status-inactive dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            task.priority === 'Critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                            task.priority === 'High' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                            'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{task.assignee}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          <div className="card bg-white dark:bg-gray-800 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
                <Link to="/tasks?tab=activities" className="btn btn-secondary text-sm">View all</Link>
              </div>
              <div className="flow-root">
                <ul className="-mb-8">
                  {recentActivity.map((activity, activityIdx) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {activityIdx !== recentActivity.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                              <span className="text-sm font-medium text-white">
                                {activity.user.charAt(0)}
                              </span>
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 flex justify-between space-x-4 pt-1.5">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-white">{activity.user}</span>
                                {' '}{activity.action}{' '}
                                <span className="font-medium text-gray-900 dark:text-white">{activity.task}</span>
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
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
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <button
                  onClick={() => setIsNewTaskModalOpen(true)}
                  className="btn bg-indigo-600 hover:bg-indigo-700 text-white w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New Task
                </button>
                <button
                  onClick={() => navigate('/users')}
                  className="btn bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add User
                </button>
                <button
                  onClick={() => setIsGenerateReportModalOpen(true)}
                  className="btn bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Report
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="btn bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
                      </div>
                    </div>
          </div>
        </div>
      </div>

      {/* New Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" onClick={() => setIsNewTaskModalOpen(false)} />
            
            <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg sm:p-6">
              <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                <button
                  type="button"
                  className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  onClick={() => setIsNewTaskModalOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">Create New Task</h3>
                  <form onSubmit={handleNewTask} className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={newTaskForm.title}
                        onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={newTaskForm.description}
                        onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Priority
                      </label>
                      <select
                        id="priority"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={newTaskForm.priority}
                        onChange={(e) => setNewTaskForm({ ...newTaskForm, priority: e.target.value })}
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Assignee
                      </label>
                      <input
                        type="text"
                        id="assignee"
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={newTaskForm.assignee}
                        onChange={(e) => setNewTaskForm({ ...newTaskForm, assignee: e.target.value })}
                      />
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="btn btn-primary w-full sm:ml-3 sm:w-auto"
                      >
                        Create Task
                      </button>
                      <button
                        type="button"
                        className="mt-3 btn btn-secondary w-full sm:mt-0 sm:w-auto"
                        onClick={() => setIsNewTaskModalOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {isGenerateReportModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" onClick={() => setIsGenerateReportModalOpen(false)} />
            
            <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">Generate Report</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Select the type of report you want to generate.
                  </p>
                  <div className="space-y-4">
                    <button
                      onClick={() => handleGenerateReport('Task Summary Report')}
                      className="btn btn-primary w-full flex items-center justify-center gap-2"
                    >
                      Task Summary Report
                    </button>
                    <button
                      onClick={() => handleGenerateReport('User Activity Report')}
                      className="btn btn-primary w-full flex items-center justify-center gap-2"
                    >
                      User Activity Report
                    </button>
                    <button
                      onClick={() => handleGenerateReport('Performance Analytics')}
                      className="btn btn-primary w-full flex items-center justify-center gap-2"
                    >
                      Performance Analytics
                    </button>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="mt-3 btn btn-secondary w-full sm:mt-0 sm:w-auto"
                      onClick={() => setIsGenerateReportModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 