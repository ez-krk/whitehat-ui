import { PROGRAM_ID } from '@/constants'
import { IDL } from '@/idl'
import { Address, BN, Program } from '@coral-xyz/anchor'
import { ConnectionContextState } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js'

export const deleteProtocol = async (
  admin: PublicKey,
  pubkey: PublicKey,
  connection: ConnectionContextState
): Promise<Transaction> => {
  const program = new Program(IDL, PROGRAM_ID as Address, connection)

  const analytics = PublicKey.findProgramAddressSync(
    [Buffer.from('analytics')],
    program.programId
  )[0]

  return await program.methods
    .deleteProtocol()
    .accounts({
      admin,
      protocol: pubkey,
      analytics,
      systemProgram: SystemProgram.programId,
    })
    .transaction()
}
