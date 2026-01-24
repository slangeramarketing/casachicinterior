type MediaCardProps = {
  children: React.ReactNode;
  aspect?: string; // "9/16", "16/9"
  className?: string;
};

export function MediaCard({
  children,
  aspect = "9/16",
  className,
}: MediaCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gray-100 shadow-lg ${className}`}
      style={{ aspectRatio: aspect }}
    >
      {children}
    </div>
  );
}
