/**
 * SectionHeading
 * Reusable editorial header for public homepage sections.
 * Ensures consistent typography, accent color, and rhythm.
 */
export function SectionHeading({ number, title, description, className = '' }) {
  return (
    <div className={`mb-12 sm:mb-16 ${className}`}>
      {number && (
        <p
          className="text-xs font-semibold uppercase tracking-[0.25em]"
          style={{ color: 'var(--public-accent)' }}
        >
          {number}
        </p>
      )}
      <h2
        className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
        style={{ color: 'var(--public-text-primary)' }}
      >
        {title}
      </h2>
      {description && (
        <p
          className="mt-2 text-sm sm:text-base leading-relaxed"
          style={{ color: 'var(--public-text-secondary)' }}
        >
          {description}
        </p>
      )}
    </div>
  )
}
