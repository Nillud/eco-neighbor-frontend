import { IUser } from '../auth/auth.types'

export interface ILeaderboardUser extends Pick<
  IUser,
  'id' | 'name' | 'avatarUrl' | 'rating'
> {
  rank: number
  _count: {
    achievements: number
  }
}

export interface ILeaderboardResponse {
  topUsers: ILeaderboardUser[]
  currentUser: ILeaderboardUser | null
}

export interface IUserAchievement {
  id: string
  slug: string
  title: string
  description: string
  iconUrl: string | null
  category: string
  unit: 'THING' | 'KG'
  requirementCount: number
  points: number
  currentValue: number
  isUnlocked: boolean
  earnedAt: string | null
  progressPercentage: number
}

export interface IFullProfile {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  rating: number
  role: 'USER' | 'ADMIN'
  createdAt: string
  ecoScore: number
  achievements: IUserAchievement[]
  level: {
    current: string
    color: string
    nextLevelName: string
    pointsToNext: number
    progressPercentage: number
  }
}

export interface IAdminStats {
  users: {
    total: number
  }
  events: {
    total: number
    active: number
  }
  ads: {
    total: number
    active: number
  }
  map: {
    totalPoints: number
    needsVerification: number
  }
  ecoImpact: {
    totalPointsAwarded: number
  }
}
