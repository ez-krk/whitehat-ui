import {
  SolanaSignInInput,
  SolanaSignInOutput,
} from '@solana/wallet-standard-features'
import type { NextApiRequest, NextApiResponse } from 'next'

export interface SiwsRequest extends NextApiRequest {
  body: {
    input: SolanaSignInInput
    output: SolanaSignInOutput
  }
}
export default async function handler(req: SiwsRequest, res: NextApiResponse) {
  try {
    const now: Date = new Date()
    const uri = req.headers.origin || ''
    const currentUrl = new URL(uri)
    const domain = currentUrl.host
    const currentDateTime = now.toISOString()

    const signInData: SolanaSignInInput = {
      domain,
      statement:
        'Clicking Sign or Approve only means you have proved this wallet is owned by you. This request will not trigger any blockchain transaction or cost any gas fee.',
      version: '1',
      nonce: 'oBbLoEldZs',
      chainId: 'solana:mainnet',
      issuedAt: currentDateTime,
      resources: ['https://skeet.dev', 'https://phantom.app/'],
    }

    res.json({
      signInData,
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: String(error) })
  }
}
