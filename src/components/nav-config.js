import {
  LayoutDashboard,
  Megaphone,
  BookOpen,
  ClipboardList,
} from 'lucide-react'

export const navGroups = [
  {
    label: 'Overview',
    items: [
      { title: 'Dashboard', url: '/admin', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: 'Konten',
    items: [
      { title: 'Pengumuman', url: '/admin/pengumuman', icon: Megaphone },
      { title: 'Mata Kuliah', url: '/admin/mata-kuliah', icon: BookOpen },
      { title: 'Tugas', url: '/admin/tugas', icon: ClipboardList },
    ],
  },
]

export function isItemActive(item, pathname) {
  if (item.exact) return pathname === item.url
  return (
    pathname === item.url ||
    (item.url !== '/admin' && pathname.startsWith(item.url))
  )
}