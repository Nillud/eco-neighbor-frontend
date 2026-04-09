import { $api } from '@/lib/api/axios'

import { IAd, ICreateAdDto } from './ad.types'

class AdService {
  private BASE_URL = '/ads'

  async getAll(type?: string) {
    const { data } = await $api.get<IAd[]>(this.BASE_URL, {
      params: type ? { type } : {}
    })
    return data
  }

  async getBySlug(slug: string) {
    const { data } = await $api.get<IAd>(`/ads/by-slug/${slug}`)
    return data
  }

  async create(dto: ICreateAdDto) {
    const { data } = await $api.post<IAd>(this.BASE_URL, dto)
    return data
  }

  async uploadImage(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await $api.post<{ url: string; name: string }>(
      '/media-upload?folder=ads',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    )
    return data
  }
}

export const adService = new AdService()
