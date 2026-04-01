import { authService } from '@/services/auth/auth.service'
import { ILoginDto, IRegisterDto, IUser } from '@/services/auth/auth.types'
import { userService } from '@/services/user/user.service'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface UserState {
  user: IUser | null
  isAuth: boolean
  isLoading: boolean

  // Экшены
  checkAuth: () => Promise<void>;
  setUser: (user: IUser | null) => void
  login: (data: ILoginDto) => Promise<void>
  register: (data: IRegisterDto) => Promise<void>
  logout: () => Promise<void>
}

export const useUser = create<UserState>()(
  persist(
    set => ({
      user: null,
      isAuth: false,
      isLoading: false,

      checkAuth: async () => {
        try {
          const user = await userService.getProfile();
          set({ user, isAuth: true, isLoading: false });
        } catch {
          set({ user: null, isAuth: false, isLoading: false });
        }
      },

      setUser: user => set({ user, isAuth: !!user }),

      login: async data => {
        set({ isLoading: true })
        try {
          const user = await authService.login(data)
          set({ user, isAuth: true })
        } finally {
          set({ isLoading: false })
        }
      },

      register: async data => {
        set({ isLoading: true })
        try {
          const user = await authService.register(data)
          set({ user, isAuth: true })
        } finally {
          set({ isLoading: false })
        }
      },

      logout: async () => {
        await authService.logout()
        set({ user: null, isAuth: false })
      }
    }),
    {
      name: 'user-storage', // Ключ в localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ user: state.user, isAuth: state.isAuth }) // Сохраняем только это
    }
  )
)
