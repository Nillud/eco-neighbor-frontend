import axios from 'axios'

import { IS_CLIENT } from '@/constants/app.constants'
import { API_URL } from '@/config/api.config'

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

        // Если даже рефреш не помог — перенаправляем на вход
        if (IS_CLIENT) window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
