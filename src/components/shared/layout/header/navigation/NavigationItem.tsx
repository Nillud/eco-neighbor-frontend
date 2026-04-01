import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { INavigationItem } from './navigation.types'
import { cn } from '@/lib/utils'

interface Props {
  item: INavigationItem
}

export function NavigationItem({ item }: Props) {
  const pathname = usePathname()
  const isActive = pathname === item.link

  return (
    <li>
      <Link
        href={item.link}
        className={cn(
          'px-4 py-2 text-sm font-medium transition-colors lg:text-base',
          isActive ? 'text-primary-brand font-bold' : 'text-slate-600 hover:text-primary-brand-hover'
        )}
      >
        {item.title}
      </Link>
    </li>
  )
}
