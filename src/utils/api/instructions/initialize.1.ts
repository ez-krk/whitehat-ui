import { PROGRAM_ID } from '@/constants'
import { Address, Program } from '@coral-xyz/anchor'
import { IDL } from '@coral-xyz/anchor/dist/cjs/native/system'

export const initialize = async () => {
  const program = new Program(IDL, PROGRAM_ID as Address, connection)
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
