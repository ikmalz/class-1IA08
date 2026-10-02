import { useEffect, useState } from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { Skeleton } from '@/components/ui/skeleton'

function ProtectedAdminRoute({ children }) {
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    let ignore = false

    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!ignore) {
          setUser(session?.user ?? null)
          setLoading(false)
        }
      } catch (err) {
        console.error('Auth verification error:', err)
        if (!ignore) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!ignore) {
        setUser(session?.user ?? null)
      }
    })

    return () => {
      ignore = true
      subscription?.unsubscribe()
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-6 bg-background">
        <div className="flex flex-col items-center gap-3 max-w-xs w-full">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children || <Outlet />
}

export default ProtectedAdminRoute