import { useTranslation } from 'next-i18next'
import {
  ShieldCheckIcon,
  ShieldExclamationIcon,
} from '@heroicons/react/24/outline'
import { useState, useContext } from 'react'
import useToastMessage from '@/hooks/useToastMessage'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { PROGRAM_ID, SOLANA_RPC_ENDPOINT } from '@/constants'
import Link from '@/components/routing/Link'
import {
  TransactionSignature,
  Connection,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import { BN } from '@coral-xyz/anchor'
import { approveHack } from '@/utils/api/instructions/approveHack'
import { WhitehatContext } from '@/contexts/WhitehatContextProvider'

export default function HacksBox() {
  const { t } = useTranslation()
  const { publicKey, sendTransaction } = useWallet()
  const connection = useConnection()
  const {
    programs,
    setPrograms,
    vulnerability,
    setVulnerability,
    pendingVulnerability,
    solHacks,
    setSolHacks,
    pendingHacks,
  } = useContext(WhitehatContext)

  const [loading, setLoading] = useState(true)

  const addToast = useToastMessage()

  const onClick = async (amount: BN) => {
    if (publicKey)
      try {
        const tx = await approveHack(publicKey, amount, connection)
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

  return (
    <>
      <div className="content-height-mobile sm:content-height w-full overflow-y-auto pt-4 sm:flex-1 sm:px-4 sm:pt-0">
        <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
          <div className="flex w-full max-w-md flex-col items-center justify-center gap-6 p-4">
            {!publicKey && programs && programs.length > 0 ? (
              <>
                <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                  {t('dashboard:connectWallet')}
                </h2>
                <WalletMultiButton />
              </>
            ) : (
              <div className="flex flex-col">
                <div className="mx-auto my-8 flex flex-col">
                  {solHacks && solHacks.length > 0 ? (
                    <>
                      {pendingHacks > 0 ? (
                        <p className="mb-2 flex w-full items-center justify-center text-center text-gray-700 dark:text-gray-200">
                          {t('hacks:pleaseReview')}{' '}
                          <ShieldExclamationIcon className="ml-1 h-8 w-8" />
                        </p>
                      ) : (
                        <p className="flex w-full items-center justify-center text-center text-gray-700 dark:text-gray-200">
                          {t('hacks:allClear')}{' '}
                          <ShieldCheckIcon className="h-8 w-8" />
                        </p>
                      )}

                      {solHacks.map((hack) => {
                        console.log(hack)
                        if (!hack.reviewed)
                          return (
                            <div
                              className="card w-96 bg-base-100 shadow-xl"
                              key={hack.pubkey.toString()}
                            >
                              <div className="card-body w-full">
                                <p className="text-center">
                                  hacker returned{' '}
                                  {parseInt(hack.amount.toString()) /
                                    LAMPORTS_PER_SOL}{' '}
                                  sol
                                </p>
                                <p className="mb-2 text-center text-xs">
                                  only approve this hack if this matches the
                                  amount your protocol got hacked for
                                </p>
                                <div className="card-actions justify-center">
                                  <button
                                    className="btn-success btn-sm"
                                    onClick={() => onClick(hack.amount)}
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
                      {t('hacks:allClear')}{' '}
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
