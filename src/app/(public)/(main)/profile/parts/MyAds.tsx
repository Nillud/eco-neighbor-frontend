/* eslint-disable @typescript-eslint/no-explicit-any */
import { Heading } from '@/components/shared/heading/Heading'
import { Loader2 } from 'lucide-react'

import { AdCard } from '../../ads/AdCard'
import { EmptyState } from './EmptyState'

interface Props {
  ads: any[]
  isLoading: boolean
}

export function MyAds({ ads, isLoading }: Props) {
  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="text-primary-brand animate-spin" />
      </div>
    )

  return (
    <div className="space-y-4">
      <Heading
        title="Мои объявления"
        headingLevel={3}
      />

      {ads?.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {ads.map((ad: any) => (
            <AdCard
              key={ad.id}
              ad={ad}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          message="У вас пока нет активных объявлений"
          link="/ads/create"
          linkText="Подать объявление"
        />
      )}
    </div>
  )
}
