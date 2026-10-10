import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedAdminRoute from "./ProtectedAdminRoute";

import Home from "../pages/public/Home";
import Announcements from "../pages/public/Announcements";
import Tasks from "../pages/public/Tasks";
import TaskDetail from "../pages/public/TaskDetail";
import Courses from "../pages/public/Courses";
import TestSupabase from "../pages/public/TestSupabase";

import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import AdminAnnouncements from "../pages/admin/Announcements";
import AdminCourses from "../pages/admin/Courses";
import AdminTasks from "../pages/admin/Tasks";
import Schedule from "@/pages/public/Schedule";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/pengumuman" element={<Announcements />} />
          <Route path="/tugas" element={<Tasks />} />
          <Route path="/tugas/:id" element={<TaskDetail />} />
          <Route path="/mata-kuliah" element={<Courses />} />
          <Route path="/test-supabase" element={<TestSupabase />} />
          <Route path="/jadwal" element={<Schedule />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="pengumuman" element={<AdminAnnouncements />} />
          <Route path="mata-kuliah" element={<AdminCourses />} />
          <Route path="tugas" element={<AdminTasks />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
