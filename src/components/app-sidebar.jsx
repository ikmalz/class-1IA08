import * as React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { MobileTabBar } from '@/components/mobile-tab-bar'
import { navGroups } from '@/components/nav-config'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { supabase } from '@/lib/supabaseClient'

export function AppSidebar(props) {
  const [user, setUser] = React.useState({
    name: 'Admin',
    email: 'Class 1IA08',
  })

  React.useEffect(() => {
    async function loadProfile() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        let fullName = authUser.user_metadata?.full_name || authUser.user_metadata?.name || ''
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, role')
            .eq('id', authUser.id)
            .maybeSingle()
          if (profile?.full_name) {
            fullName = profile.full_name
          }
        } catch {
          // ignore profile fetch failure
        }

        setUser({
          name: fullName || 'Admin 1IA08',
          email: authUser.email || 'admin@class1ia08.ac.id',
        })
      }
    }

    loadProfile()
  }, [])

  return (
    <>
      <Sidebar
        variant="floating"
        collapsible="icon"
        className="glass-sidebar"
        {...props}
      >
        <SidebarHeader className="px-3 py-3.5">
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex items-center gap-2.5 px-2 py-1">
                <motion.div
                  whileHover={{ rotate: -8, scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-md shadow-primary/25"
                >
                  <ShieldCheck className="h-4 w-4" />
                </motion.div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-bold tracking-tight text-foreground">
                    CLASS 1IA08
                  </span>
                  <span className="truncate text-[11px] font-medium uppercase text-muted-foreground">
                    Admin Panel
                  </span>
                </div>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <NavMain groups={navGroups} />
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <MobileTabBar />
    </>
  )
}