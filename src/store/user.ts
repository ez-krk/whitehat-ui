import { atom } from 'recoil'

export type UserState = {
  uid: string
  email: string
  username: string
  iconUrl: string
  publicKey: string
  secretKey: string
  emailVerified: boolean
}

export const defaultUser = {
  uid: '',
  email: '',
  username: '',
  iconUrl: '',
  publicKey: '',
  secretKey: '',
  emailVerified: false,
}

export const userState = atom<UserState>({
  key: 'userState',
  default: defaultUser,
})
