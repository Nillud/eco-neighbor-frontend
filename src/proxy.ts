import { getTokens } from '@/lib/server/get-tokens.server'
import { jwtVerifyServer } from '@/lib/server/jwt-verify.server'
import { NextRequest, NextResponse } from 'next/server'

import { PAGES } from './config/pages.config'

const PUBLIC_PAGES = Object.values(PAGES.PUBLIC)

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.includes('.') || pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  const isAuthRoute = pathname.startsWith(PAGES.PUBLIC.AUTH)
  const tokens = await getTokens(req)

  if (isAuthRoute) {
    if (tokens)
      return NextResponse.redirect(new URL(PAGES.PUBLIC.HOME, req.url))
    return NextResponse.next()
  }

  const isPublicRoute = PUBLIC_PAGES.some(
    route => pathname === route || pathname.startsWith(route + '/')
  )

  if (isPublicRoute) return NextResponse.next()

  if (!tokens)
    return NextResponse.redirect(new URL(PAGES.PUBLIC.LOGIN, req.url))

  if ('isRefreshedToken' in tokens) {
    const response = NextResponse.next()
    if (tokens.setCookie) response.headers.set('set-cookie', tokens.setCookie)
    return response
  }

  const verifiedData = await jwtVerifyServer(tokens.accessToken)
  if (!verifiedData)
    return NextResponse.redirect(new URL(PAGES.PUBLIC.LOGIN, req.url))

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
