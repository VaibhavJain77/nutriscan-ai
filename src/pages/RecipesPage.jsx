import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChefHat, ArrowLeft } from "lucide-react";
import { generateRecipeAI } from "../ai";

export default function RecipesPage({ profile, onBack, onAddToLog }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recipes, setRecipes] = useState([]);

  const fetchRecipes = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setRecipes([]);

      const result = await generateRecipeAI({
        food: query,
        goal: profile?.goal || "maintenance",
        condition: profile?.condition || "none",
      });

      setRecipes(Array.isArray(result) ? result : [result]);
    } catch (err) {
      console.error(err);
      setError("Recipe AI failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
        >
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <ChefHat className="text-emerald-600" /> AI Recipes
        </h1>
      </div>

      {/* SEARCH */}
      <div className="flex gap-2 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a food (e.g. pasta, rice, chicken)"
          className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          onClick={fetchRecipes}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 transition-colors"
        >
          {loading ? "Thinking..." : "Generate"}
        </button>
      </div>

      {error && <p className="text-sm text-rose-500 mb-4">{error}</p>}

      {/* RECIPES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recipes.map((recipe, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm"
          >
            <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-slate-100">
              {recipe.title}
            </h3>

            <div className="text-xs text-slate-500 dark:text-slate-400 flex gap-4 mb-3">
              <span>🔥 {recipe.calories} kcal</span>
              <span>💪 {recipe.protein} g</span>
              <span>🧀 {recipe.fats} g</span>
            </div>

            <details className="mb-4 group">
              <summary className="cursor-pointer text-sm font-semibold text-emerald-600 dark:text-emerald-500 select-none">
                View Recipe
              </summary>

              <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl">
                <p className="text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                  Ingredients
                </p>
                <ul className="list-disc ml-5 text-xs text-slate-600 dark:text-slate-400 mb-3">
                  {recipe.ingredients.map((i, iIdx) => (
                    <li key={iIdx}>{i}</li>
                  ))}
                </ul>

                <p className="text-xs font-bold mb-1 text-slate-700 dark:text-slate-300">
                  Instructions
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                  {recipe.instructions}
                </p>
              </div>
            </details>

            {/* ADD TO LOG */}
            <button
              onClick={() => onAddToLog(recipe)}
              className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            >
              Add to Log
            </button>
          </motion.div>
        ))}
      </div>

      {!loading && recipes.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-400 dark:text-slate-600">
            No recipes yet. Try searching for "High protein breakfast".
          </p>
        </div>
      )}
    </div>
  );
}
