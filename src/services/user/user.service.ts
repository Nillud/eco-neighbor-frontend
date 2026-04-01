import { $api } from '@/lib/api/axios'

import { IUser } from '../auth/auth.types'

class UserService {
  private USERS = '/users'

  async getProfile() {
    const response = await $api.get<IUser>(`${this.USERS}/profile`)
    return response.data
  }

  async collectWaste(amount: number, values: Record<string, number>) {
    const response = await $api.post<IUser>(`${this.USERS}/collect-waste`, {
      amount,
      values
    })
    return response.data
  }
}

export const userService = new UserService()
