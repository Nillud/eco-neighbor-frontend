import { NavigationItem } from './NavigationItem'
import { INavigationItem } from './navigation.types'

interface Props {
  items: INavigationItem[]
}

export function NavigationSection({ items }: Props) {
  return (
    <ul className='flex items-center'>
      {items.map(item => (
        <NavigationItem
          key={item.link}
          item={item}
        />
      ))}
    </ul>
  )
}
