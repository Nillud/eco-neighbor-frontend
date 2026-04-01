import { mapService } from '@/services/map/map.service'
import { useQuery } from '@tanstack/react-query'

export const usePoints = (selectedTypes: string[]) => {
  return useQuery({
    queryKey: ['points', selectedTypes],
    queryFn: () => mapService.getPoints(selectedTypes)
  })
}
