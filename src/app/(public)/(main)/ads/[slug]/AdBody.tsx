'use client'

import { SERVER_URL } from '@/config/api.config'
import { IAd } from '@/services/ad/ad.types'
import { useUser } from '@/store/user.store'
import { Calendar, Info, Phone, ShieldCheck, Star, Tag } from 'lucide-react'
import Image from 'next/image'

import { AdContact } from './AdContact'
import { adTypeLabels } from './ad.data'
import { AdActions } from './AdActions'

interface Props {
  ad: IAd
}

export function AdBody({ ad }: Props) {
  const { user } = useUser()

  const { label, color } = adTypeLabels[ad.type]

  const imageUrl = ad.imageUrl
    ? ad.imageUrl.startsWith('http')
      ? ad.imageUrl
      : `${SERVER_URL}${ad.imageUrl}`
    : null

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm">
          {ad.imageUrl ? (
            <Image
              src={imageUrl || ''}
              alt={ad.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-slate-400">
              <Image
                src="/no-photo.svg"
                alt="No photo"
                width={100}
                height={100}
                className="opacity-20"
              />
              <p className="mt-2">Фотография отсутствует</p>
            </div>
          )}

          <div className="absolute top-4 left-4">
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold shadow-lg backdrop-blur-md ${color}`}
            >
              <Tag size={14} />
              {label}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <Info
              size={20}
              className="text-primary-brand"
            />
            Описание
          </h2>
          <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <p className="leading-relaxed whitespace-pre-line text-slate-600">
              {ad.description}
            </p>
          </div>
        </div>
      </div>

      {/* Правая колонка: Инфо и Контакты (5 из 12 колонок) */}
      <div className="lg:col-span-5">
        <div className="sticky top-24 space-y-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl lg:text-3xl">
              {ad.title}
            </h3>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <Calendar size={16} />
                {new Date(ad.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck
                  size={16}
                  className={
                    ad.status === 'ACTIVE' ? 'text-emerald-500' : 'text-red-500'
                  }
                />
                <span
                  className={
                    ad.status === 'ACTIVE'
                      ? 'font-medium text-emerald-500'
                      : 'text-red-500'
                  }
                >
                  {ad.status === 'ACTIVE' ? 'Активно' : 'Закрыто'}
                </span>
              </div>
            </div>

            {ad.phone && (
              <div className="mt-6 flex items-center gap-4 rounded-2xl bg-emerald-50 p-4 text-emerald-900">
                <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white lg:flex">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase opacity-70">
                    Контактный телефон
                  </p>
                  <p className="text-base font-bold md:text-lg">{ad.phone}</p>
                </div>
              </div>
            )}

            <div className="mt-8 border-t border-slate-100 pt-6">
              <p className="mb-4 text-sm font-semibold tracking-wider text-slate-400 uppercase">
                Автор объявления
              </p>
              <div className="flex items-center gap-4">
                <div className="relative mb-auto h-10 min-w-10 overflow-hidden rounded-full border-2 border-white shadow-md">
                  <Image
                    src={ad.author.avatarUrl || '/default-avatar.png'}
                    alt={ad.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-lg leading-5 font-bold text-slate-900">
                    {ad.author.name}
                  </p>
                  <div className="flex items-center gap-1 text-sm font-medium text-amber-500">
                    <Star
                      size={14}
                      fill="currentColor"
                    />
                    <span>Рейтинг: {ad.author.rating}</span>
                  </div>
                </div>
              </div>

              {user?.id === ad.author.id ? (
                <AdActions
                  adId={ad.id}
                  slug={ad.slug}
                  status={ad.status}
                />
              ) : (
                <AdContact
                  adId={ad.id}
                  authorId={ad.author.id}
                  authorName={ad.author.name}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
