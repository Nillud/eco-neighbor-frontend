import { Metadata } from 'next'

import { PointForm } from '../PointForm'

export const metadata: Metadata = {
  title: 'Добавить точку'
}

export default function CreatePointPage() {
  return (
    <section className="container mx-auto max-w-4xl py-10">
      <PointForm />
    </section>
  )
}
