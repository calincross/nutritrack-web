import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { mealsAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import type { Meal } from '@/types';
import { format } from 'date-fns';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
const CATEGORY_COLORS: Record<string, string> = {
  Breakfast: '#FFC107',
  Lunch: '#2196F3',
  Dinner: '#9C27B0',
  Snack: '#FF5722',
};

export function Dashboard() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Breakfast' as const,
    calories: '',
    time: format(new Date(), 'HH:mm'),
    notes: '',
  });
  const { user } = useAuth();

  useEffect(() => {
    loadTodayMeals();
  }, []);

  const loadTodayMeals = async () => {
    try {
      setIsLoading(true);
      const today = format(new Date(), 'yyyy-MM-dd');
      const response = await mealsAPI.getByDate(today);
      setMeals(response.data.sort((a: Meal, b: Meal) => b.time.localeCompare(a.time)));
    } catch (error) {
      console.error('Failed to load meals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.calories) return;

    try {
      const mealData = {
        ...formData,
        calories: Number(formData.calories),
        date: format(new Date(), 'yyyy-MM-dd'),
      };

      if (editingMeal) {
        await mealsAPI.update(editingMeal.id, mealData);
      } else {
        await mealsAPI.create(mealData);
      }

      await loadTodayMeals();
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save meal:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this meal?')) {
      try {
        await mealsAPI.delete(id);
        await loadTodayMeals();
      } catch (error) {
        console.error('Failed to delete meal:', error);
      }
    }
  };

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setFormData({
      name: meal.name,
      category: meal.category,
      calories: String(meal.calories),
      time: meal.time,
      notes: meal.notes || '',
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Breakfast',
      calories: '',
      time: format(new Date(), 'HH:mm'),
      notes: '',
    });
    setEditingMeal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Today's Meals</h1>
        <p className="text-gray-600">{format(new Date(), 'MMMM d, yyyy')}</p>
      </div>

      {/* Daily Total */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-6 shadow-lg">
        <p className="text-sm opacity-90 mb-1">Total Calories</p>
        <p className="text-4xl font-bold">{totalCalories}</p>
        <p className="text-sm opacity-90 mt-1">kcal</p>
        {user && (
          <p className="text-sm opacity-75 mt-2">Goal: {user.dailyCalorieGoal} kcal/day</p>
        )}
      </div>

      {/* Quick Log Button */}
      <button
        onClick={() => {
          resetForm();
          setIsModalOpen(true);
        }}
        className="w-full btn-primary flex items-center justify-center gap-2 py-3"
      >
        <Plus size={20} />
        Log Meal
      </button>

      {/* Meals List */}
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-center text-gray-500 py-8">Loading meals...</p>
        ) : meals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">No meals logged today</p>
            <p className="text-gray-400 text-sm">Tap the button above to add your first meal</p>
          </div>
        ) : (
          meals.map((meal) => (
            <div key={meal.id} className="card flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: CATEGORY_COLORS[meal.category] }}
                  >
                    {meal.category}
                  </span>
                  <span className="text-xs text-gray-500">{meal.time}</span>
                </div>
                <h3 className="font-semibold text-gray-900">{meal.name}</h3>
                {meal.notes && <p className="text-sm text-gray-600 mt-1">{meal.notes}</p>}
              </div>
              <div className="text-right ml-4">
                <p className="text-xl font-bold text-primary">{meal.calories}</p>
                <p className="text-xs text-gray-500">kcal</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(meal)}
                    className="p-1 text-gray-500 hover:text-primary"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(meal.id)}
                    className="p-1 text-gray-500 hover:text-error"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingMeal ? 'Edit Meal' : 'Log Meal'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meal Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g., Grilled Chicken Salad"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat as any })}
                      className={`py-2 px-3 rounded-lg font-medium transition-all ${
                        formData.category === cat
                          ? 'text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={
                        formData.category === cat
                          ? { backgroundColor: CATEGORY_COLORS[cat] }
                          : {}
                      }
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calories (kcal)
                </label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 450"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field"
                  placeholder="Add any notes..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  {editingMeal ? 'Update Meal' : 'Save Meal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
