import type { Metadata } from 'next'
import LeaderboardPage from './Leaderboard'

export const metadata: Metadata = {
  title: 'Таблица лидеров'
}

export default function Page() {
  return <LeaderboardPage />
}
