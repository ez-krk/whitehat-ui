import firebaseConfig from '@lib/firebaseConfig'
import { getAnalytics } from 'firebase/analytics'
import { initializeApp, getApp, getApps } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  connectFirestoreEmulator,
  initializeFirestore,
} from 'firebase/firestore'

export const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp()

export const platformDevIP = '127.0.0.1'

export const getFirebaseAuth = () => {
  const firebaseAuth = getAuth(firebaseApp)
  // if (process.env.NODE_ENV !== 'production') {
  //   connectAuthEmulator(firebaseAuth, `http://${platformDevIP}:9099`, {
  //     disableWarnings: true,
  //   })
  // }
  return firebaseAuth
}

// export const auth = firebaseApp ? getFirebaseAuth() : undefined
export const auth = getFirebaseAuth()

const getFirebaseStorage = () => {
  const firebaseStorage = getStorage(firebaseApp)
  // if (process.env.NODE_ENV !== 'production') {
  //   connectStorageEmulator(firebaseStorage, platformDevIP, 9199)
  // }

  return firebaseStorage
}

// export const storage = firebaseApp ? getFirebaseStorage() : undefined
export const storage = getFirebaseStorage()

const getFirebaseFirestore = () => {
  const firestoreDb = initializeFirestore(firebaseApp, {
    experimentalForceLongPolling: true,
  })
  // if (process.env.NODE_ENV !== 'production') {
  //   connectFirestoreEmulator(firestoreDb, platformDevIP, 8080)
  // }
  return firestoreDb
}

// export const db = firebaseApp ? getFirebaseFirestore() : undefined
export const db = getFirebaseFirestore()

export const analytics =
  typeof window !== 'undefined' &&
  process.env.NODE_ENV === 'production' &&
  firebaseApp
    ? getAnalytics(firebaseApp)
    : undefined
