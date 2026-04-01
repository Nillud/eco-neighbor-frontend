class PublicPagesConfig {
  readonly HOME = '/'

  readonly ADS = '/ads'
  readonly EVENTS = '/events'

  readonly AUTH = '/auth'
  readonly LOGIN = `${this.AUTH}/login`
  readonly REGISTER = `${this.AUTH}/register`
  readonly FORGOT_PASSWORD = `${this.AUTH}/forgot-password`
}

class AdminPagesConfig {
  readonly WASTE = '/admin/waste'
  readonly ACHIEVEMENTS = '/admin/achievements'
}

class UserPagesConfig {
  readonly PROFILE = '/profile'
  readonly SETTINGS = '/profile/settings'
  readonly LEADERBOARD = '/leaderboard'
}

class DynamicPagesConfig extends PublicPagesConfig {
  AD(slug: string) {
    return `${this.ADS}/${slug}`
  }

  EVENT(slug: string) {
    return `${this.EVENTS}/${slug}`
  }
}

class PagesConfig {
  readonly PUBLIC = new PublicPagesConfig()
  readonly ADMIN = new AdminPagesConfig()
  readonly USER = new UserPagesConfig()
  readonly DYNAMIC = new DynamicPagesConfig()
}

export const PAGES = new PagesConfig()
