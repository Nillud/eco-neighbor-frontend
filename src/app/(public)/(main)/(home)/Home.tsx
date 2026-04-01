/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { CollectWasteModal } from '@/components/shared/collect-waste/CollectWasteModal'
import { Heading } from '@/components/shared/heading/Heading'
import { YandexMap } from '@/components/shared/map/Map'
import { usePoints } from '@/hooks/usePoints'
import { userService } from '@/services/user/user.service'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Filters } from './Filters'

export function Home() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const { data: points, isLoading } = usePoints(selectedFilters)

  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false)
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null)

  const toggleFilter = (slug: string) => {
    setSelectedFilters(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    )
  }

  useEffect(() => {
    const handleOpenModal = (e: any) => {
      setSelectedPointId(e.detail.pointId)
      setIsCollectModalOpen(true)
    }

    window.addEventListener('open-waste-modal', handleOpenModal)
    return () => window.removeEventListener('open-waste-modal', handleOpenModal)
  }, [])

  const currentPoint = useMemo(
    () => points?.find(p => p.id === selectedPointId),
    [points, selectedPointId]
  )

  const handleFinalSuccess = async (totalPoints: number, values: Record<string, number>) => {
    try {
      await userService.collectWaste(totalPoints, values)
      
      toast.success(`Поздравляем!`, {
        description: `Начислено ${totalPoints} эко-очков за ваш вклад.`
      })
    } catch {
      toast.error('Не удалось сохранить результат')
    }
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <Heading
          title="Эко-карта"
          description="Находите точки сбора вторсырья и актуальные проблемы соседей"
        />

        <button className="bg-primary-brand hover:bg-primary-brand-hover rounded-full px-6 py-3 font-semibold text-white shadow-lg transition-all active:scale-95">
          + Сообщить о проблеме
        </button>
      </div>

      <div className="grid h-150 grid-cols-1 gap-6 md:h-175 lg:grid-cols-4">
        <Filters
          selectedFilters={selectedFilters}
          toggleFilter={toggleFilter}
          points={points}
        />

        <div className="relative lg:col-span-3">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
              <span>Загрузка меток...</span>
            </div>
          )}
          <YandexMap
            points={points}
            className="h-full w-full rounded-xl"
          />
        </div>
      </div>

      <CollectWasteModal
        isOpen={isCollectModalOpen}
        onClose={() => setIsCollectModalOpen(false)}
        point={currentPoint}
        onSuccess={handleFinalSuccess}
      />
    </section>
  )
}
