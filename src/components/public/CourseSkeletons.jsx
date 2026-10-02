import { Skeleton } from '@/components/ui/skeleton'

export function CourseRowSkeleton() {
  return (
    <div className="py-5 sm:py-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-3/5 sm:h-6" />
        </div>
        <Skeleton className="h-4 w-20 self-start sm:self-auto" />
      </div>
    </div>
  )
}

export function CourseSkeletonList({ count = 6 }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border-t"
          style={{ borderColor: 'var(--public-border-subtle)' }}
        >
          <CourseRowSkeleton />
        </div>
      ))}
    </div>
  )
}

export function CoursePreviewSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-lg border"
          style={{
            borderColor: 'var(--public-border-subtle, var(--public-border))',
            backgroundColor: 'var(--public-surface)',
          }}
        >
          <Skeleton className="h-3 w-14 mb-2" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  )
}

