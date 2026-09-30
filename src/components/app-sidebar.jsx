import {
  GalleryVerticalEnd,
  LayoutDashboard,
  Users,
} from 'lucide-react'
import * as React from 'react'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { supabase } from '@/lib/supabaseClient'

const data = {
  user: {
    name: 'Admin',
    email: 'Class 1IA08',
    avatar: '',
  },

  teams: [
    {
      name: 'Class 1IA08',
      logo: GalleryVerticalEnd,
      plan: 'Admin',
    },
  ],

  navMain: [
    {
      title: 'Dashboard',
      url: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: 'Manajemen',
      url: '#',
      icon: Users,
      items: [
        {
          title: 'Pengumuman',
          url: '/admin/pengumuman',
        },
        {
          title: 'Anggota Kelas',
          url: '/admin/anggota',
        },
      ],
    },
  ],

  projects: [],
}

export function AppSidebar(props) {
  const [user, setUser] = React.useState({
    name: 'Admin',
    email: 'Class 1IA08',
    avatar: '',
  })

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (authUser) {
        setUser({
          name: authUser.user_metadata?.name || 'Admin',
          email: authUser.email || 'Class 1IA08',
          avatar: authUser.user_metadata?.avatar_url || '',
        })
      }
    })
  }, [])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}