export interface IUser {
  id: string
  email: string
  name: string
  avatarUrl?: string
  role: 'USER' | 'ADMIN'
  rating: number
  ecoScore: number
}

export interface IAuthResponse {
  user: IUser
}

export type ILoginDto = Pick<IUser, 'email'> & { password: string }
export type IRegisterDto = Pick<IUser, 'email' | 'name'> & { password: string }
