export type MetricType = "lcp" | "cls" | "inp";

export type MetricStatus = {
  label: "Good" | "Needs Improvement" | "Poor";
  color: string;
};

export function getMetricStatus(
  type: MetricType,
  value: number
): MetricStatus {
  if (type === "lcp") {
    if (value <= 2.5) return { label: "Good", color: "text-green-600" };
    if (value <= 4) return { label: "Needs Improvement", color: "text-yellow-600" };
    return { label: "Poor", color: "text-red-600" };
  }

  if (type === "cls") {
    if (value <= 0.1) return { label: "Good", color: "text-green-600" };
    if (value <= 0.25) return { label: "Needs Improvement", color: "text-yellow-600" };
    return { label: "Poor", color: "text-red-600" };
  }

  if (type === "inp") {
    if (value <= 200) return { label: "Good", color: "text-green-600" };
    if (value <= 500) return { label: "Needs Improvement", color: "text-yellow-600" };
    return { label: "Poor", color: "text-red-600" };
  }

  return { label: "Poor", color: "text-red-600" };
}
