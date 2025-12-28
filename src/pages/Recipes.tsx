import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { recipesAPI } from '@/services/api';
import type { Recipe } from '@/types';

export function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    ingredients: [''],
    instructions: '',
    caloriesPerServing: '',
  });

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setIsLoading(true);
      const response = await recipesAPI.getAll();
      setRecipes(response.data);
    } catch (error) {
      console.error('Failed to load recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadRecipes();
      return;
    }

    try {
      const response = await recipesAPI.search(searchQuery);
      setRecipes(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.instructions || !formData.caloriesPerServing) return;

    try {
      const recipeData = {
        ...formData,
        ingredients: formData.ingredients.filter((i) => i.trim()),
        caloriesPerServing: Number(formData.caloriesPerServing),
      };

      if (editingRecipe) {
        await recipesAPI.update(editingRecipe.id, recipeData);
      } else {
        await recipesAPI.create(recipeData);
      }

      await loadRecipes();
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save recipe:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      try {
        await recipesAPI.delete(id);
        await loadRecipes();
        setSelectedRecipe(null);
      } catch (error) {
        console.error('Failed to delete recipe:', error);
      }
    }
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    const ingredients = typeof recipe.ingredients === 'string'
      ? JSON.parse(recipe.ingredients)
      : recipe.ingredients;
    setFormData({
      name: recipe.name,
      ingredients,
      instructions: recipe.instructions,
      caloriesPerServing: String(recipe.caloriesPerServing),
    });
    setIsModalOpen(true);
    setSelectedRecipe(null);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      ingredients: [''],
      instructions: '',
      caloriesPerServing: '',
    });
    setEditingRecipe(null);
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, ''],
    });
  };

  const removeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index),
    });
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Recipes</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          New Recipe
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes..."
            className="input-field pl-10"
          />
        </div>
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      {/* Recipes Grid */}
      <div>
        {isLoading ? (
          <p className="text-center text-gray-500 py-12">Loading recipes...</p>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">No recipes found</p>
            <p className="text-gray-400 text-sm">Create your first recipe to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => setSelectedRecipe(recipe)}
                className="card cursor-pointer hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{recipe.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recipe.instructions}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">
                    {recipe.caloriesPerServing} kcal/serving
                  </span>
                  <span className="text-xs text-gray-500">
                    {typeof recipe.ingredients === 'string'
                      ? JSON.parse(recipe.ingredients).length
                      : recipe.ingredients.length}{' '}
                    ingredients
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{selectedRecipe.name}</h2>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Ingredients</h3>
                <ul className="list-disc list-inside space-y-1">
                  {(typeof selectedRecipe.ingredients === 'string'
                    ? JSON.parse(selectedRecipe.ingredients)
                    : selectedRecipe.ingredients
                  ).map((ingredient: string, index: number) => (
                    <li key={index} className="text-gray-700">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedRecipe.instructions}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Calories per serving</p>
                <p className="text-2xl font-bold text-primary">{selectedRecipe.caloriesPerServing} kcal</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    handleEdit(selectedRecipe);
                    setSelectedRecipe(null);
                  }}
                  className="flex-1 btn-secondary flex items-center justify-center gap-2"
                >
                  <Edit2 size={18} />
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedRecipe.id);
                  }}
                  className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recipe Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingRecipe ? 'Edit Recipe' : 'New Recipe'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipe Name
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
                  Ingredients
                </label>
                <div className="space-y-2">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => updateIngredient(index, e.target.value)}
                        className="input-field"
                        placeholder="e.g., 200g chicken breast"
                      />
                      {formData.ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="mt-2 text-sm text-primary font-medium hover:underline"
                >
                  + Add Ingredient
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions
                </label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="input-field"
                  placeholder="Step by step instructions..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calories per Serving
                </label>
                <input
                  type="number"
                  value={formData.caloriesPerServing}
                  onChange={(e) => setFormData({ ...formData, caloriesPerServing: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 350"
                  required
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
                  {editingRecipe ? 'Update Recipe' : 'Create Recipe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
