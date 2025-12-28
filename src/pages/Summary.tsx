import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mealsAPI } from '@/services/api';
import { format, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import type { Meal } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const CATEGORY_COLORS: Record<string, string> = {
  Breakfast: '#FFC107',
  Lunch: '#2196F3',
  Dinner: '#9C27B0',
  Snack: '#FF5722',
};

export function Summary() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMonthMeals();
  }, [currentDate]);

  const loadMonthMeals = async () => {
    try {
      setIsLoading(true);
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const response = await mealsAPI.getByDateRange(
        format(start, 'yyyy-MM-dd'),
        format(end, 'yyyy-MM-dd')
      );
      setMeals(response.data);
    } catch (error) {
      console.error('Failed to load meals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // Calculate statistics
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const dailyAverage = meals.length > 0 ? Math.round(totalCalories / 30) : 0;

  // Category breakdown
  const categoryData = Object.entries(
    meals.reduce((acc, meal) => {
      acc[meal.category] = (acc[meal.category] || 0) + meal.calories;
      return acc;
    }, {} as Record<string, number>)
  ).map(([category, calories]) => ({
    name: category,
    value: calories,
    fill: CATEGORY_COLORS[category],
  }));

  // Daily data for bar chart
  const dailyData: Record<string, number> = {};
  meals.forEach((meal) => {
    const day = parseInt(meal.date.split('-')[2]);
    dailyData[day] = (dailyData[day] || 0) + meal.calories;
  });

  const barChartData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    calories: dailyData[i + 1] || 0,
  }));

  // Most logged foods
  const foodFrequency: Record<string, number> = {};
  meals.forEach((meal) => {
    foodFrequency[meal.name] = (foodFrequency[meal.name] || 0) + 1;
  });

  const mostLoggedFoods = Object.entries(foodFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Monthly Summary</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="text-lg font-semibold min-w-[200px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading summary...</p>
        </div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card">
              <p className="text-sm text-gray-600 mb-1">Total Calories</p>
              <p className="text-4xl font-bold text-primary">{totalCalories}</p>
              <p className="text-xs text-gray-500 mt-1">kcal</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600 mb-1">Daily Average</p>
              <p className="text-4xl font-bold text-secondary">{dailyAverage}</p>
              <p className="text-xs text-gray-500 mt-1">kcal/day</p>
            </div>
            <div className="card">
              <p className="text-sm text-gray-600 mb-1">Meals Logged</p>
              <p className="text-4xl font-bold text-blue-600">{meals.length}</p>
              <p className="text-xs text-gray-500 mt-1">total</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Calories Chart */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Daily Calories</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="calories" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category Breakdown */}
            <div className="card">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Category Breakdown</h2>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 py-8">No data available</p>
              )}
            </div>
          </div>

          {/* Most Logged Foods */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Most Logged Foods</h2>
            {mostLoggedFoods.length > 0 ? (
              <div className="space-y-3">
                {mostLoggedFoods.map((food, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-300">#{index + 1}</span>
                      <span className="font-medium text-gray-900">{food.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {food.count} {food.count === 1 ? 'time' : 'times'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No meals logged yet</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
