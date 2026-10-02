import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import AdminLayout from '../layouts/AdminLayout'
import ProtectedAdminRoute from './ProtectedAdminRoute'

import Home from '../pages/public/Home'
import Announcements from '../pages/public/Announcements'
import TestSupabase from '../pages/public/TestSupabase'
import Login from '../pages/admin/Login'
import Dashboard from '../pages/admin/Dashboard'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/pengumuman" element={<Announcements />} />
          <Route path="/test-supabase" element={<TestSupabase />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes