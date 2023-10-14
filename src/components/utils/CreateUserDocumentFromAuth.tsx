import { db } from '@/lib/firebase'
import { Keypair } from '@solana/web3.js'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export const createUserDocumentFromAuth = async (userAuth: {
  uid?: any
  displayName?: any
  email?: any
}) => {
  const userDocRef = doc(db, 'users', userAuth.uid)

  const userSnapshot = await getDoc(userDocRef)

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth
    const createdAt = new Date()
    const { publicKey, secretKey } = Keypair.generate()

    try {
      await setDoc(userDocRef, {
        displayName,
        publicKey: publicKey.toString(),
        secretKey: secretKey.toString(),
        email,
        createdAt,
      })
    } catch (error) {
      console.log('error creating the user', error)
    }
  }

  return userDocRef
}
