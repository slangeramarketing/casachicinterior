type Props = {
  label: string;
  value: number;
  unit?: string;
  status: {
    label: string;
    color: string;
  };
};

export default function MetricRow({ label, value, unit, status }: Props) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>

      <div className="flex items-center gap-3">
        <span className="font-medium">
          {value}
          {unit}
        </span>

        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 ${status.color}`}
        >
          {status.label}
        </span>
      </div>
    </div>
  );
}
