const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ===AI RECIPE ==== */
export async function generateRecipeAI({ food, goal, condition }) {
  const res = await fetch("http://localhost:5000/api/recipe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      food,
      goal,
      condition,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Recipe API error:", text);
    throw new Error("Recipe AI failed");
  }

  return res.json();
}
export async function generateWeeklyMealPlan(data) {
  const res = await fetch("http://localhost:5000/api/meal-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("Meal plan API error:", text);
    throw new Error("Meal plan API failed");
  }

  try {
    return JSON.parse(text);
  } catch {
    console.error("Invalid JSON from backend:", text);
    throw new Error("Invalid AI meal plan");
  }
}

function getFallbackMealPlan() {
  return {
    Monday: {
      breakfast: "Oats with fruits",
      lunch: "Dal rice",
      dinner: "Vegetable curry",
    },
    Tuesday: {
      breakfast: "Toast & eggs",
      lunch: "Paneer bowl",
      dinner: "Roti sabzi",
    },
  };
}

/* ==== AI COACH ==== */
export async function getCoachResponse(messages, input, profile) {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: input,
      profile,
    }),
  });

  const data = await res.json();
  return data.reply;
}

/*=== DINNER PLANNER === */
export async function generateDinnerIdeaAI({
  remainingCalories,
  dietType,
  condition,
  goal,
}) {
  const res = await fetch(`${API_URL}/api/dinner`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      remainingCalories,
      dietType,
      condition,
      goal,
    }),
  });

  if (!res.ok) {
    throw new Error("AI dinner failed");
  }

  return await res.json();
}

/* === MEDICAL REPORT (PDF) === */
export async function exportMedicalReportPDF(profile, nutrition) {
  const res = await fetch(`${API_URL}/api/report/pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, nutrition }),
  });

  if (!res.ok) {
    throw new Error("PDF export failed");
  }

  return await res.blob();
}
