import { Skeleton } from '@/components/ui/skeleton'

export function AnnouncementRowSkeleton() {
  return (
    <div className="py-6 sm:py-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[140px_1fr_auto] md:gap-8">
        {/* Date */}
        <Skeleton className="h-4 w-24" />
        
        {/* Title + excerpt */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4 sm:h-6" />
          <Skeleton className="h-3 w-full sm:h-4" />
          <Skeleton className="h-3 w-5/6 sm:h-4" />
        </div>
        
        {/* Arrow */}
        <Skeleton className="hidden h-5 w-5 md:block" />
      </div>
    </div>
  )
}

export function AnnouncementRowSkeletonList({ count = 3 }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border-t"
          style={{ borderColor: 'var(--public-border-subtle)' }}
        >
          <AnnouncementRowSkeleton />
        </div>
      ))}
    </div>
  )
}

export function AnnouncementPageSkeleton({ count = 5 }) {
  return (
    <div className="space-y-8">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="border-t pt-8"
          style={{ borderColor: 'var(--public-border-subtle)' }}
        >
          <Skeleton className="mb-3 h-4 w-28" />
          <Skeleton className="mb-3 h-6 w-3/4 sm:h-7" />
          <Skeleton className="mb-2 h-4 w-full sm:h-5" />
          <Skeleton className="h-4 w-5/6 sm:h-5" />
        </div>
      ))}
    </div>
  )
}
