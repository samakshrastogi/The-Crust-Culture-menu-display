export default function SkeletonLoader({ count = 6 }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface)]"
        >
          <div className="aspect-[4/3] animate-pulse bg-[var(--surface-strong)]" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--surface-strong)]" />
            <div className="h-3 w-full animate-pulse rounded bg-[var(--surface-strong)]" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-[var(--surface-strong)]" />
          </div>
        </div>
      ))}
    </div>
  )
}
