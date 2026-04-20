export interface IWasteMapPoint {
  waste: {
    wasteId: string
    name: string
    slug: string
    id: string
  }
}

export interface IMapPoint {
  id: string
  title: string
  address: string
  latitude: number
  longitude: number
  description?: string
  type: 'CONTAINER' | 'POINT'
  wasteMapPoints: IWasteMapPoint[]
}

export interface ICreateMapPointDto {
  title: string
  address: string
  latitude: number
  longitude: number
  description?: string
  isVerified?: boolean
  type?: 'CONTAINER' | 'POINT'

  wasteIds: string[]
}
