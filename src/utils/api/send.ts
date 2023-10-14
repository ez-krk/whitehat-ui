import { SOLANA_RPC_ENDPOINT } from '@/constants'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, Transaction, TransactionSignature } from '@solana/web3.js'

export const sendTx = async (
  transaction: Transaction,
  useWallet: WalletContextState
) => {
  const { sendTransaction } = useWallet
  const cnx = new Connection(SOLANA_RPC_ENDPOINT)
  let signature: TransactionSignature = ''
  try {
    signature = await sendTransaction(transaction, cnx)
    return await cnx.confirmTransaction(signature, 'confirmed')
  } catch (error) {
    console.log(error)
  }
}
