import { Timestamp, FieldValue } from '@skeet-framework/firestore'

// CollectionId: User
// DocumentId: auto
// Path: User
export const UserCN = 'users'
export const genUserPath = () => `${UserCN}`
export type User = {
  id?: string
  uid: string
  username: string
  email: string
  iconUrl: string
  publicKey?: string
  secretKey?: Uint8Array
  userChatRoomIds?: string[]
  createdAt?: Timestamp | FieldValue
  updatedAt?: Timestamp | FieldValue
}

// CollectionId: UserChatRoom
// DocumentId: auto
// Path: users/{uid}/UserChatRoom
export const UserChatRoomCN = 'UserChatRoom'
export const genUserChatRoomPath = (uid: string) =>
  `${UserCN}/${uid}/${UserChatRoomCN}`
export type UserChatRoom = {
  id?: string
  title: string
  model: string
  maxTokens: number
  temperature: number
  context: string
  stream: boolean
  createdAt?: Timestamp | FieldValue
  updatedAt?: Timestamp | FieldValue
}

// CollectionId: UserChatRoomMessage
// DocumentId: auto
// Path: users/{uid}/UserChatRoom/{userChatRoomId}/UserChatRoomMessage
export const UserChatRoomMessageCN = 'UserChatRoomMessage'
export const genUserChatRoomMessagePath = (
  uid: string,
  userChatRoomId: string
) =>
  `${UserCN}/${uid}/${UserChatRoomCN}/${userChatRoomId}/${UserChatRoomMessageCN}`
export type UserChatRoomMessage = {
  id?: string
  userChatRoomId: string
  role: string
  content: string
  createdAt?: Timestamp | FieldValue
  updatedAt?: Timestamp | FieldValue
}
