import { Link, useLocation } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import { Menu } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"
import { navGroups, isItemActive } from "@/components/nav-config"

const items = navGroups.flatMap((g) => g.items)

/**
 * Tab bar melayang bergaya iPhone (hanya tampil di mobile).
 * Item aktif ditandai pill kaca yang berpindah dengan animasi spring.
 */
export function MobileTabBar() {
  const { pathname } = useLocation()
  const { toggleSidebar } = useSidebar()
  const reduced = useReducedMotion()

  return (
    <nav
      aria-label="Navigasi utama"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
    >
      <motion.div
        initial={reduced ? false : { y: 90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 26, delay: 0.1 }}
        className="glass-tabbar pointer-events-auto mx-auto flex max-w-md items-stretch gap-1 rounded-[28px] p-1.5"
      >
        {items.map((item) => {
          const active = isItemActive(item, pathname)
          const Icon = item.icon
          return (
            <Link
              key={item.url}
              to={item.url}
              aria-current={active ? "page" : undefined}
              className="relative flex flex-1 flex-col items-center gap-0.5 rounded-[22px] py-2 text-[10px] font-medium outline-none"
            >
              {active && (
                <motion.span
                  layoutId="admin-tab-pill"
                  className="glass-tabbar-pill absolute inset-0 rounded-[22px]"
                  transition={{ type: "spring", stiffness: 500, damping: 36 }}
                  aria-hidden="true"
                />
              )}
              <motion.span
                className="relative z-10"
                animate={reduced ? undefined : { scale: active ? 1.12 : 1, y: active ? -1 : 0 }}
                whileTap={reduced ? undefined : { scale: 0.85 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
              >
                <Icon
                  className={`h-[22px] w-[22px] transition-colors duration-200 ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                  strokeWidth={active ? 2.4 : 2}
                />
              </motion.span>
              <span
                className={`relative z-10 transition-colors duration-200 ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.title}
              </span>
            </Link>
          )
        })}

        {/* Tombol Menu: membuka panel akun (profil + logout) */}
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Buka menu"
          className="relative flex flex-1 flex-col items-center gap-0.5 rounded-[22px] py-2 text-[10px] font-medium text-muted-foreground outline-none"
        >
          <motion.span
            whileTap={reduced ? undefined : { scale: 0.85 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
          >
            <Menu className="h-[22px] w-[22px]" />
          </motion.span>
          <span>Menu</span>
        </button>
      </motion.div>
    </nav>
  )
}