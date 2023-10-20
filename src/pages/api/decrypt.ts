// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Ed25519Ecies } from '@/lib/ed25519-ecies/src'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  message: string
}

export interface DecryptRequest extends NextApiRequest {
  body: {
    input: Uint8Array
    secretKey: Uint8Array
  }
}

export default async function handler(
  req: DecryptRequest,
  res: NextApiResponse<Data>
) {
  if (req.method == 'POST') {
    try {
      const { input, secretKey } = req.body
      console.log('input from api : ', input)
      console.log('secretKey from api : ', secretKey)
      const output = await Ed25519Ecies.decrypt(
        Buffer.from(input),
        Buffer.from(secretKey)
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
