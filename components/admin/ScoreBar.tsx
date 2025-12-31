export default function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 90
      ? "bg-green-500"
      : score >= 50
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-600">Performance Score</span>
        <span className="text-sm font-semibold">{score}</span>
      </div>

      <div className="h-2 bg-gray-200 rounded">
        <div
          className={`h-2 rounded ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
