'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adService } from '@/services/ad/ad.service'
import { AdType } from '@/services/ad/ad.types'
import { AdCard } from './AdCard'
import { Heading } from '@/components/shared/heading/Heading'
import { cn } from '@/lib/utils'
import { CreateAdModal } from './CreateAdModa'

export function AdsPage() {
  const [activeType, setActiveType] = useState<AdType | undefined>()

  const { data: ads, isLoading, refetch } = useQuery({
    queryKey: ['ads', activeType],
    queryFn: () => adService.getAll(activeType)
  })

  const filters = [
    { id: undefined, label: 'Все' },
    { id: AdType.GIVEAWAY, label: 'Отдам даром' },
    { id: AdType.RECYCLE, label: 'Переработка' },
    { id: AdType.NEED_HELP, label: 'Помощь' },
  ]

  return (
    <div className="container mx-auto py-6 px-4 md:py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <Heading 
          title="Объявления" 
          description="Помогайте соседям и делитесь ресурсами" 
        />
        <CreateAdModal onRefresh={refetch} />
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 no-scrollbar md:hidden">
        {filters.map((filter) => (
          <button
            key={filter.label}
            onClick={() => setActiveType(filter.id)}
            className={cn(
              "whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-all border",
              activeType === filter.id
                ? "bg-primary-brand border-primary-brand text-white shadow-sm"
                : "bg-white text-slate-600 border-slate-200"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-24 space-y-1">
            <h3 className="mb-4 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Категории
            </h3>
            {filters.map((filter) => (
              <button
                key={filter.label}
                onClick={() => setActiveType(filter.id)}
                className={cn(
                  "w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-all",
                  activeType === filter.id
                    ? "bg-primary-brand text-white shadow-md shadow-emerald-900/10"
                    : "text-slate-600 hover:bg-slate-50 hover:text-primary-brand"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Контент */}
        <main className="flex-1">
          {isLoading ? (
             <div className="columns-1 gap-4 lg:columns-2">
               {[...Array(6)].map((_, i) => (
                 <div key={i} className="mb-4 h-64 animate-pulse rounded-2xl bg-slate-100" />
               ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {ads?.map(ad => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}