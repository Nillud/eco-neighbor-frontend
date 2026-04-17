/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button'
import { mapService } from '@/services/map/map.service'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

// components/screens/profile/parts/AdminPointsModeration.tsx
export function AdminPointsModeration() {
  const { data: pendingPoints, refetch } = useQuery({
    queryKey: ['pending-points'],
    queryFn: () => mapService.getPendingPoints()
  })

  const { mutate: verify } = useMutation({
    mutationFn: (id: string) => mapService.verify(id),
    onSuccess: () => {
      toast.success('Точка подтверждена')
      refetch()
    }
  })

  const { mutate: remove } = useMutation({
    mutationFn: (id: string) => mapService.delete(id),
    onSuccess: () => {
      toast.info('Точка отклонена')
      refetch()
    }
  })

  if (!pendingPoints?.length) return <p>Нет точек на модерации</p>

  return (
    <div className="space-y-4">
      {pendingPoints.map((point: any) => (
        <div
          key={point.id}
          className="flex items-center justify-between rounded-xl border p-4"
        >
          <div>
            <h4 className="font-bold">{point.title}</h4>
            <p className="text-sm text-slate-500">{point.address}</p>
            <p className="text-xs">Автор: {point.author?.name}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => verify(point.id)}
              size="sm"
              className="bg-emerald-500"
            >
              Одобрить
            </Button>
            <Button
              onClick={() => remove(point.id)}
              size="sm"
              variant="destructive"
            >
              Отклонить
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
