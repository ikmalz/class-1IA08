import { BrowserRouter, Routes, Route } from 'react-router-dom'

import PublicLayout from '../layouts/PublicLayout'

import Tasks from '../pages/Tasks'
import TaskDetail from '../pages/TaskDetail'
import Announcements from '../pages/Announcements'
import Home from '../pages/Home'
import TestSupabase from '../pages/public/TestSupabase'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />

        <Route
          path="/tugas"
          element={
            <PublicLayout>
              <Tasks />
            </PublicLayout>
          }
        />

        <Route
          path="/tugas/:id"
          element={
            <PublicLayout>
              <TaskDetail />
            </PublicLayout>
          }
        />

        <Route
          path="/pengumuman"
          element={
            <PublicLayout>
              <Announcements />
            </PublicLayout>
          }
        />

        <Route
  path="/test-supabase"
  element={<TestSupabase />}
/>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes