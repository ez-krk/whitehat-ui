import React, { createContext, useState, useEffect, useMemo } from 'react'
// import { onAuthStateChangeListener } from "@/tools/supabase";
import type { ReactNode } from 'react'
import type { PROTOCOL_PDA, SOL_HACK_PDA, VULNERABILITY_PDA } from '@/types'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Address, Program } from '@coral-xyz/anchor'
import { IDL } from '@/idl'
import { PROGRAM_ID } from '@/constants'

interface WhitehatContext {
  program: Program<IDL> | null
  programs: PROTOCOL_PDA[] | null
  setPrograms: React.Dispatch<
    React.SetStateAction<PROTOCOL_PDA[] | null>
  > | null
  vulnerability: VULNERABILITY_PDA[] | null
  setVulnerability: React.Dispatch<
    React.SetStateAction<VULNERABILITY_PDA[] | null>
  > | null
  pendingVulnerability: number
  solHacks: SOL_HACK_PDA[] | null
  setSolHacks: React.Dispatch<
    React.SetStateAction<SOL_HACK_PDA[] | null>
  > | null
  pendingHacks: number
}

export const WhitehatContext = createContext<WhitehatContext>({
  program: null,
  programs: null,
  setPrograms: () => null,
  vulnerability: null,
  setVulnerability: () => null,
  pendingVulnerability: 0,
  solHacks: null,
  setSolHacks: () => null,
  pendingHacks: 0,
})

export const WhitehatProvider = ({ children }: { children: ReactNode }) => {
  const { publicKey } = useWallet()
  const connection = useConnection()

  const program = useMemo(
    () => new Program(IDL, PROGRAM_ID as Address, connection),
    [connection]
  )
  const [programs, setPrograms] = useState<PROTOCOL_PDA[] | null>(null)
  const [vulnerability, setVulnerability] = useState<
    VULNERABILITY_PDA[] | null
  >(null)

  const [pendingVulnerability, setPendingVulnerability] = useState<number>(0)

  const [solHacks, setSolHacks] = useState<SOL_HACK_PDA[] | null>(null)
  const [pendingHacks, setPendingHacks] = useState<number>(0)

  const value = {
    program,
    programs,
    setPrograms,
    vulnerability,
    setVulnerability,
    pendingVulnerability,
    solHacks,
    setSolHacks,
    pendingHacks,
  }

  useEffect(() => {
    if (publicKey && !programs) {
      const fetchPrograms = async () => {
        // @ts-ignore
        return await program.account.protocol.all([
          {
            memcmp: {
              offset: 8,
              bytes: publicKey.toBase58(),
            },
          },
        ])
      }
      fetchPrograms()
        .then((response) => {
          console.log(response)
          // @ts-ignore
          const programsMap = response.map(({ account, publicKey }) => {
            const result = account
            account.pubkey = publicKey
            return result
          })
          console.log(programsMap)
          setPrograms(programsMap)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }, [publicKey])

  useEffect(() => {
    if (publicKey && programs) {
      const fetchVulnerabilities = async () => {
        // @ts-ignore
        return await program.account.vulnerability.all([
          {
            memcmp: {
              offset: 8,
              bytes: programs[0].pubkey.toBase58(),
            },
          },
        ])
      }
      fetchVulnerabilities()
        .then((response) => {
          // @ts-ignore
          const vulnerabilitiesMap = response.map(({ account, publicKey }) => {
            const result = account
            account.pubkey = publicKey
            return result
          })
          console.log('vulnerabilities', vulnerabilitiesMap)
          setVulnerability(vulnerabilitiesMap)
        })
        .catch((error) => console.log(error))
    }
  }, [publicKey, programs])

  useEffect(() => {
    if (vulnerability && vulnerability.length > 0) {
      const pendingCount = vulnerability.reduce((count, { reviewed }) => {
        if (reviewed === false) {
          return count + 1
        } else {
          return count
        }
      }, 0)

      setPendingVulnerability(pendingCount)
      console.log('pending vulnerabilities : ', pendingCount)
    }
  }, [vulnerability])

  useEffect(() => {
    if (publicKey && programs) {
      const fetchHacks = async () => {
        // @ts-ignore
        return await program.account.solHack.all([
          {
            memcmp: {
              offset: 8,
              bytes: programs[0].pubkey.toBase58(),
            },
          },
        ])
      }
      fetchHacks()
        .then((response) => {
          // @ts-ignore
          const hacksMap = response.map(({ account, publicKey }) => {
            const result = account
            account.pubkey = publicKey
            return result
          })
          console.log('sol hacks', hacksMap)
          setSolHacks(hacksMap)
        })
        .catch((error) => console.log(error))
    }
  }, [publicKey])

  useEffect(() => {
    if (solHacks && solHacks.length > 0) {
      const pendingCount = solHacks.reduce((count, { reviewed }) => {
        if (reviewed === false) {
          return count + 1
        } else {
          return count
        }
      }, 0)

      setPendingHacks(pendingCount)
      console.log('pending hacks : ', pendingCount)
    }
  }, [solHacks])

  return (
    <WhitehatContext.Provider value={value}>
      {children}
    </WhitehatContext.Provider>
  )
}
