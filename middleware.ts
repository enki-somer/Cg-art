import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Create supabase middleware client
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Check if session exists
  const { data: { session } } = await supabase.auth.getSession()
  
  // If no session, redirect to login
  if (!session) {
    const redirectUrl = new URL('/login', req.nextUrl.origin)
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Check if user is admin for admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    try {
      // Fetch role from database
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', session.user.id)
        .single()
      
      // If not admin, redirect to unauthorized page
      if (error || data?.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.nextUrl.origin))
      }
    } catch (error) {
      // If there's any error, redirect to unauthorized for safety
      return NextResponse.redirect(new URL('/unauthorized', req.nextUrl.origin))
    }
  }

  return res
}

// Only run middleware on specific paths
export const config = {
  matcher: ['/admin/:path*']
} 