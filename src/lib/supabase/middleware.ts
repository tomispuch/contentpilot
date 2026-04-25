import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')
  const isOnboarding = pathname.startsWith('/onboarding')
  const isApiRoute = pathname.startsWith('/api')
  const isLanding = pathname === '/'

  if (isApiRoute) return supabaseResponse

  // Landing page: si el usuario está logueado, lo mandamos al dashboard
  if (isLanding && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Landing page sin usuario: mostrar normalmente
  if (isLanding) return supabaseResponse

  if (!user && !isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  if (user && !isOnboarding && !isAuthRoute) {
    const { data: negocio } = await supabase
      .from('negocios')
      .select('onboarding_completado')
      .eq('user_id', user.id)
      .single()

    if (negocio && !negocio.onboarding_completado && !isOnboarding) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
