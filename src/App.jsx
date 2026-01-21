import React, { useState, useRef, useEffect } from "react";
import {
  generateDinnerIdeaAI,
  getCoachResponse,
  exportMedicalReportPDF,
} from "./ai";
import { useTheme } from "./hooks/useTheme";
import ThemeToggle from "./components/ThemeToggle";
import MealPlannerPage from "./pages/MealPlannerPage";
import { loadVisionModel, detectFoodFromImage } from "./utils/tfVision";
import RecipesPage from "./pages/RecipesPage";
import { resolveFood } from "./utils/resolveFood";
import { motion, AnimatePresence } from "framer-motion";
import { FOOD_DB } from "./data/food/foodDB";
import {
  Scan,
  Activity,
  ChevronRight,
  User,
  Bell,
  LogOut,
  Camera,
  MessageSquare,
  Search,
  ShieldAlert,
  Ruler,
  Scale,
  Calendar,
  ChefHat,
  FileText,
  Download,
  Award,
  Zap,
  Utensils,
  Flame,
  Drumstick,
  Droplets,
  X,
  Send,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// --- COMPONENTS ---

const LandingPage = ({ onGetStarted }) => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-100 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100 rounded-full blur-[100px]" />
    </div>

    <nav className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <img src="/logo-icon.png" alt="NutriScan AI" className="w-7 h-7" />
        <span className="text-2xl font-bold text-emerald-600 tracking-tight">
          NutriScan AI
        </span>
      </div>

      <button
        className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 transition-colors"
        onClick={onGetStarted}
      >
        Login
      </button>
    </nav>

    <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-emerald-600 font-medium mb-6 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Powered by AI Vision
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-slate-900 dark:text-slate-100">
          Your Health.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
            Simplified by AI.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          From vision-based logging to generating doctor reports. Experience the
          proactive health partner that knows you.
        </p>

        <button
          onClick={onGetStarted}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
        >
          Start Your Journey
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </main>
  </div>
);

