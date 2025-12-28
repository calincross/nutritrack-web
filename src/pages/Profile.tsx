import React, { useState, useEffect } from 'react';
import { Save, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '@/services/api';

const DIET_TYPES = [
  'Balanced',
  'Low Carb',
  'High Protein',
  'Vegan',
  'Vegetarian',
  'Keto',
  'Mediterranean',
  'Paleo',
];

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    dailyCalorieGoal: user?.dailyCalorieGoal || 2000,
    dietType: user?.dietType || 'Balanced',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        dailyCalorieGoal: user.dailyCalorieGoal,
        dietType: user.dietType,
      });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      await userAPI.updateProfile({
        dailyCalorieGoal: Number(formData.dailyCalorieGoal),
        dietType: formData.dietType,
      });

      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      {/* Success Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* Account Information */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Account Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="input-field bg-gray-50 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="card space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Preferences</h2>

        {/* Daily Calorie Goal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Daily Calorie Goal
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1000"
              max="5000"
              step="100"
              value={formData.dailyCalorieGoal}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dailyCalorieGoal: Number(e.target.value),
                })
              }
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-right min-w-[80px]">
              <input
                type="number"
                value={formData.dailyCalorieGoal}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dailyCalorieGoal: Number(e.target.value),
                  })
                }
                className="input-field text-center"
                min="1000"
                max="5000"
              />
              <p className="text-xs text-gray-500 mt-1">kcal/day</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Set your daily calorie intake goal for tracking purposes
          </p>
        </div>

        {/* Diet Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Diet Type</label>
          <select
            value={formData.dietType}
            onChange={(e) =>
              setFormData({
                ...formData,
                dietType: e.target.value,
              })
            }
            className="input-field"
          >
            {DIET_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2">
            Choose your preferred diet type for personalized recommendations
          </p>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Statistics */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Account Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Email</p>
            <p className="font-semibold text-gray-900 truncate">{user?.email}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Daily Goal</p>
            <p className="font-semibold text-gray-900">{formData.dailyCalorieGoal} kcal</p>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full px-4 py-3 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}
