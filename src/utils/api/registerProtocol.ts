import { PROGRAM_ID } from '@/constants'
import { IDL } from '@/idl'
import { Address, Program } from '@coral-xyz/anchor'
import { ConnectionContextState } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js'

export const registerProtocol = async (
  owner: PublicKey,
  name: string,
  percent: string,
  connection: ConnectionContextState
): Promise<Transaction> => {
  const program = new Program(IDL, PROGRAM_ID as Address, connection)

  const protocol = PublicKey.findProgramAddressSync(
    [Buffer.from('protocol'), owner.toBuffer()],
    program.programId
  )[0]

  const auth = PublicKey.findProgramAddressSync(
    [Buffer.from('auth'), protocol.toBytes()],
    program.programId
  )[0]

  const vault = PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), protocol.toBytes()],
    program.programId
  )[0]

  const analytics = PublicKey.findProgramAddressSync(
    [Buffer.from('analytics')],
    program.programId
  )[0]

  return await program.methods
    .registerProtocol(name, percent)
    .accounts({
      owner,
      auth,
      vault,
      protocol,
      analytics,
      systemProgram: SystemProgram.programId,
    })
    .transaction()
}
