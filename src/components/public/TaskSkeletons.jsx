import { Skeleton } from '@/components/ui/skeleton'

export function TaskRowSkeleton() {
  return (
    <div className="py-6 sm:py-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[140px_1fr_auto] md:gap-8 md:items-center">
        {/* Date */}
        <Skeleton className="h-4 w-24" />

        {/* Course name + excerpt */}
        <div className="space-y-2.5">
          <Skeleton className="h-5 w-1/2 sm:h-6" />
          <Skeleton className="h-4 w-full sm:w-3/4" />
          <Skeleton className="h-3 w-28" />
        </div>

        {/* Action arrow */}
        <Skeleton className="hidden h-10 w-10 rounded-md md:block" />
      </div>
    </div>
  )
}

export function TaskRowSkeletonList({ count = 3 }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border-t"
          style={{ borderColor: 'var(--public-border-subtle)' }}
        >
          <TaskRowSkeleton />
        </div>
      ))}
    </div>
  )
}

export function TaskDetailSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-4 w-32" />
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/3 sm:h-10" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="space-y-3 pt-6 border-t" style={{ borderColor: 'var(--public-border-subtle)' }}>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="pt-6 border-t" style={{ borderColor: 'var(--public-border-subtle)' }}>
        <Skeleton className="h-4 w-28 mb-3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
