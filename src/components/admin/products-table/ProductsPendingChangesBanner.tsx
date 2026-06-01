export function ProductsPendingChangesBanner({ pendingChangeCount }: { pendingChangeCount: number }) {
  return (
    <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700">
      {pendingChangeCount} cambio{pendingChangeCount !== 1 ? "s" : ""} pendiente
      {pendingChangeCount !== 1 ? "s" : ""}
    </div>
  );
}
