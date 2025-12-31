type WebVitalMetric = {
  id: string;
  name: string;
  label: "web-vital" | "custom";
  value: number;
  delta: number;
};

export function reportWebVitals(metric: WebVitalMetric) {
  fetch("/api/analytics/web-vitals", {
    method: "POST",
    body: JSON.stringify(metric),
    headers: {
      "Content-Type": "application/json",
    },
  });
}