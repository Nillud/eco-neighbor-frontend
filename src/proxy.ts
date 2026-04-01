import { getTokens } from '@/lib/server/get-tokens.server'
import { jwtVerifyServer } from '@/lib/server/jwt-verify.server'
import { NextRequest, NextResponse } from 'next/server'

import { PAGES } from './config/pages.config'

const PUBLIC_PAGES = Object.values(PAGES.PUBLIC)

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const tokens = await getTokens(req)

  // 1. Игнорируем статику
  if (pathname.includes('.') || pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  // Определяем статусы маршрутов
  const isAuthRoute = pathname.startsWith(PAGES.PUBLIC.AUTH)

  // Публичные страницы (кроме страниц логина/регистрации)
  const isGeneralPublicRoute = PUBLIC_PAGES.filter(
    route => !route.startsWith(PAGES.PUBLIC.AUTH)
  ).some(route => pathname === route || pathname.startsWith(route + '/'))

  // 2. Если это обычная публичная страница (Главная, Карта для просмотра и т.д.)
  // Пропускаем всех без исключения
  if (isGeneralPublicRoute) {
    return NextResponse.next()
  }

  // 3. Если пользователь пытается зайти на страницы AUTH (/auth/login, /auth/register)
  if (isAuthRoute) {
    // Если он УЖЕ авторизован — редиректим на главную
    if (tokens) {
      return NextResponse.redirect(new URL(PAGES.PUBLIC.HOME, req.url))
    }
    // Если не авторизован — пускаем логиниться
    return NextResponse.next()
  }

  // 4. Если мы дошли сюда, значит маршрут ПРИВАТНЫЙ (Профиль, Настройки, Админка)
  // Если токенов нет — отправляем на логин
  if (!tokens) {
    return NextResponse.redirect(new URL(PAGES.PUBLIC.LOGIN, req.url))
  }

  // 5. Логика обновления токенов (Refresh)
  if ('isRefreshedToken' in tokens) {
    const response = NextResponse.next()
    if (tokens.setCookie) response.headers.set('set-cookie', tokens.setCookie)
    return response
  }

  // 6. Финальная проверка валидности Access Token
  const verifiedData = await jwtVerifyServer(tokens.accessToken)
  if (!verifiedData) {
    // Если токен протух и не обновился — на логин
    const response = NextResponse.redirect(new URL(PAGES.PUBLIC.LOGIN, req.url))
    response.cookies.delete('accessToken')
    response.cookies.delete('refreshToken')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
