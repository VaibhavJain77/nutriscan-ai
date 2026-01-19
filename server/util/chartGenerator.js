import { ChartJSNodeCanvas } from "chartjs-node-canvas";

const width = 600;
const height = 300;
const canvas = new ChartJSNodeCanvas({ width, height });

export async function generateWeightChart(weight) {
  const data = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
    datasets: [
      {
        label: "Weight (kg)",
        data: [
          weight,
          weight - 0.2,
          weight - 0.4,
          weight - 0.5,
          weight - 0.7,
        ],
        borderColor: "#10b981",
        fill: false,
        tension: 0.4,
      },
    ],
  };

  return await canvas.renderToBuffer({
    type: "line",
    data,
  });
}

export async function generateCaloriesChart(consumed, target) {
  return await canvas.renderToBuffer({
    type: "bar",
    data: {
      labels: ["Consumed", "Target"],
      datasets: [
        {
          label: "Calories (kcal)",
          data: [consumed, target],
          backgroundColor: ["#60a5fa", "#34d399"],
        },
      ],
    },
  });
}
