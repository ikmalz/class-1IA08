import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

function ProtectedAdminRoute({ children }) {
  const location = useLocation()

  useEffect(() => {
    // Check if user is signed in
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        // Redirect to login if not authenticated
        window.location.href = '/admin/login'
      } else if (
        window.location.pathname === '/admin/login' &&
        user
      ) {
        // Redirect to dashboard if already authenticated and trying to access login
        window.location.href = '/admin'
      }
    })
  }, [location])

  // Show children only if authenticated (we'll handle redirect in useEffect)
  return children
}

export default ProtectedAdminRoute