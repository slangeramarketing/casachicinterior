"use client";

import { useEffect, useState } from "react";
import { getMetricStatus } from "@/lib/analytics/getMetricStatus";
import ScoreBar from "@/components/admin/ScoreBar";
import MetricRow from "@/components/admin/MetricRow";

export default function PerformanceDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/analytics/performance")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="space-y-6 px-8">
      <h1 className="text-xl font-semibold">Performance Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {["mobile", "desktop"].map((key) => (
          <div key={key} className="border border-gray-300 rounded p-5 space-y-4">
            <h2 className="font-semibold capitalize">{key}</h2>

            <ScoreBar score={data[key].score} />

            <MetricRow
              label="LCP"
              value={data[key].lcp}
              unit="s"
              status={getMetricStatus("lcp", data[key].lcp)}
            />

            <MetricRow
              label="CLS"
              value={data[key].cls}
              status={getMetricStatus("cls", data[key].cls)}
            />

            <MetricRow
              label="INP"
              value={data[key].inp}
              unit="ms"
              status={getMetricStatus("inp", data[key].inp)}
            />

            <p className="text-xs text-gray-500">
              Performance Metrics Score
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
