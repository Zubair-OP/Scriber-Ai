export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-surface-variant/40 ${className}`} />;
}

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-1.5 bg-white/50 rounded-[1.5rem] border border-surface-variant/40">
          <div className="bg-white rounded-[1.25rem] border border-surface-variant/20 overflow-hidden">
            <Skeleton className="h-56 rounded-none" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3.5 w-1/3" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-9 flex-1 rounded-full" />
                <Skeleton className="h-9 w-11 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function BuilderSkeleton() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-10 pt-28">
      <div className="mb-8 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_480px] gap-6">
        <div className="bg-white rounded-[1.5rem] border border-surface-variant/60 p-6 sm:p-10 space-y-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="hidden lg:block bg-white rounded-[1.5rem] border border-surface-variant/60 p-4">
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    </div>
  );
}
