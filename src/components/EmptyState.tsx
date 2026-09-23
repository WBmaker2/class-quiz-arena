export default function EmptyState({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="text-center py-10">
      <p className="mb-4">{title}</p>
      {actionLabel && onAction && (
        <button type="button" className="btn-primary px-6" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
