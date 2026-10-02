import * as React from 'react'
import {
  LayoutDashboard,
  Megaphone,
  BookOpen,
  ClipboardList,
  ShieldCheck,
} from 'lucide-react'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
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

const navGroups = [
  {
    label: 'Overview',
    items: [
      {
        title: 'Dashboard',
        url: '/admin',
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    label: 'Konten',
    items: [
      {
        title: 'Pengumuman',
        url: '/admin/pengumuman',
        icon: Megaphone,
      },
      {
        title: 'Mata Kuliah',
        url: '/admin/mata-kuliah',
        icon: BookOpen,
      },
      {
        title: 'Tugas',
        url: '/admin/tugas',
        icon: ClipboardList,
      },
    ],
  },
]

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
        
        // Optionally fetch from profiles if exists
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2.5 px-2 py-1">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-bold tracking-tight text-foreground">
                  CLASS 1IA08
                </span>
                <span className="truncate text-[11px] text-muted-foreground uppercase font-medium">
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

      <SidebarFooter className="border-t border-sidebar-border">
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}