const ProfileSetup = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "Vaibhav",
    sex: "",
    age: "",
    height: "",
    weight: "",
    condition: "",
    goal: "maintenance",
    calorieGoal: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const { age, height, weight, sex } = form;

    if (!age || age < 5 || age > 100) {
      alert("Please enter a valid age (5–100)");
      return;
    }

    if (!height || height < 100 || height > 250) {
      alert("Please enter a valid height (100–250 cm)");
      return;
    }

    if (!weight || weight < 30 || weight > 300) {
      alert("Please enter a valid weight (30–300 kg)");
      return;
    }

    if (!sex) {
      alert("Please select sex");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      onComplete(form);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <div className="bg-white dark:bg-slate-900 border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
          <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-100">
            Create Health Profile
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
            Let Cortexx customize your plan.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  First Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Sex
                </label>
                <select
                  value={form.sex}
                  onChange={(e) => setForm({ ...form, sex: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Age
                </label>
                <input
                  type="number"
                  placeholder="20"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                  <Ruler className="w-3 h-3" /> Height (cm)
                </label>
                <input
                  type="number"
                  placeholder="175"
                  value={form.height}
                  onChange={(e) => setForm({ ...form, height: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                  <Scale className="w-3 h-3" /> Weight (kg)
                </label>
                <input
                  type="number"
                  placeholder="70"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Health Conditions
              </label>
              <div className="relative">
                <ShieldAlert className="absolute left-3 top-3.5 w-5 h-5 text-emerald-500" />
                <input
                  type="text"
                  placeholder="e.g. Diabetes, Lactose Intolerance"
                  value={form.condition}
                  onChange={(e) =>
                    setForm({ ...form, condition: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Goal
              </label>

              <select
                value={form.goal}
                onChange={(e) => setForm({ ...form, goal: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3"
              >
                <option value="maintenance">Maintain Weight</option>
                <option value="loss">Weight Loss</option>
                <option value="gain">Weight Gain</option>
                <option value="muscle">Muscle Gain</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Daily Calorie Goal (optional)
              </label>

              <input
                type="number"
                placeholder="e.g. 2200"
                value={form.calorieGoal}
                onChange={(e) =>
                  setForm({ ...form, calorieGoal: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
            >
              {loading ? (
                <span className="animate-pulse">Building Dashboard...</span>
              ) : (
                <>
                  Enter Dashboard <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
function calculateBMI(weight, heightCm) {
  if (!weight || !heightCm) return null;
  const heightM = heightCm / 100;
  return (weight / (heightM * heightM)).toFixed(1);
}

function getBMILabel(bmi) {
  if (!bmi) return "";
  if (bmi < 18.5) return "U";
  if (bmi < 25) return "N";
  if (bmi < 30) return "O";
  return "Ob";
}

function calculateCalories(profile) {
  const { sex, weight, height, age, goal } = profile;

  let bmr =
    sex === "Male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  let calories = bmr * 1.4;

  if (goal === "loss") calories -= 400;
  if (goal === "gain") calories += 300;
  if (goal === "muscle") calories += 500;

  return Math.round(calories);
}
function generateWeightGraph(profile) {
  const startWeight = Number(profile.weight);
  if (!startWeight) return [];

  let change = 0;

  if (profile.goal === "loss") change = -0.4;
  if (profile.goal === "gain") change = 0.3;
  if (profile.goal === "muscle") change = 0.25;
  if (profile.goal === "maintenance") change = 0.05;

  return [
    { name: "Mon", weight: startWeight },
    { name: "Tue", weight: startWeight + change },
    { name: "Wed", weight: startWeight + change * 2 },
    { name: "Thu", weight: startWeight + change * 3 },
    { name: "Fri", weight: startWeight + change * 4 },
    { name: "Sat", weight: startWeight + change * 5 },
    { name: "Sun", weight: startWeight + change * 6 },
  ].map((d) => ({
    ...d,
    weight: Number(d.weight.toFixed(1)),
  }));
}
function getPredictionText(profile) {
  const weight = Number(profile.weight);
  if (!weight) return "No prediction available yet.";

  if (profile.goal === "loss") {
    return `On track to reach ${(weight - 2).toFixed(
      1,
    )} kg in the next few weeks.`;
  }

  if (profile.goal === "gain") {
    return `On track to reach ${(weight + 2).toFixed(
      1,
    )} kg in the next few weeks.`;
  }

  if (profile.goal === "muscle") {
    return `Building lean mass steadily over the next few weeks.`;
  }

  return "Maintaining current weight trend.";
}
function calculateNutrition(profile) {
  const weight = Number(profile.weight);
  const calories = profile.calorieGoal || calculateCalories(profile);

  // ---- PROTEIN ----
  let proteinPerKg = 1.8;
  if (profile.goal === "loss") proteinPerKg = 1.6;
  if (profile.goal === "muscle") proteinPerKg = 2.0;

  const protein = Math.round(weight * proteinPerKg);

  // ---- FATS ----
  const fatCalories = calories * 0.27;
  const fats = Math.round(fatCalories / 9);

  return {
    calories,
    protein,
    fats,
  };
}
const ModelLoadingNotice = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 w-full max-w-md p-6 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
      <div className="flex flex-col items-center text-center gap-4 mt-2">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-2 shadow-inner">
          <Zap className="w-8 h-8 text-emerald-600 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Initializing AI Models
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          Welcome to your dashboard! 🚀 <br />
          <br />
          Please note that our{" "}
          <span className="font-bold text-slate-700 dark:text-slate-200">
            AI Vision features
          </span>{" "}
          need about{" "}
          <span className="font-bold text-emerald-600">1–2 minutes</span> to
          warm up. This only happens once per session.
        </p>
        <button
          onClick={onClose}
          className="w-full py-3.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity mt-4 shadow-lg"
        >
          Got it, I'll wait
        </button>
      </div>
    </motion.div>
  </motion.div>
);
const Dashboard = ({
  profile,
  setView,
  foodLogs,
  setFoodLogs,
  theme,
  toggleTheme,
  currentView,
  onAddRecipe,
  onLogout,
}) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [showModelWait, setShowModelWait] = useState(false);

  useEffect(() => {
    const hasShown = sessionStorage.getItem("hasShownModelNotice");
    if (!hasShown) {
      setShowModelWait(true);
      sessionStorage.setItem("hasShownModelNotice", "true");
    }
  }, []);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const bmi = calculateBMI(profile?.weight, profile?.height);
  const bmiLabel = getBMILabel(bmi);
  const [generating, setGenerating] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const todaysLogs = foodLogs.filter((log) => log.date === today);
  const historyLogs = foodLogs.filter((log) => log.date !== today);
  const [exporting, setExporting] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [generatedMeal, setGeneratedMeal] = useState(null);
  const [dietType, setDietType] = useState("veg");
  const [selectedFood, setSelectedFood] = useState(null);
  const [condition, setCondition] = useState("none");
  const calorieTarget = profile.calorieGoal || calculateCalories(profile);
  const graphData = generateWeightGraph(profile);
  const [servings, setServings] = useState(1);
  const [isScanResolved, setIsScanResolved] = useState(false);
  const predictionText = getPredictionText(profile);
  const nutrition = calculateNutrition(profile);
  const [foodQuery, setFoodQuery] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const totalCalories = todaysLogs.reduce(
    (sum, food) => sum + food.calories,
    0,
  );
  const totalProtein = todaysLogs.reduce((sum, food) => sum + food.protein, 0);
  const totalFats = todaysLogs.reduce((sum, food) => sum + food.fats, 0);
  const notifications = [];

  if (totalCalories < nutrition.calories - 200) {
    notifications.push("🔥 You are under your calorie goal");
  }

  if (totalProtein < nutrition.protein * 0.7) {
    notifications.push("🍗 Protein intake is low today");
  }

  if (foodLogs.length === 0) {
    notifications.push("⏰ No food logged today");
  }
  useEffect(() => {
    const close = () => setNotifOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const handleRemoveFood = (id) => {
    setFoodLogs((prev) => prev.filter((food) => food.id !== id));
  };
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setStream(mediaStream);
      setCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch {
      alert("Camera permission denied");
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCameraOpen(false);
  };

  const [scanOpen, setScanOpen] = useState(false);
  const [scanFood, setScanFood] = useState({
    name: "",
    calories: "",
    protein: "",
    fats: "",
    unit: "bowl",
  });
  const selectedFoodData = scanFood.name
    ? FOOD_DB.find((f) => f.name === scanFood.name)
    : null;

  const selectedCalories = selectedFoodData
    ? Math.round(selectedFoodData.calories * servings)
    : 0;

  const filteredFoods = FOOD_DB.filter((food) => {
    const query = foodQuery.toLowerCase();
    const nameMatch = food.name.toLowerCase().includes(query);
    const aliasMatch =
      food.aliases?.some((a) => a.toLowerCase().includes(query)) || false;
    return nameMatch || aliasMatch;
  });
  const visibleFoods = filteredFoods.slice(0, 12);

  //Meal Generation
  const handleGenerateMeal = async () => {
    try {
      setGenerating(true);
      setGeneratedMeal(null);

      const remainingCals = nutrition.calories - totalCalories;

      if (remainingCals <= 0) {
        setGeneratedMeal({
          name: "Calorie Limit Reached",
          cals: 0,
          desc: "You’ve already met your calorie goal.",
        });
        return;
      }

      const result = await generateDinnerIdeaAI({
        remainingCalories: remainingCals,
        dietType,
        condition,
        goal: profile.goal,
      });

      setGeneratedMeal(result);
    } catch (err) {
      console.error(err);
      alert("AI dinner generation failed");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("nutriscan_logs", JSON.stringify(foodLogs));
  }, [foodLogs]);

  const handleExport = async () => {
    try {
      setExporting(true);
      await new Promise((r) => setTimeout(r, 800));
      const blob = await exportMedicalReportPDF(profile, nutrition);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "NutriScan_Medical_Report.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Could not generate report. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const handleScanFood = () => {
    setScanOpen(true);
  };

  const handleAddFood = () => {
    if (!scanFood.name) {
      alert("Please select or detect a food");
      return;
    }

    const resolved = resolveFood(
      scanFood.name,
      scanFood.unit || "bowl",
      servings,
    );

    if (!resolved) {
      alert("Food not recognized");
      return;
    }

    setFoodLogs((prev) => [
      ...prev,
      {
        ...resolved,
        id: Date.now(),
        image: resolved.image || null,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: today,
        type: "Scan",
      },
    ]);

    setScanFood({
      name: "",
      calories: "",
      protein: "",
      fats: "",
      unit: "bowl",
    });

    setServings(1);
    setImageFile(null);
    setImagePreview(null);
    setScanOpen(false);
    setIsScanResolved(false);
  };

  const handleDetectFood = async () => {
    if (!imagePreview) return;
    const img = new Image();
    img.src = imagePreview;
    img.onload = async () => {
      try {
        setDetecting(true);
        const foods = await detectFoodFromImage(img);
        if (!foods.length) {
          alert("Could not identify food. Please select manually.");
          return;
        }
        const preferred =
          foods.find((f) => ["banana", "apple", "orange"].includes(f)) ||
          foods[0];
        setFoodQuery(preferred);
      } catch (err) {
        console.error(err);
        alert("Vision scan failed");
      } finally {
        setDetecting(false);
      }
    };
  };

  useEffect(() => {
    if (scanOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [scanOpen]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans">
      {/* SIDEBAR */}
      <aside className="w-20 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-6 gap-8 fixed h-full z-20 shadow-sm">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10">
          <img src="/logo-icon.png" alt="NutriScan" className="w-6 h-6" />
        </div>

        <div className="flex flex-col gap-6 flex-1 w-full items-center">
          <NavIcon
            icon={<Activity />}
            active={currentView === "dashboard"}
            onClick={() => setView("dashboard")}
          />
          <NavIcon icon={<Scan />} onClick={handleScanFood} />
          <NavIcon icon={<ChefHat />} onClick={() => setView("recipes")} />
          <NavIcon
            icon={<Calendar />}
            active={currentView === "meal-planner"}
            onClick={() => setView("meal-planner")}
          />

          <NavIcon icon={<FileText />} onClick={handleExport} />
        </div>
        <div className="mb-4">
          <NavIcon icon={<LogOut />} onClick={onLogout} />
        </div>
      </aside>
      {/* CONTENT AREA */}
      <div className="pl-20 flex-1 flex flex-col min-h-screen w-full overflow-x-hidden">
        {/* HEADER - UPDATED TO FIXED */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 md:px-8 fixed top-0 right-0 left-20 z-30">
          <div className="flex items-center gap-3">
            <img src="/logo-icon.png" alt="NutriScan AI" className="w-9 h-9" />

            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
              NutriScan AI
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <div
              onClick={(e) => {
                e.stopPropagation();
                setNotifOpen(!notifOpen);
              }}
              className="relative cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            >
              <Bell className="w-5 h-5 text-slate-400" />

              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] bg-rose-500 text-white px-1.5 rounded-full">
                  {notifications.length}
                </span>
              )}
            </div>

            {notifOpen && (
              <div className="absolute right-6 top-16 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50">
                <div className="p-4 border-b font-bold text-sm">
                  Notifications
                </div>

                {notifications.length === 0 ? (
                  <div className="p-4 text-sm text-slate-500">
                    No new notifications 🎉
                  </div>
                ) : (
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map((text, i) => (
                      <div
                        key={i}
                        className="px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        {text}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 cursor-pointer">
              {profile?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
          </div>
        </header>

        {/* MAIN GRID - ADDED TOP MARGIN (mt-16) */}
        <main className="p-4 md:p-8 flex-1 w-full max-w-full xl:max-w-[1600px] mx-auto mt-16">
          {/* ROUTED VIEWS */}
          {currentView === "recipes" && (
            <RecipesPage profile={profile} onAddToLog={onAddRecipe} />
          )}

          {currentView === "meal-planner" && (
            <MealPlannerPage profile={profile} onAddToLog={onAddRecipe} />
          )}

          {currentView === "dashboard" && (
            <div className="grid grid-cols-12 gap-6">
              {/* ROW 1: PROFILE & FORECAST */}
              <div className="col-span-12 md:col-span-4 lg:col-span-3">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 h-full flex flex-col items-center text-center shadow-sm relative overflow-hidden">
                  <div className="w-24 h-24 rounded-full bg-slate-50 dark:bg-slate-950 mb-3 border-4 border-white shadow-sm flex items-center justify-center text-2xl font-bold text-emerald-600 relative z-10">
                    {profile?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {profile?.name || "User"}
                    {profile?.sex && (
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">
                        ({profile.sex})
                      </span>
                    )}
                  </h2>

                  <p className="text-emerald-600 text-sm font-medium mb-4"></p>
                  <div className="w-full grid grid-cols-2 gap-2 mb-6">
                    <StatBox label="Age" value={profile?.age || "-"} />
                    <StatBox
                      label="Weight"
                      value={profile?.weight ? `${profile.weight} kg` : "-"}
                    />
                    <StatBox
                      label="Height"
                      value={profile?.height ? `${profile.height} cm` : "-"}
                    />

                    <StatBox
                      label="BMI"
                      value={bmi ? `${bmi} (${bmiLabel})` : "-"}
                    />
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <Badge
                      icon={<Award />}
                      color="text-amber-500 bg-amber-50"
                      label="Streak: 7"
                    />
                    <Badge
                      icon={<ShieldAlert />}
                      color="text-emerald-500 bg-emerald-50"
                      label="Sugar Free"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-8 lg:col-span-9">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 h-full relative overflow-hidden shadow-sm flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-600" />
                        Predictive Forecast
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {predictionText}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 w-full min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={graphData}>
                        <defs>
                          <linearGradient
                            id="colorWeight"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#10b981"
                              stopOpacity={0.35}
                            />
                            <stop
                              offset="95%"
                              stopColor="#10b981"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#1e293b"
                          vertical={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#020617",
                            border: "1px solid #1e293b",
                            borderRadius: "12px",
                            color: "#e5e7eb",
                          }}
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#94a3b8", fontSize: 12 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="weight"
                          stroke="#10b981"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorWeight)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* ROW 2: RECENT SCANS & INTAKE */}
              {/* ROW 2: RECENT SCANS & INTAKE */}
              <div className="col-span-12 md:col-span-8">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-h-[320px] shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Scan className="w-5 h-5 text-blue-500" /> Today's Scans
                    </h3>
                    <div className="flex gap-3">
                      {/* NEW HISTORY BUTTON */}
                      <button
                        onClick={() => setHistoryOpen(true)}
                        className="text-xs text-slate-500 hover:text-emerald-600 font-bold flex items-center gap-1"
                      >
                        <Calendar className="w-3 h-3" /> History
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto pr-2 scrollbar-thin...">
                    {todaysLogs.length === 0 && (
                      <p className="text-sm text-slate-400">
                        No food logged today.
                      </p>
                    )}
                    {/* CHANGE foodLogs.map TO todaysLogs.map */}
                    {todaysLogs.map((food) => (
                      <LogItem
                        key={food.id}
                        title={food.name}
                        time={food.time}
                        cals={food.calories}
                        type={food.type}
                        image={food.image}
                        onClick={() => setSelectedFood(food)}
                        onRemove={() => handleRemoveFood(food.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 h-full shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">
                      Today's Intake
                    </h3>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                      {nutrition.calories} kcal
                    </span>
                  </div>
                  <div className="space-y-6">
                    <NutrientRow
                      icon={<Flame className="w-4 h-4 text-amber-500" />}
                      label="Calories"
                      value={`${totalCalories}g`}
                      max={`${nutrition.calories}g`}
                      percent={Math.min(
                        100,
                        Math.round((totalCalories / nutrition.calories) * 100),
                      )}
                      color="bg-amber-500"
                    />
                    <NutrientRow
                      icon={<Drumstick className="w-4 h-4 text-sky-500" />}
                      label="Protein"
                      value={`${totalProtein}g`}
                      max={`${nutrition.protein}g`}
                      percent={Math.min(
                        100,
                        Math.round((totalProtein / nutrition.protein) * 100),
                      )}
                      color="bg-sky-500"
                    />
                    <NutrientRow
                      icon={<Droplets className="w-4 h-4 text-yellow-500" />}
                      label="Fats"
                      value={`${totalFats}g`}
                      max={`${nutrition.fats}g`}
                      percent={Math.min(
                        100,
                        Math.round((totalFats / nutrition.fats) * 100),
                      )}
                      color="bg-yellow-500"
                    />
                  </div>
                </div>
              </div>

              {/* ROW 3: SMART ACTIONS */}
              <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AI Meal Planner */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">
                    AI Meal Planner
                  </h3>
                  {/* DIET TYPE */}
                  <div className="flex gap-2 mb-4">
                    {[
                      { key: "veg", label: "🥦 Veg" },
                      { key: "non-veg", label: "🍗 Non-Veg" },
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setDietType(item.key)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                          dietType === item.key
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  {/* MEDICAL CONDITION */}
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full mb-4 px-4 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  >
                    <option value="none">No medical condition</option>
                    <option value="diabetes">Diabetes</option>
                    <option value="hypertension">High Blood Pressure</option>
                    <option value="cholesterol">High Cholesterol</option>
                  </select>
                  {/* GENERATED MEAL */}
                  {generatedMeal && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-xl mb-4">
                      <div className="flex justify-between font-semibold text-sm">
                        <span>{generatedMeal.name}</span>
                        <span className="text-emerald-600">
                          {generatedMeal.cals} kcal
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                        {generatedMeal.desc}
                      </p>
                      {generatedMeal.note && (
                        <p className="text-xs text-amber-600 mt-2">
                          ⚠️ {generatedMeal.note}
                        </p>
                      )}
                    </div>
                  )}
                  {/* ACTION BUTTON */}
                  <button
                    onClick={handleGenerateMeal}
                    disabled={generating || totalCalories >= nutrition.calories}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl text-sm font-bold transition shadow-md"
                  >
                    {generating ? "Thinking..." : "Generate Dinner Idea"}
                  </button>
                </div>

                {/* Medical Report */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Medical Report
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Export your 30-day nutritional & weight logs for your
                    doctor.
                  </p>
                  <button
                    onClick={handleExport}
                    disabled={exporting}
                    className={`px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition ${
                      exporting
                        ? "bg-emerald-400 text-white cursor-not-allowed"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white "
                    }`}
                  >
                    {exporting ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 text-slate-500 dark:text-slate-400"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          />
                        </svg>
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Export for Doctor
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* FOOTER */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 mt-auto">
          <div className="max-w-[1600px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center text-slate-500 dark:text-slate-400 text-sm">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span className="font-bold ">NutriScan AI</span> © 2025 Cortexx.
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-emerald-600">
                Privacy
              </a>
              <a href="#" className="hover:text-emerald-600">
                Terms
              </a>
              <a href="#" className="hover:text-emerald-600">
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>
      {/* REAL AI CHAT BUBBLE */}
      <AICoachBubble
        isOpen={chatOpen}
        setIsOpen={setChatOpen}
        profile={profile}
      />
      <HistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        logs={foodLogs}
        onRemove={handleRemoveFood}
      />

      <AnimatePresence>
        {showModelWait && (
          <ModelLoadingNotice onClose={() => setShowModelWait(false)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {scanOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="
  bg-white dark:bg-slate-900 rounded-2xl
  w-full h-full sm:h-auto
  sm:max-w-lg md:max-w-2xl lg:max-w-6xl
  max-h-screen
  flex flex-col
"
            >
              <div className="p-4 sm:p-6 border-b sticky top-0 bg-white dark:bg-slate-900 z-10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Scan Food</h3>
                  <button
                    onClick={() => setScanOpen(false)}
                    className="text-slate-500 dark:text-slate-400 hover:text-slate-800 text-xl font-bold"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-4 lg:gap-6 flex-1 overflow-hidden">
                  {/* LEFT COLUMN */}
                  <div className="space-y-3 overflow-y-auto pr-2 flex-1">
                    <input
                      placeholder="Search food (e.g. rice, egg)"
                      value={foodQuery}
                      onChange={(e) => setFoodQuery(e.target.value)}
                      className=" w-full rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                    />
                    <button
                      onClick={startCamera}
                      className="w-full py-2.5 rounded-lg border border-slate-300
text-slate-700 dark:text-slate-200 text-sm font-medium
hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      📸 Use Live Camera
                    </button>

                    <div
                      onDragEnter={(e) => {
                        e.preventDefault();
                        setDragActive(true);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                        const file = e.dataTransfer.files[0];
                        if (!file || !file.type.startsWith("image/")) return;
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }}
                      className={`w-full min-h-[96px]
 border-2 border-dashed rounded-xl
    flex items-center justify-center text-center cursor-pointer transition
    ${
      dragActive
        ? "border-emerald-500 bg-emerald-50"
        : "border-slate-300 dark:border-slate-700"
    }
  `}
                    >
                      <label className="cursor-pointer w-full h-full flex items-center justify-center">
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setImageFile(file);
                            setImagePreview(URL.createObjectURL(file));
                          }}
                        />

                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-40 rounded-lg"
                          />
                        ) : (
                          <span className="text-xm text-slate-500">
                            Drag & drop or tap to upload 📷
                          </span>
                        )}
                      </label>
                    </div>

                    <button
                      onClick={handleDetectFood}
                      disabled={!imageFile || detecting}
                      className="w-full py-2.5 rounded-lg bg-blue-600/90 text-white text-sm font-semibold"
                    >
                      {detecting ? "Analyzing..." : "Analyze Image"}
                    </button>
                    {scanFood.name && (
                      <div
                        className="bg-slate-50 dark:bg-slate-950 border rounded-xl p-3 space-y-2
"
                      >
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {scanFood.name}
                        </div>
                        <div className="grid grid-cols-3 gap-1 text-xs">
                          <div>🔥 {scanFood.calories} kcal</div>
                          <div>🍗 {scanFood.protein} g</div>
                          <div>💧 {scanFood.fats} g</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Servings ({scanFood.unit})
                          </span>
                          <input
                            type="number"
                            min="0"
                            step={0.5}
                            value={servings}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                              const val = e.target.value;
                              setServings(val === "" ? "" : Number(val));
                            }}
                            onBlur={() => {
                              let val = Number(servings);
                              if (!val || val < 0.5) val = 1;
                              invalid;
                              setServings(Math.round(val * 2) / 2);
                            }}
                            className="w-24 border rounded-lg px-2 py-1 text-center"
                          />
                          {selectedFoodData && (
                            <div className="mt-2 text-xs text-slate-600 space-y-1">
                              <p>
                                1 serving = {selectedFoodData.unit} (~
                                {selectedFoodData.grams} g)
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={handleAddFood}
                            className="flex-1 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setScanOpen(false);
                              setFoodQuery("");
                              setImageFile(null);
                              setImagePreview(null);
                              setIsScanResolved(false);
                              setScanFood({
                                name: "",
                                calories: "",
                                protein: "",
                                fats: "",
                                unit: "bowl",
                              });
                              setServings(1);
                            }}
                            className="flex-1 py-2 rounded-lg border text-sm font-semibold hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-800"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                      AI will suggest foods. Please confirm manually.
                    </p>
                  </div>
                  {/* RIGHT COLUMN */}
                  <div className="max-h-[70vh] overflow-y-auto space-y-3 lg:border-l lg:pl-6">
                    {foodQuery && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        🤖 AI suggested: <b>{foodQuery}</b>
                      </p>
                    )}
                    {visibleFoods.map((food) => (
                      <button
                        key={food.name}
                        onClick={() => {
                          setScanFood({
                            name: food.name,
                            calories: food.calories,
                            protein: food.protein,
                            fats: food.fats,
                            unit: "bowl",
                          });
                          setIsScanResolved(true);
                          setServings(1);
                          setFoodQuery("");
                        }}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition
    ${
      scanFood.name === food.name
        ? "border-emerald-500 bg-emerald-500/10"
        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
    }
  `}
                      >
                        <div className="flex w-full items-center justify-between">
                          {/* LEFT */}
                          <div className="text-left">
                            <div className="font-semibold text-slate-900 dark:text-slate-100">
                              {food.name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {food.protein}g protein • {food.fats}g fat
                            </div>
                            <div className="text-[10px] uppercase text-slate-400 mt-1">
                              {food.category}
                            </div>
                          </div>

                          {/* RIGHT */}
                          <div className="flex items-center gap-2">
                            {scanFood.name === food.name && (
                              <span className="text-emerald-500 text-xs font-bold">
                                ✓ Selected
                              </span>
                            )}

                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                              ~{food.calories} kcal
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedFood && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Nutrition Details</h3>
                <button onClick={() => setSelectedFood(null)}>
                  <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
              {selectedFood.image && (
                <img
                  src={selectedFood.image}
                  alt={selectedFood.name}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                />
              )}
              <h4 className="text-lg font-bold mb-2">{selectedFood.name}</h4>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <StatBox
                  label="Calories"
                  value={`${selectedFood.calories} kcal`}
                />
                <StatBox label="Protein" value={`${selectedFood.protein} g`} />
                <StatBox label="Fats" value={`${selectedFood.fats} g`} />
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                <p>🍽️ Servings: {selectedFood.servings || 1}</p>
                <p>🕒 Logged at: {selectedFood.time}</p>
                <p>📸 Source: {selectedFood.type}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {cameraOpen && (
        <div className="fixed inset-0 bg-black z-[60] flex flex-col items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full max-w-md rounded-xl"
          />
          <canvas ref={canvasRef} hidden />

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => {
                const canvas = canvasRef.current;
                const video = videoRef.current;

                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext("2d").drawImage(video, 0, 0);

                const dataUrl = canvas.toDataURL("image/png");

                setImagePreview(dataUrl);
                fetch(dataUrl)
                  .then((r) => r.blob())
                  .then((blob) =>
                    setImageFile(
                      new File([blob], "camera.png", { type: "image/png" }),
                    ),
                  );

                stopCamera();
              }}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold"
            >
              Capture
            </button>

            <button
              onClick={stopCamera}
              className="px-6 py-3 bg-slate-600 text-white rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

const NutrientRow = ({ icon, label, value, max, color, percent }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
        {value} <span className="text-slate-400">/ {max}</span>
      </div>
    </div>
    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  </div>
);

const AICoachBubble = ({ isOpen, setIsOpen, profile }) => {
  function typeText(text, callback) {
    let index = 0;
    let current = "";

    const interval = setInterval(() => {
      current += text[index];
      index++;

      callback(current);

      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 20); // typing speed
  }

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: `Hi ${profile?.name || "there"}! ${
        profile?.condition
          ? `I see you mentioned ${profile.condition}.`
          : "I don’t see any medical conditions listed."
      } How can I help you today?`,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const aiResponseText = await getCoachResponse(messages, input);

    // placeholder message
    let tempMsg = { role: "ai", text: "" };
    setMessages((prev) => [...prev, tempMsg]);

    typeText(aiResponseText, (partial) => {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "ai", text: partial };
        return updated;
      });
    });

    setLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl mb-4 w-80 h-96 flex flex-col overflow-hidden"
          >
            <div className="bg-emerald-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <span className="font-bold">Cortexx Coach</span>
              </div>
              <button onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-950 overflow-y-auto">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-3 p-3 text-sm rounded-xl max-w-[85%] ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white ml-auto rounded-tr-none"
                      : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {loading && (
                <div className="text-xs text-slate-400 ml-2">
                  Cortexx is typing...
                </div>
              )}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-400 ml-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-150"></span>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-300"></span>
                  <span>AI is typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask anything..."
                className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-200 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

const Badge = ({ icon, color, label }) => (
  <div
    className={`p-2 rounded-full ${color} flex items-center justify-center group relative`}
  >
    {React.cloneElement(icon, { size: 16 })}
  </div>
);

const NavIcon = ({ icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`p-3 rounded-xl transition-all ${
      active
        ? "bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600"
        : "text-slate-400 hover:text-emerald-600"
    }`}
  >
    {React.cloneElement(icon, { size: 22 })}
  </button>
);

const StatBox = ({ label, value }) => (
  <div
    className="
    bg-slate-50 dark:bg-slate-950 
    rounded-xl p-2
    border border-slate-100 dark:border-slate-700
  "
  >
    <p className="text-[10px] uppercase font-bold text-slate-400">{label}</p>
    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
      {value}
    </p>
  </div>
);

const LogItem = ({ title, time, cals, type, image, onClick, onRemove }) => (
  <div
    onClick={onClick}
    className="flex items-center justify-between p-3 hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-800 rounded-2xl transition border border-transparent hover:border-slate-100 cursor-pointer"
  >
    <div className="flex items-center gap-3">
      {/* IMAGE / ICON */}
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <Scan className="w-5 h-5 text-slate-400" />
        )}
      </div>

      {/* TEXT */}
      <div>
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200">
          {title}
        </h4>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {time} • {type}
        </p>
      </div>
    </div>

    {/* CALORIES */}
    <div className="flex items-center gap-2">
      <span className="text-sm font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
        {cals} kcal
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="text-slate-400 hover:text-rose-500"
        title="Remove"
      >
        ✕
      </button>
    </div>
  </div>
);

const HistoryModal = ({ isOpen, onClose, logs, onRemove }) => {
  if (!isOpen) return null;

  const getLocalDateStr = (dateObj) => {
    const offset = dateObj.getTimezoneOffset() * 60000;
    return new Date(dateObj.getTime() - offset).toISOString().split("T")[0];
  };

  const getDateLabel = (dateStr) => {
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return "Unknown Date";

    const logDateLocal = getLocalDateStr(dateObj);
    const todayLocal = getLocalDateStr(new Date());

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayLocal = getLocalDateStr(yesterday);

    if (logDateLocal === todayLocal) return "Today";
    if (logDateLocal === yesterdayLocal) return "Yesterday";

    return dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const groupedLogs = logs.reduce((acc, log) => {
    let dateKey = log.date;

    if (!dateKey && log.id) {
      const recoveredDate = new Date(Number(log.id));
      if (!isNaN(recoveredDate.getTime())) {
        dateKey = getLocalDateStr(recoveredDate);
      }
    }

    if (!dateKey) dateKey = "Unknown Date";

    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(log);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedLogs).sort((a, b) => {
    if (a === "Unknown Date") return 1;
    if (b === "Unknown Date") return -1;
    return new Date(b) - new Date(a);
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 z-10">
          <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            Meal History
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-8 bg-slate-50 dark:bg-slate-950/50">
          {sortedDates.length === 0 ? (
            <div className="text-center py-12 opacity-50">
              <p className="text-4xl mb-2">📅</p>
              <p>No history found.</p>
            </div>
          ) : (
            sortedDates.map((date) => {
              const dayLogs = groupedLogs[date].sort((a, b) => b.id - a.id);
              const totalCals = dayLogs.reduce((acc, i) => acc + i.calories, 0);

              return (
                <div
                  key={date}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-500"
                >
                  <div className="flex justify-between items-end mb-3 px-1">
                    <h4 className="font-extrabold text-lg text-slate-700 dark:text-slate-200 uppercase tracking-tight">
                      {getDateLabel(date)}
                    </h4>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-md">
                      Total: {totalCals} kcal
                    </span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                    {dayLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                            {log.image ? (
                              <img
                                src={log.image}
                                alt={log.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-lg">
                                {log.type === "Scan" ? "📸" : "🍲"}
                              </span>
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              {log.name}
                            </p>
                            <p className="text-xs text-slate-500 font-medium">
                              {log.time} • {log.type}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {log.calories} kcal
                          </span>

                          <button
                            onClick={() => {
                              if (window.confirm("Remove this item?")) {
                                onRemove(log.id);
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState("landing");
  const [profile, setProfile] = useState({});
  const [foodLogs, setFoodLogs] = useState(() => {
    const saved = localStorage.getItem("nutriscan_logs");
    return saved ? JSON.parse(saved) : [];
  });
  const handleLogout = () => {
    localStorage.removeItem("nutriscan_profile");
    localStorage.removeItem("nutriscan_logs");
    localStorage.removeItem("nutriscan_meal_plan");

    setProfile({});
    setFoodLogs([]);

    setView("landing");
  };

  useEffect(() => {
    localStorage.setItem("nutriscan_logs", JSON.stringify(foodLogs));
  }, [foodLogs]);

  useEffect(() => {
    loadVisionModel();
  }, []);

  useEffect(() => {
    const savedProfile = localStorage.getItem("nutriscan_profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
      setView("dashboard");
    }
  }, []);
  // inside App() component

  const handleAddRecipeToLog = (recipe) => {
    const today = new Date().toISOString().split("T")[0];

    setFoodLogs((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: recipe.title,
        calories: recipe.calories,
        protein: recipe.protein,
        fats: recipe.fats,
        servings: 1,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: today,
        type: "AI Recipe",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AnimatePresence mode="wait">
        {view === "landing" && (
          <motion.div key="landing">
            <LandingPage onGetStarted={() => setView("setup")} />
          </motion.div>
        )}

        {view === "setup" && (
          <motion.div key="setup">
            <ProfileSetup
              onComplete={(data) => {
                setProfile(data);
                localStorage.setItem("nutriscan_profile", JSON.stringify(data));
                setView("dashboard");
              }}
            />
          </motion.div>
        )}

        {(view === "dashboard" ||
          view === "recipes" ||
          view === "meal-planner") && (
          <motion.div key="dashboard">
            <Dashboard
              profile={profile}
              foodLogs={foodLogs}
              setFoodLogs={setFoodLogs}
              theme={theme}
              toggleTheme={toggleTheme}
              currentView={view}
              setView={setView}
              onAddRecipe={handleAddRecipeToLog}
              onLogout={handleLogout}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
