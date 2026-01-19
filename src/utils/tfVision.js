import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

let model = null;

// Load model once
export async function loadVisionModel() {
  if (!model) {
    model = await mobilenet.load();
    console.log("Vision model loaded");
  }
}

// Detect food from image
export async function detectFoodFromImage(img) {
  if (!model) {
    await loadVisionModel();
  }

  // 👇 USE img (function parameter), NOT imgEl
  const predictions = await model.classify(img);

  console.log(" Predictions:", predictions);

  return predictions.map((p) =>
    p.className.split(",")[0].toLowerCase()
  );
}
