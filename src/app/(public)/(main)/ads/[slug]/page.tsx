import { adService } from '@/services/ad/ad.service'
import { TPageSlugProp } from '@/types/page.types'
import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { AdContact } from './AdContact'
import { adTypeLabels } from './ad.data'

export async function generateMetadata({
  params
}: TPageSlugProp): Promise<Metadata> {
  const currParams = await params
  const ad = await adService.getBySlug(currParams.slug)

  if (!ad) return { title: 'Объявление не найдено' }

  return {
    title: `${ad.title} | Эко-Сосед`,
    description: ad.description.substring(0, 160), // Обрезаем для SEO
    openGraph: {
      title: ad.title,
      description: ad.description,
      images: ad.imageUrl ? [ad.imageUrl] : [],
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title: ad.title,
      description: ad.description
    }
  }
}

export default async function AdPage({ params }: TPageSlugProp) {
  const currParams = await params
  let ad
  try {
    ad = await adService.getBySlug(currParams.slug)
  } catch {
    notFound()
  }

  const { label, color } = adTypeLabels[ad.type]

  return (
    <main className="mx-auto max-w-5xl p-4 md:py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl border bg-slate-100">
          {ad.imageUrl ? (
            <Image
              src={ad.imageUrl}
              alt={ad.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">
              Нет фото
            </div>
          )}
          <div className="absolute top-4 left-4">
            <div
              className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${color}`}
            >
              {label}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <h2 className="text-3xl leading-tight font-extrabold text-slate-900">
            {ad.title}
          </h2>

          <div className="mt-4 flex items-center gap-3 text-sm text-slate-500">
            <span>
              Опубликовано: {new Date(ad.createdAt).toLocaleDateString()}
            </span>
            <span>•</span>
            <span
              className={
                ad.status === 'ACTIVE' ? 'text-emerald-500' : 'text-red-500'
              }
            >
              {ad.status === 'ACTIVE' ? 'Активно' : 'Закрыто'}
            </span>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-800">Описание</h2>
            <p className="mt-2 leading-relaxed whitespace-pre-line text-slate-600">
              {ad.description}
            </p>
          </div>

          <div className="mt-auto pt-10">
            {/* Карточка автора */}
            <div className="mb-6 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <Image
                src={ad.author.avatarUrl || '/default-avatar.png'}
                alt={ad.author.name}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <p className="font-bold text-slate-900">{ad.author.name}</p>
                <p className="text-sm text-slate-500">
                  Рейтинг: {ad.author.rating}
                </p>
              </div>
            </div>

            {/* Твой компонент отправки сообщения */}
            <AdContact
              adId={ad.id}
              authorId={ad.author.id}
              authorName={ad.author.name}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
