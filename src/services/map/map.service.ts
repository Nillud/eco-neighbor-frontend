// services/map/map.service.ts
import { $api } from '@/lib/api/axios'

import { ICreateMapPointDto, IMapPoint } from './map.types'

class MapService {
  private MAP = '/map-points'

  async getPoints(types: string[]) {
    const params = types.length ? { params: { types: types.join(',') } } : {}
    const response = await $api.get<IMapPoint[]>(this.MAP, params)
    return response.data
  }

  async getPendingPoints() {
    const response = await $api.get<IMapPoint[]>(`${this.MAP}/pending`)
    return response.data
  }

  async create(data: ICreateMapPointDto) {
    const response = await $api.post<IMapPoint>(this.MAP, data)
    return response.data
  }

  async verify(id: string) {
    const response = await $api.patch(`${this.MAP}/${id}/verify`)
    return response.data
  }

  async delete(id: string) {
    const response = await $api.delete(`${this.MAP}/${id}`)
    return response.data
  }

  async getById(id: string) {
    const response = await $api.get<IMapPoint>(`${this.MAP}/${id}`)
    return response.data
  }

  async update(id: string, data: ICreateMapPointDto) {
    const response = await $api.put<IMapPoint>(`${this.MAP}/${id}`, data)
    return response.data
  }
}

export const mapService = new MapService()
