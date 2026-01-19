import fetch from "node-fetch";

/**
 * Chat with AI (Indian Nutrition Focus)
 */
export async function chatWithAI(message, profile = {}) {
  try {
    const systemPrompt = `
You are an expert Indian nutritionist and diet coach.

STRICT RULES (VERY IMPORTANT):
- ONLY Indian food
- NO Western food ever
- NO pizza, pasta, burger, salad, sandwich, oats, cereal
- Use Indian meals only

ALLOWED FOODS:
roti, chapati, rice, dal, rajma, chole, sabzi, paneer,
curd, buttermilk, egg bhurji, chicken curry,
fish curry, idli, dosa, upma, poha, khichdi,
millets (jowar, bajra, ragi)

USER PROFILE:
Diet type: ${profile.dietType || "veg"}
Medical condition: ${profile.condition || "none"}
Goal: ${profile.goal || "maintenance"}

HEALTH RULES:
- If diabetes: avoid sugar, white rice, potatoes
- If veg: no meat or fish
- If non-veg: chicken, egg, fish allowed
- Prefer home-style Indian meals

FORMAT RULES:
- Short response
- Simple language
- Max 3–4 lines
- Suggest practical Indian food only

If you suggest non-Indian food → response is INVALID.
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0.6,
          max_tokens: 300,
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "assistant",
              content:
                "A healthy Indian dinner can be dal, vegetable sabzi, 2 rotis, and curd.",
            },

            { role: "user", content: message },
          ],
        }),
      }
    );

    const rawText = await response.text();
    console.log("GROQ RAW TEXT:", rawText);

    if (!response.ok) {
      throw new Error("Groq request failed");
    }

    const data = JSON.parse(rawText);
    let reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error("Empty AI reply");
    }

    const forbidden = [
      "pizza",
      "pasta",
      "burger",
      "salad",
      "sandwich",
      "oats",
      "cereal",
      "toast",
    ];

    if (forbidden.some((w) => reply.toLowerCase().includes(w))) {
      return fallbackIndianReply(message, profile);
    }

    return reply;
  } catch (err) {
    console.error("❌ Groq Chat Error:", err.message);
    return fallbackIndianReply(message, profile);
  }
}

function fallbackIndianReply(message, profile) {
  const text = message.toLowerCase();

  if (text.includes("dinner")) {
    if (profile.condition === "diabetes") {
      return "Have mixed vegetable sabzi, dal, and jowar roti. Avoid rice and sugar.";
    }

    if (profile.dietType === "non-veg") {
      return "Chicken curry with 2 rotis and vegetable sabzi is a good Indian dinner.";
    }

    return "Dal, seasonal sabzi, 2 rotis, and curd make a healthy Indian dinner.";
  }

  if (text.includes("protein")) {
    return "Good Indian protein sources are dal, paneer, curd, eggs, rajma, and chole.";
  }

  if (text.includes("diabetes")) {
    return "Prefer millets, dal, vegetables, and avoid sugar and refined carbs.";
  }

  if (text.includes("weight loss")) {
    return "For weight loss, eat smaller portions, more sabzi, dal, and avoid fried food.";
  }

  return "I can help with Indian meals, dinner ideas, nutrition, and health goals.";
}
export async function generateMedicalSummary(profile, nutrition) {
  const prompt = `
Write a short medical summary for a doctor.

Patient details:
Age: ${profile.age}
Sex: ${profile.sex}
Weight: ${profile.weight} kg
Height: ${profile.height} cm
Goal: ${profile.goal}
Condition: ${profile.condition || "None"}

Daily intake:
Calories: ${nutrition.calories} kcal
Protein: ${nutrition.protein} g
Fats: ${nutrition.fats} g

Rules:
- Use simple medical language
- Indian diet context
- Max 5–6 lines
- No emojis
`;

  return await chatWithAI(prompt, profile);
}
