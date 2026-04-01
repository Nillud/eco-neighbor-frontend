import { PAGES } from '@/config/pages.config'
import { $api } from '@/lib/api/axios'

import { IAuthResponse, ILoginDto, IRegisterDto } from './auth.types'

class AuthService {
  private AUTH = '/auth'

  async login(data: ILoginDto) {
    // Бэкенд установит accessToken и refreshToken в HttpOnly куки
    const response = await $api.post<IAuthResponse>(`${this.AUTH}/login`, data)
    return response.data.user
  }

  async register(data: IRegisterDto) {
    const response = await $api.post<IAuthResponse>(
      `${this.AUTH}/register`,
      data
    )
    return response.data.user
  }

  async logout() {
    const response = await $api.post<boolean>(`${this.AUTH}/logout`)
    if (response.data) {
      // После логаута на бэкенде (очистка кук), редиректим на логин
      if (typeof window !== 'undefined') {
        window.location.href = PAGES.PUBLIC.LOGIN
      }
    }
    return response.data
  }

  // Метод для получения нового accessToken (вызывается в interceptors)
  async getNewTokens() {
    const response = await $api.post<IAuthResponse>(`${this.AUTH}/new-tokens`)
    return response.data.user
  }
}

export const authService = new AuthService()
