import type { FC } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import type { Item } from "./types";

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Constants
const TARGET_MODELS = ["gpt-4", "gpt-3.5-turbo", "claude-3"] as const;
const METRIC_LABELS = [
  "Relevance Score",
  "Factual Accuracy",
  "Coherence Score",
  "Response Quality",
] as const;

const METRIC_KEYS = [
  "relevance_score",
  "factual_accuracy",
  "coherence_score",
  "response_quality",
] as const;

const MODEL_COLORS = {
  "gpt-4": {
    border: "rgb(34, 197, 94)",
    background: "rgba(34, 197, 94, 0.2)",
  },
  "gpt-3.5-turbo": {
    border: "rgb(59, 130, 246)",
    background: "rgba(59, 130, 246, 0.2)",
  },
  "claude-3": {
    border: "rgb(168, 85, 247)",
    background: "rgba(168, 85, 247, 0.2)",
  },
} as const;

// Types
type ChartProps = {
  items?: Item[];
};

interface ModelMetrics {
  relevance_score: number;
  factual_accuracy: number;
  coherence_score: number;
  response_quality: number;
}

interface ProcessedModelData {
  [model: string]: ModelMetrics;
}

interface NormalizationStats {
  min: number;
  max: number;
  range: number;
}

// Utility functions
const calculateNormalizationStats = (items: Item[]): NormalizationStats => {
  let min = Infinity;
  let max = -Infinity;

  items.forEach((item) => {
    if (item.evaluation_metrics) {
      Object.values(item.evaluation_metrics).forEach((score) => {
        if (typeof score === "number") {
          min = Math.min(min, score);
          max = Math.max(max, score);
        }
      });
    }
  });

  return {
    min: min === Infinity ? 0 : min,
    max: max === -Infinity ? 10 : max,
    range: (max === -Infinity ? 10 : max) - (min === Infinity ? 0 : min),
  };
};

const normalizeScore = (score: number, stats: NormalizationStats): number => {
  if (stats.range === 0) return 0.5; // Handle edge case where all scores are the same
  return Math.max(0, Math.min(1, (score - stats.min) / stats.range));
};

const processModelData = (items: Item[]): ProcessedModelData => {
  if (!items?.length) return {};

  // Group and process data efficiently
  const modelGroups = new Map<string, ModelMetrics[]>();

  // Single pass to group data
  for (const item of items) {
    if (item.evaluation_metrics && item.model) {
      if (!modelGroups.has(item.model)) {
        modelGroups.set(item.model, []);
      }
      modelGroups.get(item.model)!.push(item.evaluation_metrics);
    }
  }

  // Calculate averages efficiently
  const result: ProcessedModelData = {};

  for (const [model, metrics] of modelGroups) {
    const count = metrics.length;
    if (count === 0) continue;

    // Calculate sum in single pass
    const sums = metrics.reduce(
      (acc, metric) => ({
        relevance_score: acc.relevance_score + metric.relevance_score,
        factual_accuracy: acc.factual_accuracy + metric.factual_accuracy,
        coherence_score: acc.coherence_score + metric.coherence_score,
        response_quality: acc.response_quality + metric.response_quality,
      }),
      {
        relevance_score: 0,
        factual_accuracy: 0,
        coherence_score: 0,
        response_quality: 0,
      }
    );

    // Calculate averages
    result[model] = {
      relevance_score: sums.relevance_score / count,
      factual_accuracy: sums.factual_accuracy / count,
      coherence_score: sums.coherence_score / count,
      response_quality: sums.response_quality / count,
    };
  }

  return result;
};

const EmptyState: FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
    <p className="text-gray-500">{message}</p>
  </div>
);

const Chart: FC<ChartProps> = ({ items }) => {
  // Early validation
  if (!items?.length) {
    return <EmptyState message="No data available to display." />;
  }

  const modelData = processModelData(items);

  // Filter available models
  const availableModels = TARGET_MODELS.filter((model) => modelData[model]);

  if (availableModels.length === 0) {
    return (
      <EmptyState message="No evaluation data available for the specified models." />
    );
  }

  // Calculate normalization stats
  const normStats = calculateNormalizationStats(items);

  // Create chart data
  const chartData = {
    labels: [...METRIC_LABELS],
    datasets: availableModels.map((model) => {
      const metrics = modelData[model];
      const colors = MODEL_COLORS[model] || MODEL_COLORS["gpt-4"];

      return {
        label: model,
        data: METRIC_KEYS.map((key) => normalizeScore(metrics[key], normStats)),
        borderColor: colors.border,
        backgroundColor: colors.background,
        borderWidth: 2,
        pointBackgroundColor: colors.border,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: colors.border,
      };
    }),
  };

  // Chart options
  const options: ChartOptions<"radar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const model = context.dataset.label;
            const metricKey = METRIC_KEYS[context.dataIndex];
            const originalValue =
              model && modelData[model]
                ? modelData[model][metricKey]
                : undefined;

            if (originalValue === undefined) {
              return `${model}: ${(context.parsed.r * 10).toFixed(2)}`;
            }

            return `${model}: ${originalValue.toFixed(
              2
            )} (normalized: ${context.parsed.r.toFixed(2)})`;
          },
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 1,
        ticks: {
          stepSize: 0.2,
          callback: (value) => {
            const normalizedValue = Number(value);
            const originalValue =
              normStats.min + normalizedValue * normStats.range;
            return originalValue.toFixed(1);
          },
        },
        pointLabels: { font: { size: 12 } },
        grid: { color: "rgba(0, 0, 0, 0.1)" },
        angleLines: { color: "rgba(0, 0, 0, 0.1)" },
      },
    },
  };

  return (
    <div className="w-full h-96 p-4 bg-white rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Model Performance Comparison
      </h3>
      <div className="h-80">
        <Radar data={chartData} options={options} />
      </div>
      <div className="mt-4 text-sm text-gray-600 space-y-1">
        <p>
          Scores normalized from {normStats.min.toFixed(1)}-
          {normStats.max.toFixed(1)} to 0-1 scale
        </p>
        <p>
          Showing {items.length} items for: {availableModels.join(", ")}
        </p>
      </div>
    </div>
  );
};

export default Chart;
