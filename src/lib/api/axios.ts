import { API_URL } from '@/config/api.config'
import axios from 'axios'

import { IS_CLIENT } from '@/constants/app.constants'

export const $api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

let isRefreshing = false

$api.interceptors.response.use(
  config => config,
  async error => {
    const originalRequest = error.config

    // Если ошибка 401 и это не повторный запрос на обновление токенов
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      isRefreshing = true

      try {
        // Вызываем твой эндпоинт /auth/new-tokens
        // Бэкенд сам возьмет куку refreshToken и выставит новые через Set-Cookie
        await axios.post(
          `${API_URL}/auth/new-tokens`,
          {},
          {
            withCredentials: true
          }
        )

        isRefreshing = false
        return $api(originalRequest)
      } catch (refreshError) {
        isRefreshing = false

        if (originalRequest.url?.includes('/users/profile')) {
          return Promise.reject(refreshError)
        }

        // 2. Если мы и так на странице логина/регистрации — НЕ РЕДИРЕКТИМ (избегаем цикла).
        if (IS_CLIENT && window.location.pathname.startsWith('/auth')) {
          return Promise.reject(refreshError)
        }

        // 3. Во всех остальных случаях (когда юзер хотел сделать что-то приватное,
        // например, сдать мусор, но токен сдох) — отправляем на логин.
        if (IS_CLIENT) {
          window.location.href = '/auth/login'
        }

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
