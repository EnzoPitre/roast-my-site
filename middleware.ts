import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/') {
    const cookieLang = request.cookies.get('roast-lang')?.value
    const acceptLanguage = request.headers.get('accept-language') || ''
    const lang =
      cookieLang === 'en' || cookieLang === 'fr'
        ? cookieLang
        : acceptLanguage.toLowerCase().includes('fr')
        ? 'fr'
        : 'en'

    return NextResponse.redirect(new URL(`/${lang}`, request.url))
  }
}

export const config = {
  matcher: '/',
}
