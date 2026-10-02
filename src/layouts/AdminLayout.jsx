import { Outlet, useLocation, Link } from 'react-router-dom'
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { AppSidebar } from '@/components/app-sidebar'

const pageTitles = {
  '/admin': 'Dashboard',
  '/admin/pengumuman': 'Pengumuman',
  '/admin/mata-kuliah': 'Mata Kuliah',
  '/admin/tugas': 'Tugas',
}

function AdminLayout() {
  const location = useLocation()
  const currentPath = location.pathname
  const currentPageTitle = pageTitles[currentPath] || 'Admin'
  const isRootDashboard = currentPath === '/admin'

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background text-foreground">
        <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4 sm:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 sm:mr-3 h-5" />
          <Breadcrumb>
            <BreadcrumbList>
              {isRootDashboard ? (
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-semibold text-foreground">
                    Dashboard
                  </BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink render={<Link to="/admin" />}>
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-semibold text-foreground">
                      {currentPageTitle}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AdminLayout
