import { adService } from '@/services/ad/ad.service'
import { TPageSlugProp } from '@/types/page.types'
import { notFound } from 'next/navigation'

import { AdForm } from '../../AdForm'

export default async function EditAdPage({ params }: TPageSlugProp) {
  const { slug } = await params
  let ad

  try {
    ad = await adService.getBySlug(slug)
  } catch {
    notFound()
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <AdForm
        initialData={ad}
        variant="edit"
      />
    </div>
  )
}
