import { NavigationSection } from './NavigationSection'
import { PUBLIC_NAVIGATION, USER_NAVIGATION } from './navigation.data'

interface Props {
  isAuth: boolean
}

export function Navigation({ isAuth }: Props) {
  return (
    <nav className="flex items-center">
      <NavigationSection items={PUBLIC_NAVIGATION} />
      {isAuth && <NavigationSection items={USER_NAVIGATION} />}
    </nav>
  )
}
