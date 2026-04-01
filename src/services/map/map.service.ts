import { $api } from '@/lib/api/axios'

import { IMapPoint } from './map.types'

class MapService {
  private MAP = '/map-points'

  async getPoints(types: string[]) {
    const params = types.length ? { params: { types: types.join(',') } } : {}
    const response = await $api.get<IMapPoint[]>(`${this.MAP}`, params)
    return response.data
  }
}

export const mapService = new MapService()
