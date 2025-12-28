export type MealCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface Meal {
  id: string;
  name: string;
  category: MealCategory;
  calories: number;
  date: string;
  time: string;
  notes?: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string;
  caloriesPerServing: number;
  dateCreated: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'diet-plan' | 'consultation';
  url: string;
  size: number;
  dateAdded: string;
}

export interface User {
  id: string;
  email: string;
  dailyCalorieGoal: number;
  dietType: string;
}
