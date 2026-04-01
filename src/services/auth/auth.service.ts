import { PAGES } from '@/config/pages.config'
import { $api } from '@/lib/api/axios'

import { ILoginDto, IRegisterDto, IUser } from './auth.types'

class AuthService {
  private AUTH = '/auth'

  async login(data: ILoginDto) {
    // Бэкенд установит accessToken и refreshToken в HttpOnly куки
    const response = await $api.post<IUser>(`${this.AUTH}/login`, data)
    return response.data
  }

  async register(data: IRegisterDto) {
    const response = await $api.post<IUser>(`${this.AUTH}/register`, data)
    return response.data
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
    const response = await $api.post<IUser>(`${this.AUTH}/new-tokens`)
    return response.data
  }
}

export const authService = new AuthService()
