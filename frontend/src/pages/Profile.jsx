import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CameraIcon, UserIcon } from '@heroicons/react/outline';
import toast from 'react-hot-toast';

const Profile = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    bio: '',
    profilePicture: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      toast.error('Failed to load profile');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card">
          <div className="text-center mb-8">
            <div className="relative inline-block">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="h-32 w-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <UserIcon className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                </div>
              )}
              <button className="absolute bottom-0 right-0 p-2 bg-primary-600 rounded-full text-white hover:bg-primary-700 transition-colors">
                <CameraIcon className="h-5 w-5" />
              </button>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{user.username}</h2>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                className="input mt-1"
                value={user.username}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="input mt-1"
                value={user.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="4"
                className="input mt-1"
                value={user.bio}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder={isEditing ? "Tell us about yourself..." : "No bio added yet"}
              />
            </div>

            <div className="flex justify-end space-x-4">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile; 