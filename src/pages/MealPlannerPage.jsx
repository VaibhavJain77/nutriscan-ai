import { useEffect, useState } from "react";
import { generateWeeklyMealPlan } from "../ai";

export default function MealPlannerPage({ profile, onAddToLog }) {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dietType, setDietType] = useState("veg");

  useEffect(() => {
    const saved = localStorage.getItem("nutriscan_meal_plan");
    if (saved) setPlan(JSON.parse(saved));
  }, []);

  const generatePlan = async () => {
    try {
      setLoading(true);

      const result = await generateWeeklyMealPlan({
        calories: profile.calorieGoal || 2200,
        goal: profile.goal,
        condition: profile.condition,
        dietType,
      });

      setPlan(result);
      localStorage.setItem("nutriscan_meal_plan", JSON.stringify(result));
    } catch (err) {
      console.error("❌ AI weekly planner failed:", err);
      alert("AI meal planner failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center font-semibold">Generating AI meal plan…</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">7-Day Meal Planner</h2>
        <button
          onClick={generatePlan}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white"
        >
          Generate with AI
        </button>
      </div>

      {/* DIET TYPE */}
      <div className="flex gap-2">
        {["veg", "non-veg", "other"].map((d) => (
          <button
            key={d}
            onClick={() => setDietType(d)}
            className={`px-3 py-1 rounded-lg text-sm ${
              dietType === d
                ? "bg-emerald-600 text-white"
                : "bg-slate-200 dark:bg-slate-800"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* MEAL PLAN */}
      {plan &&
        Object.entries(plan).map(([day, meals]) => (
          <div
            key={day}
            className="rounded-xl border p-4 bg-white dark:bg-slate-900"
          >
            <h3 className="font-bold mb-3">{day}</h3>

            {Object.entries(meals).map(([type, meal]) => (
              <div
                key={type}
                className="flex justify-between items-center py-2"
              >
                <div>
                  <p className="font-semibold capitalize">
                    {type}: {meal.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {meal.calories} kcal • {meal.protein}g protein
                  </p>
                </div>

                <button
                  onClick={() => onAddToLog(meal)}
                  className="text-xs px-3 py-1 rounded bg-emerald-100 text-emerald-700"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
