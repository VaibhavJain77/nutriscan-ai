import express from "express";
import { groq } from "../index.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { calories, goal, condition, dietType } = req.body;

    const prompt = `
You are a certified nutritionist AI.

Generate a FULL 7-day meal plan in STRICT JSON ONLY.

Rules:
- Diet type: ${dietType}
- Daily calories: approx ${calories}
- Goal: ${goal}
- Medical condition: ${condition || "none"}
- Make it strictly indian meals

Each day MUST include:
- breakfast
- lunch
- dinner

Each meal MUST include:
- title
- calories (number)
- protein (number)

Return ONLY valid JSON.
No markdown.
No explanations.

JSON FORMAT:
{
  "Monday": {
    "breakfast": { "title": "", "calories": 0, "protein": 0 },
    "lunch": { "title": "", "calories": 0, "protein": 0 },
    "dinner": { "title": "", "calories": 0, "protein": 0 }
  }
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a strict JSON API. You ONLY return valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1200,
    });

    const raw = completion.choices[0].message.content;
    console.log("GROQ RAW TEXT:", raw);

    const jsonMatch = raw.match(/\{[\s\S]*\}$/);
    if (!jsonMatch) {
      throw new Error("AI did not return valid JSON");
    }

    const plan = JSON.parse(jsonMatch[0]);
    res.json(plan);
  } catch (err) {
    console.error("Meal Plan AI Error:", err.message);
    res.status(500).json({ error: "Meal plan generation failed" });
  }
});

export default router;
