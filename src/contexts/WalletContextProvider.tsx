import {
  Adapter,
  WalletAdapterNetwork,
  WalletError,
} from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { type SolanaSignInInput } from '@solana/wallet-standard-features'
import { verifySignIn } from '@solana/wallet-standard-util'
import { FC, ReactNode, useCallback } from 'react'
import dynamic from 'next/dynamic'

export const ReactUIWalletModalProviderDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletModalProvider,
  { ssr: false }
)

export const WalletContextProvider: FC<{
  children: ReactNode
  endpoint: string
  network: WalletAdapterNetwork
  wallets?: Adapter[]
}> = ({ children, endpoint, network, wallets = [] }) => {
  const onError = useCallback((error: WalletError) => {
    console.error(error)
  }, [])

  // const autoSignIn = useCallback(async (adapter: Adapter) => {
  //   // If the signIn feature is not available, return true
  //   if (!('signIn' in adapter)) return true

  //   // Fetch the signInInput from the backend
  //   const createResponse = await fetch('/backend/createSignInData')

  //   const input: SolanaSignInInput = await createResponse.json()

  //   // Send the signInInput to the wallet and trigger a sign-in request
  //   const output = await adapter.signIn(input)

  //   // Verify the sign-in output against the generated input server-side
  //   const verifyResponse = await fetch('/backend/verifySIWS', {
  //     method: 'POST',
  //     body: JSON.stringify({ input, output }),
  //   })
  //   const success = await verifyResponse.json()

  //   // If verification fails, throw an error
  //   if (!success) throw new Error('Sign In verification failed!')

  //   return false
  // }, [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        <ReactUIWalletModalProviderDynamic>
          {children}
        </ReactUIWalletModalProviderDynamic>
      </WalletProvider>
    </ConnectionProvider>
  )
}
