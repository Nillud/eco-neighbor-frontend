'use client'

import { ActionButton } from '@/components/custom-ui/ActionButton'
import { Heading } from '@/components/shared/heading/Heading'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { adService } from '@/services/ad/ad.service'
import { AdType } from '@/services/ad/ad.types'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { AdCard } from './AdCard'

export function AdsPage() {
  const [activeType, setActiveType] = useState<AdType | undefined>()

  const { data: ads, isLoading } = useQuery({
    queryKey: ['ads', activeType],
    queryFn: () => adService.getAll(activeType)
  })

  const filters = [
    { id: undefined, label: 'Все' },
    { id: AdType.GIVEAWAY, label: 'Отдам даром' },
    { id: AdType.RECYCLE, label: 'Переработка' },
    { id: AdType.NEED_HELP, label: 'Помощь' }
  ]

  return (
    <section className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <Heading
          title="Объявления"
          description="Помогайте соседям и делитесь ресурсами"
          headingLevel={2}
        />

        <Link href="/ads/create">
          <ActionButton className="flex items-center gap-1">
            <Plus size={18} /> Создать
          </ActionButton>
        </Link>
      </div>

      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-2 md:hidden">
        {filters.map(filter => (
          <button
            key={filter.label}
            onClick={() => setActiveType(filter.id)}
            className={cn(
              'rounded-full border px-5 py-2 text-sm font-medium whitespace-nowrap transition-all',
              activeType === filter.id
                ? 'bg-primary-brand border-primary-brand text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-600'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-24 space-y-1">
            <h3 className="mb-4 px-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Категории
            </h3>
            {filters.map(filter => (
              <button
                key={filter.label}
                onClick={() => setActiveType(filter.id)}
                className={cn(
                  'w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-all',
                  activeType === filter.id
                    ? 'bg-primary-brand text-white shadow-md shadow-emerald-900/10'
                    : 'hover:text-primary-brand text-slate-600 hover:bg-slate-50'
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
                <div
                  key={i}
                  className="mb-4 h-64 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {ads?.map(ad => (
                <AdCard
                  key={ad.id}
                  ad={ad}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </section>
  )
}
