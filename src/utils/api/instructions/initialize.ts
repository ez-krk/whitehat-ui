import { PROGRAM_ID } from '@/constants'
import { IDL } from '@/idl'
import { Program } from '@coral-xyz/anchor'
import type { Address } from '@coral-xyz/anchor'
import type { ConnectionContextState } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram } from '@solana/web3.js'

export const initialize = async (
  admin: PublicKey,
  connection: ConnectionContextState
) => {
  const program = new Program(IDL, PROGRAM_ID as Address, connection)

  const analytics = PublicKey.findProgramAddressSync(
    [Buffer.from('analytics')],
    program.programId
  )[0]
  const whauth = PublicKey.findProgramAddressSync(
    [Buffer.from('auth')],
    program.programId
  )[0]
  const whvault = PublicKey.findProgramAddressSync(
    [Buffer.from('vault')],
    program.programId
  )[0]

  return await program.methods
    .initialize()
    .accounts({
      admin,
      auth: whauth,
      vault: whvault,
      analytics,
      systemProgram: SystemProgram.programId,
    })
    .transaction()
}
