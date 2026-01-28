export default function ForbiddenPage() {
  return (
    <div className="min-h-100 flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-red-600">403</h1>
      <p className="text-gray-600 text-lg">
        You do not have permission to access this page.
      </p>
    </div>
  );
}
