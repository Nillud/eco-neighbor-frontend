import { $api } from '@/lib/api/axios'

import {
  EventCategory,
  EventStatus,
  ICreateEventDto,
  IEvent
} from './event.types'

class EventService {
  private BASE_URL = '/events'

  async getAll(filters?: { category?: EventCategory; status?: EventStatus }) {
    const { data } = await $api.get<IEvent[]>(this.BASE_URL, {
      params: filters
    })
    return data
  }

  async getBySlug(slug: string) {
    const { data } = await $api.get<IEvent>(`${this.BASE_URL}/by-slug/${slug}`)
    return data
  }

  async create(data: ICreateEventDto) {
    const { data: response } = await $api.post<IEvent>(this.BASE_URL, data)
    return response
  }

  async toggleRegistration(id: string) {
    const { data } = await $api.post<{ isJoined: boolean }>(
      `${this.BASE_URL}/${id}/toggle-registration`
    )
    return data
  }

  async finish(id: string) {
    const { data } = await $api.post(`${this.BASE_URL}/${id}/finish`)
    return data
  }

  async delete(id: string) {
    const { data } = await $api.delete(`${this.BASE_URL}/${id}`)
    return data
  }

  async update(id: string, data: Partial<ICreateEventDto>) {
    const { data: response } = await $api.put<IEvent>(
      `${this.BASE_URL}/${id}`,
      data
    )
    return response
  }

  async uploadImage(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await $api.post<{ url: string; name: string }>(
      '/media-upload?folder=events',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    )
    return data
  }
}

export const eventService = new EventService()
