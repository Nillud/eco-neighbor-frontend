import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/app.constants'
import { NextRequest } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200/api'

export async function getTokens(request: NextRequest) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN)?.value
  const accessToken = request.cookies.get(ACCESS_TOKEN)?.value

  // Если нет рефреш-токена — сессия полностью мертва
  if (!refreshToken) return null

  // Если нет аксесс-токена, пробуем рефрешнуть через API
  if (!accessToken) {
    try {
      const response = await fetch(`${API_URL}/auth/new-tokens`, {
        method: 'POST',
        headers: {
          Cookie: request.headers.get('cookie') ?? ''
        }
      })

      if (!response.ok) return null

      const setCookie = response.headers.get('set-cookie')

      return {
        isRefreshedToken: true,
        setCookie
      }
    } catch {
      return null
    }
  }

  return { accessToken, refreshToken }
}