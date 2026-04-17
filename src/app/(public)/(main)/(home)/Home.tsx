/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { ActionButton } from '@/components/custom-ui/ActionButton'
import { CollectWasteModal } from '@/components/shared/collect-waste/CollectWasteModal'
import { Heading } from '@/components/shared/heading/Heading'
import { YandexMap } from '@/components/shared/map/Map'
import { PAGES } from '@/config/pages.config'
import { usePoints } from '@/hooks/usePoints'
import { userService } from '@/services/user/user.service'
import { useUser } from '@/store/user.store'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { AddPointModal } from './AddPointModal'
import { Filters } from './Filters'

export function Home() {
  const { isAuth, checkAuth } = useUser()
  const router = useRouter()

  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const { data: points, isLoading } = usePoints(selectedFilters)

  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false)
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null)

  const [isAddPointModalOpen, setIsAddPointModalOpen] = useState(false)

  const toggleFilter = (slug: string) => {
    setSelectedFilters(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    )
  }

  const handleAddPointClick = () => {
    if (!isAuth) {
      router.push(PAGES.PUBLIC.LOGIN)
      return
    }
    router.push('/add-point') // Или твой путь
  }

  useEffect(() => {
    const handleOpenModal = (e: any) => {
      if (!isAuth) router.push(PAGES.PUBLIC.LOGIN)

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

  const handleFinalSuccess = async (
    totalPoints: number,
    values: Record<string, number>
  ) => {
    try {
      await userService.collectWaste(totalPoints, values)

      toast.success(`Поздравляем!`, {
        description: `Начислено ${totalPoints} эко-очков за ваш вклад.`
      })
      checkAuth()
    } catch {
      toast.error('Не удалось сохранить результат')
    }
  }

  return (
    <section className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h1 className="hidden">Эко-сосед</h1>
        <Heading
          title="Эко-карта"
          description="Находите точки сбора вторсырья и актуальные проблемы соседей"
        />
        <ActionButton onClick={handleAddPointClick}>
          + Добавить точку
        </ActionButton>
      </div>

      <div className="flex flex-col gap-4 lg:grid lg:h-175 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Filters
            selectedFilters={selectedFilters}
            toggleFilter={toggleFilter}
            points={points}
          />
        </div>

        <div className="relative h-100 md:h-125 lg:col-span-3 lg:h-full">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/50 backdrop-blur-sm">
              <span className="animate-pulse">Загрузка меток...</span>
            </div>
          )}
          <YandexMap
            points={points}
            className="h-full w-full"
          />
        </div>
      </div>

      <CollectWasteModal
        isOpen={isCollectModalOpen}
        onClose={() => setIsCollectModalOpen(false)}
        point={currentPoint}
        onSuccess={handleFinalSuccess}
      />

      <AddPointModal
        isOpen={isAddPointModalOpen}
        onClose={() => setIsAddPointModalOpen(false)}
      />
    </section>
  )
}
