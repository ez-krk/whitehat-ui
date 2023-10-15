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
} from 'react'
import { useRecoilValue } from 'recoil'
import { userState } from '@/store/user'
import { db } from '@/lib/firebase'
import { orderBy } from 'firebase/firestore'
import { chatContentSchema } from '@/utils/form'
import Image from 'next/image'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useToastMessage from '@/hooks/useToastMessage'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remark2Rehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import rehypeCodeTitles from 'rehype-code-titles'
import remarkSlug from 'remark-slug'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import remarkExternalLinks from 'remark-external-links'
import { UserChatRoomMessage, genUserChatRoomMessagePath } from '@/types/models'
import { Timestamp } from '@skeet-framework/firestore'
import { get, query } from '@/lib/skeet/firestore'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { MOCK_DATA, PROGRAM_ID, SOLANA_RPC_ENDPOINT } from '@/constants'
import Link from '@/components/routing/Link'
import {
  PublicKey,
  TransactionSignature,
  Connection,
  SystemProgram,
} from '@solana/web3.js'
import { IDL } from '@/idl'
import { Address, Program, BN } from '@coral-xyz/anchor'
import type { PROTOCOL_PDA, SOL_HACK_PDA, VULNERABILITY_PDA } from '@/types'
import { approveVulnerability } from '@/utils/api/instructions/approveVulnerability'
import Spinner from '@/components/utils/Spinner'
import { deleteVulnerability } from '@/utils/api/instructions/deleteVulnerability'

type ChatMessage = {
  id: string
  role: string
  createdAt: Timestamp | undefined
  updatedAt: Timestamp | undefined
  content: string
}

const schema = z.object({
  chatContent: chatContentSchema,
})

type Inputs = z.infer<typeof schema>

type Props = {
  currentChatRoomId: string | null
}

export default function VulnerabilitiesBox({ currentChatRoomId }: Props) {
  const { t } = useTranslation()
  const user = useRecoilValue(userState)
  const { publicKey, sendTransaction } = useWallet()
  const connection = useConnection()

  const [loading, setLoading] = useState(true)

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [programs, setPrograms] = useState<PROTOCOL_PDA[] | null>(null)
  const [vulnerabilities, setVulnerabilities] = useState<
    VULNERABILITY_PDA[] | null
  >(null)
  const [pendingVulnerabilities, setPendingVulnerabilities] =
    useState<number>(0)
  const [solHacks, setSolHacks] = useState<SOL_HACK_PDA[] | null>(null)
  const [pendingHacks, setPendingHacks] = useState<number>(0)

  const addToast = useToastMessage()

  const program = useMemo(
    () => new Program(IDL, PROGRAM_ID as Address, connection),
    [connection]
  )

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
          console.log(response)
          // @ts-ignore
          const vulnerabilitiesMap = response.map(({ account, publicKey }) => {
            const result = account
            account.pubkey = publicKey
            return result
          })
          console.log('vulnerabilities', vulnerabilitiesMap)
          setVulnerabilities(vulnerabilitiesMap)
        })
        .catch((error) => console.log(error))
    }
  }, [publicKey, programs])

  useEffect(() => {
    if (vulnerabilities && vulnerabilities.length > 0) {
      console.log('hi there !')
      const pendingMap = vulnerabilities.map(({ reviewed }) => {
        if (reviewed == true) {
          return reviewed
        } else return false
      })
      setPendingVulnerabilities(pendingMap.length)
    }
  }, [vulnerabilities])

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
          console.log(response)
          // @ts-ignore
          const hacksMap = response.map(({ account, publicKey }) => {
            const result = account
            account.pubkey = publicKey
            return result
          })
          console.log('sol hacks', hacksMap)
          setSolHacks(hacksMap)
        })
        .finally(() => setLoading(false))
        .catch((error) => console.log(error))
    }
  }, [publicKey, connection])

  const chatContentRef = useRef<HTMLDivElement>(null)
  const scrollToEnd = useCallback(() => {
    if (currentChatRoomId && chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight
    }
  }, [chatContentRef, currentChatRoomId])

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      chatContent: '',
    },
  })

  const chatContent = watch('chatContent')
  const chatContentLines = useMemo(() => {
    return (chatContent.match(/\n/g) || []).length + 1
  }, [chatContent])

  const [isSending, setSending] = useState(false)

  useEffect(() => {
    if (chatMessages.length > 0) {
      scrollToEnd()
    }
  }, [chatMessages, scrollToEnd])

  const isDisabled = useMemo(() => {
    return isSending || errors.chatContent != null
  }, [isSending, errors.chatContent])

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
        handleDelete(id)
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
            `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
        })
        // handleDelete(vulnerability)
      } catch (error) {
        console.log(error)
      }
  }

  const handleDelete = (pda: VULNERABILITY_PDA) => {
    setVulnerabilities(
      vulnerabilities && vulnerabilities.filter((item) => item.id !== pda.id)
    )
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
                  {vulnerabilities && vulnerabilities.length > 0 ? (
                    <>
                      {pendingVulnerabilities > 0 ? (
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

                      {vulnerabilities.map((vulnerability) => {
                        console.log('id : ', vulnerability.id.toString())
                        console.log('seed', vulnerability.seed.toString())
                        if (!vulnerability.reviewed)
                          return (
                            <div
                              className="card mt-2 w-96 bg-base-100 shadow-xl"
                              key={vulnerability.id}
                            >
                              <div className="card-body w-full">
                                <p className="text-center">
                                  {vulnerability.message.toString()}
                                </p>
                                <div className="card-actions justify-center">
                                  <button
                                    className="btn-error btn-sm"
                                    onClick={() => onClickClose(vulnerability)}
                                  >
                                    dispute
                                  </button>
                                  <button
                                    className="btn-success btn-sm"
                                    onClick={() =>
                                      onClick(
                                        vulnerability.id,
                                        vulnerability.seed
                                      )
                                    }
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
