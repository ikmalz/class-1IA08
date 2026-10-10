import { Outlet, useLocation, Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
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
  const reduced = useReducedMotion()
  const currentPath = location.pathname
  const currentPageTitle = pageTitles[currentPath] || 'Admin'
  const isRootDashboard = currentPath === '/admin'

  return (
    <SidebarProvider className="glass-ambient">
      <AppSidebar />
      <SidebarInset className="bg-transparent text-foreground">
        {/* Header kaca yang menempel di atas saat scroll */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border/60 bg-background/60 px-4 backdrop-blur-xl backdrop-saturate-150 sm:h-16 sm:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-5 sm:mr-3" />
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

        {/* pb-28 di mobile agar konten tidak tertutup tab bar */}
        <div className="flex-1 overflow-y-auto p-4 pb-28 sm:p-6 md:pb-8 lg:p-8">
          {/* Transisi halus tiap pindah halaman */}
          <motion.div
            key={currentPath}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AdminLayout