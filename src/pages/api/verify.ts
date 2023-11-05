import * as admin from 'firebase-admin'
import { initializeApp } from 'firebase-admin/app'
import { getApp } from 'firebase/app'
import { getAuth } from 'firebase-admin/auth'
import {
  SolanaSignInInput,
  SolanaSignInOutput,
} from '@solana/wallet-standard-features'
import bs58 from 'bs58'
import { verifySignIn } from '@solana/wallet-standard-util'

import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirebaseAuth } from '@/lib/firebase'
import firebaseConfig from '@lib/firebaseConfig'

export interface SiwsRequest extends NextApiRequest {
  body: {
    input: SolanaSignInInput
    output: SolanaSignInOutput
  }
}
export default async function handler(req: SiwsRequest, res: NextApiResponse) {
  try {
    const app = initializeApp(firebaseConfig, firebaseConfig.authDomain)
    console.log(app.name)
    const backendInput: SolanaSignInInput = req.body.input
    const { output } = req.body

    const backendOutput: SolanaSignInOutput = {
      account: {
        ...output.account,
        publicKey: new Uint8Array(Object.values(output.account.publicKey)),
      },
      signature: new Uint8Array(Buffer.from(output.signature)),
      signedMessage: new Uint8Array(Buffer.from(output.signedMessage)),
    }

    if (!verifySignIn(backendInput, backendOutput)) {
      console.error('Sign In verification failed!')
      throw new Error('Sign In verification failed!')
    }

    // Issue a custom token with the authenticated publicKey as the uid.
    const token = await getAuth(app).createCustomToken(
      bs58.encode(backendOutput.account.publicKey)
    )

    res.json({
      status: 'success',
      token,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ status: 'error', message: String(error) })
  }
}
