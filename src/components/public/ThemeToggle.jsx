import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--public-border)] bg-[var(--public-surface)] text-[var(--public-text-secondary)] transition-colors duration-200 hover:bg-[var(--public-surface-hover)] hover:text-[var(--public-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--public-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--public-bg-primary)]"
      aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      title={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  )
}
