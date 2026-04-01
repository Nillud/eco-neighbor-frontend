import { PAGES } from '@/config/pages.config'
import Image from 'next/image'
import Link from 'next/link'

export function Logo() {
  return (
    <Link href={PAGES.PUBLIC.HOME} className='flex items-center gap-1'>
      <Image
        src={'/logo/logo.svg'}
        width={58}
        height={63}
        alt="Логотип"
        loading="eager"
        className="size-10 md:size-12"
      />
      <span className='font-bold text-primary-brand md:hidden'>Эко-сосед</span>
    </Link>
  )
}
