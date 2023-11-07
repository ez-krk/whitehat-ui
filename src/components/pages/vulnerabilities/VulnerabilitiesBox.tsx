import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import {
  PaperAirplaneIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  KeyboardEvent,
  useContext,
} from 'react'
import { useRecoilValue } from 'recoil'
import { userState } from '@/store/user'
import { chatContentSchema } from '@/utils/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useToastMessage from '@/hooks/useToastMessage'
import { Timestamp } from '@skeet-framework/firestore'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { SOLANA_RPC_ENDPOINT } from '@/constants'
import Link from '@/components/routing/Link'
import {
  PublicKey,
  TransactionSignature,
  Connection,
  SystemProgram,
  Keypair,
} from '@solana/web3.js'
import { BN } from '@coral-xyz/anchor'
import type { PROTOCOL_PDA, SOL_HACK_PDA, VULNERABILITY_PDA } from '@/types'
import { approveVulnerability } from '@/utils/api/instructions/approveVulnerability'
import { deleteVulnerability } from '@/utils/api/instructions/deleteVulnerability'
import { WhitehatContext } from '@/contexts/WhitehatContextProvider'
import { Ed25519Ecies } from '@/lib/ed25519-ecies/dist/index'
import Wallet from '@/components/common/atoms/Wallet'

export default function VulnerabilitiesBox() {
  const { t } = useTranslation()
  const user = useRecoilValue(userState)
  const { publicKey, sendTransaction } = useWallet()
  const connection = useConnection()

  const [loading, setLoading] = useState(true)

  const [decrypted, setDecrypted] = useState('')
  const [current, setCurrent] = useState<VULNERABILITY_PDA | null>(null)

  const addToast = useToastMessage()

  const {
    programs,
    setPrograms,
    vulnerability,
    setVulnerability,
    pendingVulnerability,
    solHacks,
    setSolHacks,
    pendingHacks,
    keypair,
  } = useContext(WhitehatContext)

  const onClick = async (id: BN, seed: BN) => {
    if (publicKey)
      try {
        const tx = await approveVulnerability(publicKey, id, seed, connection)

        const cnx = new Connection(SOLANA_RPC_ENDPOINT)
        let signature: TransactionSignature = ''
        signature = await sendTransaction(tx, cnx)
        await cnx.confirmTransaction(signature, 'confirmed')
        addToast({
          type: 'success',
          title: t('vulnerabilities:vulnerabilityVerificationSuccessTitle'),
          description:
            t('vulnerabilities:vulnerabilityVerificationSuccessBody') +
            `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
        })
      } catch (error) {
        console.log(error)
      }
  }

  const onClickClose = async (vulnerability: VULNERABILITY_PDA) => {
    if (publicKey)
      try {
        const tx = await deleteVulnerability(
          new PublicKey('7sydHcmax59DZJ523tFQEakwkJ3vBDWUE64auHy7yn1N'),
          vulnerability.protocol,
          vulnerability.pubkey,
          connection
        )

        const cnx = new Connection(SOLANA_RPC_ENDPOINT)
        let signature: TransactionSignature = ''
        signature = await sendTransaction(tx, cnx)
        await cnx.confirmTransaction(signature, 'confirmed')
        addToast({
          type: 'success',
          title: t('vulnerabilities:vulnerabilityVerificationSuccessTitle'),
          description:
            t('vulnerabilities:vulnerabilityVerificationSuccessBody') +
            (
              <Link
                href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
              >{`https://explorer.solana.com/tx/${signature}?cluster=devnet`}</Link>
            ),
        })
        // handleDelete(vulnerability)
      } catch (error) {
        console.log(error)
      }
  }

  const decrypt = async (input: Uint8Array) => {
    try {
      if (!input || !keypair) {
        return
      }

      await fetch('/api/decrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          keypair,
        }),
      })
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          console.log(data)
          setDecrypted(data.message)
        })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className="content-height-mobile sm:content-height w-full overflow-y-auto pt-4 sm:flex-1 sm:px-4 sm:pt-0">
        <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
          <div className="flex w-full max-w-md flex-col items-center justify-center gap-6 p-4">
            {!publicKey ? (
              <Wallet />
            ) : (
              <div className="flex flex-col">
                <div className="mx-auto my-8 flex flex-col">
                  {vulnerability && vulnerability.length > 0 ? (
                    <>
                      {pendingVulnerability > 0 ? (
                        <p className="mb-2 flex w-full items-center justify-center text-center text-gray-700 dark:text-gray-200">
                          {t('vulnerabilities:pleaseReview')}{' '}
                          <ShieldExclamationIcon className="ml-1 h-8 w-8" />
                        </p>
                      ) : (
                        <p className="flex w-full items-center justify-center text-center text-gray-700 dark:text-gray-200">
                          {t('vulnerabilities:allClear')}{' '}
                          <ShieldCheckIcon className="h-8 w-8" />
                        </p>
                      )}

                      {vulnerability.map((item: VULNERABILITY_PDA) => {
                        // console.log('id : ', item.id.toString())
                        // console.log('seed', item.seed.toString())
                        if (!item.reviewed)
                          return (
                            <div
                              className="card mt-2 w-96 bg-base-100 shadow-xl"
                              key={item.id}
                            >
                              <div className="card-body w-full">
                                <p className="text-center">
                                  {decrypted
                                    ? decrypted
                                    : item.message.toString()}
                                </p>
                                <div className="card-actions justify-center">
                                  <button
                                    className="btn-warning btn-sm"
                                    onClick={() => decrypt(item.message)}
                                  >
                                    decrypt
                                  </button>
                                  <button
                                    className="btn-error btn-sm"
                                    onClick={() => onClickClose(item)}
                                  >
                                    dispute
                                  </button>
                                  <button
                                    className="btn-success btn-sm"
                                    onClick={() => onClick(item.id, item.seed)}
                                  >
                                    approve
                                  </button>
                                </div>
                              </div>
                            </div>
                          )
                      })}
                    </>
                  ) : (
                    <p className="flex w-full items-center justify-center text-center text-gray-700 dark:text-gray-200">
                      {t('vulnerabilities:allClear')}{' '}
                      <ShieldCheckIcon className="h-8 w-8" />
                    </p>
                  )}
                  <div className="w-96">
                    <p className="my-4 w-[100%] text-center"></p>
                    {/* <FundsReturns data={MOCK_DATA} /> */}
                  </div>
                  <div className="w-96">
                    {/* <PaidHackers data={MOCK_DATA} /> */}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
