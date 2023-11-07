import Container from '@/components/common/atoms/Container'
import { useTranslation } from 'next-i18next'
import { PROTOCOL_PDA } from '@/types'
import { useEffect, useMemo, useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Address, Program } from '@coral-xyz/anchor'
import { IDL } from '@/idl'
import { PROGRAM_ID } from '@/constants'
import { ellipsis } from '@/utils/ellipsis'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import Tooltip from '@/components/common/atoms/Tooltip'

export default function HomeHeroRow() {
  const { t } = useTranslation()

  const { publicKey } = useWallet()
  const connection = useConnection()

  const [programs, setPrograms] = useState<PROTOCOL_PDA[] | null>(null)

  const program = useMemo(
    () => new Program(IDL, PROGRAM_ID as Address, connection),
    [connection]
  )
  useEffect(() => {
    if (publicKey && !programs) {
      const fetchPrograms = async () => {
        // @ts-ignore
        return await program.account.protocol.all()
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

  return (
    <>
      <Container className="pb-40 pt-24 text-center lg:pb-64 lg:pt-40">
        <h1 className="font-display mx-auto max-w-4xl text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-7xl">
          hack with impunity *
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-gray-700 dark:text-gray-200">
          * {t('explore:HeroRow.body')}
        </p>
        {publicKey ? (
          <div className="mt-6 lg:mt-8">
            {programs && programs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table">
                  {/* head */}
                  <thead className="text-gray-900 dark:text-gray-50">
                    <tr>
                      <th className="text-center">%</th>
                      <th className="text-center">protocol name</th>
                      <th className="text-center">owner</th>
                      <th className="text-center">pda address</th>
                      <th className="text-center">deposit vault</th>
                      <th className="text-center">encryption pubkey</th>
                      <th className="text-center">vulnerabilities</th>
                      <th className="text-center">hacks</th>
                      <th className="text-center">paid to hackers</th>
                    </tr>
                  </thead>
                  {/* body */}
                  <tbody className="text-gray-900 dark:text-gray-50">
                    {programs.map((program: PROTOCOL_PDA) => {
                      console.log('deposit vault :', program.vault.toString())
                      return (
                        <tr key={program.pubkey.toString()}>
                          <th className="text-center">
                            {program.percent.toNumber()} %
                          </th>
                          <td className="text-center">{program.name}</td>
                          <td>
                            <span className="flex items-center justify-center">
                              <Tooltip text={`${program.owner.toString()}`}>
                                {ellipsis(program.owner.toString())}
                              </Tooltip>
                            </span>
                          </td>
                          <td>
                            <span className="flex items-center justify-center">
                              <Tooltip text={`${program.pubkey.toString()}`}>
                                {ellipsis(program.pubkey.toString())}
                              </Tooltip>
                            </span>
                          </td>
                          <td>
                            <span className="flex items-center justify-center">
                              <Tooltip text={`${program.vault.toString()}`}>
                                {ellipsis(program.vault.toString())}
                              </Tooltip>
                            </span>
                          </td>
                          <td>
                            <span className="flex items-center justify-center">
                              <Tooltip
                                text={`${program.encryption.toString()}`}
                              >
                                {ellipsis(program.encryption.toString())}
                              </Tooltip>
                            </span>
                          </td>
                          <td className="text-center">
                            {program.vulnerabilities.toNumber()}
                          </td>
                          <td className="text-center">
                            {program.hacks.toNumber()}
                          </td>
                          <td className="text-center">
                            {program.paid.toNumber() / LAMPORTS_PER_SOL}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div>something went wrong</div>
            )}
          </div>
        ) : (
          <WalletMultiButton />
        )}
      </Container>
    </>
  )
}
