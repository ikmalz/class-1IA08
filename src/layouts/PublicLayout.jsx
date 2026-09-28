import { Link, NavLink } from 'react-router-dom'
import { BookOpen, Menu, X } from 'lucide-react'
import { useState } from 'react'

function PublicLayout({ children }) {
  const [open, setOpen] = useState(false)

  const navItems = [
    {
      label: 'Beranda',
      to: '/',
    },
    {
      label: 'Tugas',
      to: '/tugas',
    },
    {
      label: 'Pengumuman',
      to: '/pengumuman',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">

          <Link
            to="/"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <BookOpen size={19} />
            </div>

            <div>
              <p className="text-sm font-bold leading-none text-slate-900">
                Class Hub
              </p>

              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Class Information
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile Button */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Toggle navigation"
          >
            {open ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {open && (
          <div className="border-t border-slate-100 px-6 py-3 md:hidden">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-4 py-3 text-sm font-medium ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      {children}

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6 text-center text-xs text-slate-400 lg:px-8">
          © 2026 Class Hub. Informasi kelas dalam satu tempat.
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout