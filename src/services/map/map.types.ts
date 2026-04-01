export interface IWasteMapPoint {
  waste: {
    name: string
    slug: string
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
