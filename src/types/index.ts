import type { PublicKey } from '@solana/web3.js'
import type { BN } from '@coral-xyz/anchor'

export enum Instructions {
  RegisterProtocol,
  ApproveVulnerability,
  ApproveHack,
}

export type ANALYTICS_PDA = {
  // pub admin: Pubkey,
  // pub protocols: u64,
  // pub vulnerabilities: u64,
  // pub hacks: u64,
  // pub sol_recovered: u64,
  // pub sol_paid: u64,
  // pub fees: u64,
  // pub created_at: i64,
  // pub auth_bump: u8,
  // pub vault_bump: u8,
  // pub state_bump: u8,

  admin: PublicKey
  protocols: number
  vulnerabilities: number
  hacks: number
  solRecovered: number
  solPaid: number
  fees: number
  createdAt: number
  auth_bump: number
  vault_bump: number
  state_bump: number
}

export type PROTOCOL_PDA = {
  // pub owner: Pubkey,
  // pub encryption: Pubkey,
  // pub vault: Pubkey,
  // pub name: String,
  // pub percent: u64,
  // pub paid : u64,
  // pub vulnerabilities: u64,
  // pub hacks: u64,
  // pub created_at: i64,
  // pub auth_bump: u8,
  // pub vault_bump: u8,
  // pub state_bump: u8,

  pubkey: PublicKey
  owner: PublicKey
  encryption: PublicKey
  vault: PublicKey
  name: string
  percent: BN
  paid: BN
  vulnerabilities: BN
  hacks: BN
  createdAt: number
  auth_bump: number
  vault_bump: number
  state_bump: number
}

export type VULNERABILITY_PDA = {
  // pub protocol: Pubkey,
  // pub id: u64,
  // pub payout: Pubkey,
  // pub message: Vec<u8>,
  // pub reviewed: bool,
  // pub created_at: i64,
  // pub bump: u8,
  // pub seed: u64,

  pubkey: PublicKey
  protocol: PublicKey
  id: number
  payout: PublicKey
  message: Uint8Array
  reviewed: boolean
  createdAt: number
  bump: number
  seed: number
}

export type SOL_HACK_PDA = {
  // pub protocol: Pubkey,
  // pub payout: Pubkey,
  // pub reviewed: bool,
  // pub amount: u64,
  // pub created_at: i64,
  // pub bump: u8,

  pubkey: PublicKey
  protocol: PublicKey
  payout: PublicKey
  reviewed: boolean
  amount: BN
  created_at: number
  bump: number
}
