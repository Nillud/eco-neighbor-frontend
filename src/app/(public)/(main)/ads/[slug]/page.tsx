import { adService } from '@/services/ad/ad.service'
import { TPageSlugProp } from '@/types/page.types'
import { ChevronLeft } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { AdBody } from './AdBody'

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

  return (
    <section className="mx-auto max-w-6xl p-4 md:py-10">
      {/* Кнопка назад */}
      <Link
        href="/ads"
        className="hover:text-primary-brand mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors"
      >
        <ChevronLeft size={16} />
        Назад к объявлениям
      </Link>

      <AdBody ad={ad} />
    </section>
  )
}
