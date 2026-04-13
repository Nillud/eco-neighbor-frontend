'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SERVER_URL } from '@/config/api.config'
import { IAd } from '@/services/ad/ad.types'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { adTypeLabels } from './[slug]/ad.data'

export function AdCard({ ad }: { ad: IAd }) {
  const { label, color } = adTypeLabels[ad.type]

  const imageUrl = ad.imageUrl
    ? ad.imageUrl.startsWith('http')
      ? ad.imageUrl
      : `${SERVER_URL}${ad.imageUrl}`
    : null

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl">
      <Link href={`/ads/${ad.slug}`}>
        <div className="relative aspect-9/3 overflow-hidden bg-slate-100">
          {ad.imageUrl ? (
            <Image
              src={imageUrl || ''}
              alt={ad.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Нет фото
            </div>
          )}
          <div className="absolute top-3 left-3">
            <div
              className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${color}`}
            >
              {label}
            </div>
          </div>
        </div>

        <div className="p-5">
          <h3 className="group-hover:text-primary-brand mb-2 text-lg leading-5 font-bold text-slate-900 transition-colors">
            {ad.title}
          </h3>

          <p className="line-clamp-3 text-sm text-slate-600">
            {ad.description}
          </p>
        </div>
      </Link>

      <div className="flex items-center justify-between border-t px-5 py-4">
        <div className="mb-2 flex items-center gap-2 md:mb-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={ad.author.avatarUrl} />
            <AvatarFallback className="bg-slate-100 text-[10px]">
              {ad.author.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900">
              {ad.author.name}
            </span>
            <span className="text-[10px] text-slate-400">
              {formatDistanceToNow(new Date(ad.createdAt), {
                addSuffix: true,
                locale: ru
              })}
            </span>
          </div>
        </div>

        {ad.phone && (
          <Link
            href={`tel:${ad.phone}`}
            className="text-primary-brand hover:bg-primary-brand flex items-center gap-2 rounded-full bg-slate-50 p-2 transition-colors hover:text-white"
          >
            <span className="hidden text-sm lg:flex">{ad.phone}</span>
            <Phone size={16} />
          </Link>
        )}
      </div>
    </div>
  )
}
