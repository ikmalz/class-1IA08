import { Link, useLocation } from "react-router-dom"
import { motion, useReducedMotion } from "framer-motion"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { isItemActive } from "@/components/nav-config"

export function NavMain({ groups }) {
  const location = useLocation()
  const reduced = useReducedMotion()
  let order = 0

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.label} className="py-2">
          <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {group.label}
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {group.items.map((item) => {
              const active = isItemActive(item, location.pathname)
              const i = order++

              return (
                <SidebarMenuItem key={item.title}>
                  <motion.div
                    initial={reduced ? false : { opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                      delay: reduced ? 0 : 0.05 + i * 0.05,
                    }}
                    whileTap={reduced ? undefined : { scale: 0.97 }}
                  >
                    <SidebarMenuButton
                      render={<Link to={item.url} />}
                      isActive={active}
                      tooltip={item.title}
                      className="group/nav relative isolate gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-black/5 data-active:bg-transparent dark:hover:bg-white/10"
                    >
                      {/* Pill kaca yang "meluncur" antar menu */}
                      {active && (
                        <motion.span
                          layoutId="admin-nav-pill"
                          className="absolute inset-0 z-0 rounded-[inherit] bg-white/70 shadow-[0_2px_10px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] ring-1 ring-black/5 dark:bg-white/15 dark:shadow-none dark:ring-white/10"
                          transition={{ type: "spring", stiffness: 500, damping: 38 }}
                          aria-hidden="true"
                        />
                      )}
                      {item.icon && (
                        <item.icon className="relative z-10 h-4 w-4 shrink-0 transition-transform duration-200 group-hover/nav:scale-110" />
                      )}
                      <span className="relative z-10">{item.title}</span>
                    </SidebarMenuButton>
                  </motion.div>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}