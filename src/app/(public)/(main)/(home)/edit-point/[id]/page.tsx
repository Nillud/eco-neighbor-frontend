import { mapService } from '@/services/map/map.service'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { PointForm } from '../../PointForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Редактировать точку'
}

export default function EditPointPage({ params }: { params: { id: string } }) {
  const { data, isLoading } = useQuery({
    queryKey: ['point', params.id],
    queryFn: () => mapService.getById(params.id) // Добавьте этот метод в mapService
  })

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    )

  return (
    <section className="container mx-auto max-w-4xl py-10">
      <PointForm initialData={data} />
    </section>
  )
}
