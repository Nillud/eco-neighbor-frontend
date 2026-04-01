import { PAGES } from '@/config/pages.config'

import { INavigationItem } from './navigation.types'

export const PUBLIC_NAVIGATION: INavigationItem[] = [
  {
    title: 'Карта',
    link: PAGES.PUBLIC.HOME
  },
  {
    title: 'Объявления',
    link: PAGES.PUBLIC.ADS
  },
  {
    title: 'Мероприятия',
    link: PAGES.PUBLIC.EVENTS
  }
]

export const USER_NAVIGATION: INavigationItem[] = [
  {
    title: 'Рейтинг активистов',
    link: PAGES.USER.LEADERBOARD
  }
]
