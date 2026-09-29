import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'

import Home from '../pages/Home'
import Tasks from '../pages/Tasks'
import TaskDetail from '../pages/TaskDetail'
import Announcements from '../pages/Announcements'
import TestSupabase from '../pages/public/TestSupabase'
import Login from '../../pages/admin/Login'
import Dashboard from '../../pages/admin/Dashboard'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tugas" element={<Tasks />} />
          <Route path="/tugas/:id" element={<TaskDetail />} />
          <Route path="/pengumuman" element={<Announcements />} />
        </Route>

        <Route
          path="/test-supabase"
          element={<TestSupabase />}
        />
      </Routes>

      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<Dashboard />} />
    </BrowserRouter>
  )
}

export default AppRoutes