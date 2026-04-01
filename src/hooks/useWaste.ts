import { wasteService } from '@/services/waste/waste.service'
import { useQuery } from '@tanstack/react-query'

export const useWaste = () => {
  return useQuery({
    queryKey: ['waste'],
    queryFn: async () => await wasteService.getAll()
  })
}
