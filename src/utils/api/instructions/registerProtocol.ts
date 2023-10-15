import { PROGRAM_ID } from '@/constants'
import { IDL } from '@/idl'
import { Address, BN, Program } from '@coral-xyz/anchor'
import { ConnectionContextState } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js'

export const registerProtocol = async (
  owner: PublicKey,
  encryption: PublicKey,
  name: string,
  percent: number,
  connection: ConnectionContextState
): Promise<Transaction> => {
  const program = new Program(IDL, PROGRAM_ID as Address, connection)

  const protocol = PublicKey.findProgramAddressSync(
    [Buffer.from('protocol'), owner.toBytes()],
    program.programId
  )[0]

  console.log('protocol : ', protocol.toString())

  const auth = PublicKey.findProgramAddressSync(
    [Buffer.from('auth'), protocol.toBytes()],
    program.programId
  )[0]

  console.log('auth : ', auth.toString())

  const vault = PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), protocol.toBytes()],
    program.programId
  )[0]

  console.log('vault : ', vault.toString())

  const analytics = PublicKey.findProgramAddressSync(
    [Buffer.from('analytics')],
    program.programId
  )[0]

  return await program.methods
    .registerProtocol(name, new BN(percent))
    .accounts({
      owner,
      encryption,
      auth,
      vault,
      protocol,
      analytics,
      systemProgram: SystemProgram.programId,
    })
    .transaction()
}
