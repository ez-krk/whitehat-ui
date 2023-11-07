import { Ed25519Ecies } from '@/lib/ed25519-ecies/src'
import { Keypair } from '@solana/web3.js'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string
}

export interface DecryptRequest extends NextApiRequest {
  body: {
    input: Uint8Array
    keypair: Keypair
  }
}

export default async function handler(
  req: DecryptRequest,
  res: NextApiResponse<Data>
) {
  if (req.method == 'POST') {
    try {
      const { input, keypair } = req.body
      const output = await Ed25519Ecies.decrypt(
        Buffer.from(input),
        Buffer.from(keypair.secretKey)
      )
      console.log(output.toString())
      res.status(200).json({ message: output.toString() })
    } catch (error) {
      console.log(error)
    }
  } else {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
}
