"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, MegaphoneIcon, LogOutIcon, BookOpenIcon } from "lucide-react"

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white">
            <BookOpenIcon size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">Class 1IA08</p>
            <p className="text-xs text-slate-500">Admin Dashboard</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="space-y-2 px-2">
          <div className="flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <LayoutDashboardIcon className="h-4 w-4" />
            <span>Overview</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <MegaphoneIcon className="h-4 w-4" />
            <span>Pengumuman</span>
          </div>
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="mt-4 pt-4 border-t border-slate-200 px-2">
          <div className="flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <LogOutIcon className="h-4 w-4" />
            <span>Logout</span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}