import { PROGRAM_ID } from '@/constants'
import { IDL } from '@/idl'
import { Address, BN, Program } from '@coral-xyz/anchor'
import { ConnectionContextState } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js'

export const approveHack = async (
  owner: PublicKey,
  amount: number,
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

  const whvault = PublicKey.findProgramAddressSync(
    [Buffer.from('vault')],
    program.programId
  )[0]

  const analytics = PublicKey.findProgramAddressSync(
    [Buffer.from('analytics')],
    program.programId
  )[0]

  const hack = PublicKey.findProgramAddressSync(
    // b"hack", protocol.key().as_ref(), amount.to_le_bytes().as_ref()
    [
      Buffer.from('hack'),
      protocol.toBytes(),
      new BN(amount).toArrayLike(Buffer, 'le', 8),
    ],
    program.programId
  )[0]

  // @ts-ignore
  const hackPda = await program.account.solHack.fetch(hack)

  return await program.methods
    .approveSolHack()
    .accounts({
      owner,
      payout: hackPda.payout,
      protocol,
      hack,
      auth,
      vault,
      fees: whvault,
      analytics,
      systemProgram: SystemProgram.programId,
    })
    .transaction()
}
