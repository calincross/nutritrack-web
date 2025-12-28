import { mysqlTable, varchar, int, text, datetime, boolean, decimal } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  dailyCalorieGoal: int('daily_calorie_goal').default(2000),
  dietType: varchar('diet_type', { length: 50 }).default('balanced'),
  createdAt: datetime('created_at').defaultNow(),
  updatedAt: datetime('updated_at').defaultNow(),
});

export const meals = mysqlTable('meals', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(), // Breakfast, Lunch, Dinner, Snack
  calories: int('calories').notNull(),
  date: varchar('date', { length: 10 }).notNull(), // YYYY-MM-DD
  time: varchar('time', { length: 5 }).notNull(), // HH:MM
  notes: text('notes'),
  createdAt: datetime('created_at').defaultNow(),
});

export const recipes = mysqlTable('recipes', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  ingredients: text('ingredients').notNull(), // JSON stringified array
  instructions: text('instructions').notNull(),
  caloriesPerServing: int('calories_per_serving').notNull(),
  createdAt: datetime('created_at').defaultNow(),
  updatedAt: datetime('updated_at').defaultNow(),
});

export const documents = mysqlTable('documents', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // 'diet-plan' or 'consultation'
  url: varchar('url', { length: 500 }).notNull(),
  size: int('size').notNull(),
  createdAt: datetime('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  meals: many(meals),
  recipes: many(recipes),
  documents: many(documents),
}));

export const mealsRelations = relations(meals, ({ one }) => ({
  user: one(users, {
    fields: [meals.userId],
    references: [users.id],
  }),
}));

export const recipesRelations = relations(recipes, ({ one }) => ({
  user: one(users, {
    fields: [recipes.userId],
    references: [users.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
}));
