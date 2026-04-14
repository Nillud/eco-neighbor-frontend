/* eslint-disable @typescript-eslint/no-explicit-any */
import { $api } from '@/lib/api/axios'

import { IUser } from '../auth/auth.types'
import { IAdminStats, IFullProfile, ILeaderboardResponse } from './user.types'

class UserService {
  private USERS = '/users'

  async getProfile() {
    const response = await $api.get<IUser>(`${this.USERS}/profile`)
    return response.data
  }

  async getFullProfile(): Promise<IFullProfile> {
    const { data } = await $api.get<IFullProfile>(`${this.USERS}/full-profile`)
    return data
  }

  async collectWaste(amount: number, values: Record<string, number>) {
    const response = await $api.post<IUser>(`${this.USERS}/collect-waste`, {
      amount,
      values
    })
    return response.data
  }

  async getLeaderboard() {
    const { data } = await $api.get<ILeaderboardResponse>(
      `${this.USERS}/leaderboard`
    )
    return data
  }

  async getAdminStats(): Promise<IAdminStats> {
    const { data } = await $api.get<IAdminStats>(`${this.USERS}/admin-stats`)
    return data
  }

  async getActivity(): Promise<{
    participating: any[]
    created: any[]
    ads: any[]
  }> {
    const { data } = await $api.get<{
      participating: any[]
      created: any[]
      ads: any[]
    }>(`${this.USERS}/get-activity`)
    return data
  }

  async changePassword(data: any) {
    const response = await $api.patch<{ message: string }>(
      `${this.USERS}/profile/change-password`,
      data
    )
    return response.data
  }
}

export const userService = new UserService()
