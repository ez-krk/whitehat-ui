import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import {
  CommandLineIcon,
  CpuChipIcon,
  PaperAirplaneIcon,
  PlusCircleIcon,
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
import { fetchSkeetFunctions } from '@/lib/skeet/functions'
import Image from 'next/image'
import { ChatRoom } from './DashboardMenu'
import { AddStreamUserChatRoomMessageParams } from '@/types/http/skeet/addStreamUserChatRoomMessageParams'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextDecoder } from 'text-encoding'
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
import {
  UserChatRoom,
  UserChatRoomMessage,
  genUserChatRoomMessagePath,
  genUserChatRoomPath,
} from '@/types/models'
import { Timestamp } from '@skeet-framework/firestore'
import { get, query } from '@/lib/skeet/firestore'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { FundsReturns } from '@/components/charts/FundsReturned'
import {
  ADMIN_PUBKEY,
  MOCK_DATA,
  PROGRAM_ID,
  SOLANA_RPC_ENDPOINT,
} from '@/constants'
import Link from '@/components/routing/Link'
import {
  PublicKey,
  TransactionSignature,
  Connection,
  SystemProgram,
} from '@solana/web3.js'
import { IDL } from '@/idl'
import { Address, Program } from '@coral-xyz/anchor'
import type {
  ANALYTICS_PDA,
  PROTOCOL_PDA,
  SOL_HACK_PDA,
  VULNERABILITY_PDA,
} from '@/types'
import { initialize } from '@/utils/api/instructions/initialize'
import { PaidHackers } from '@/components/charts/PaidHackers'
import { deleteProtocol } from '@/utils/api/instructions/deleteProtocol'

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
  programs: PROTOCOL_PDA[] | null
  selectedProgram: PROTOCOL_PDA | null
  pendingVulnerability: number
  pendingHacks: number
  currentChatRoomId: string | null
}

export default function DashboardBox({
  programs,
  selectedProgram,
  pendingVulnerability,
  pendingHacks,
  currentChatRoomId,
}: Props) {
  const { t } = useTranslation()
  const user = useRecoilValue(userState)
  const { publicKey, sendTransaction } = useWallet()
  const connection = useConnection()
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null)

  const addToast = useToastMessage()

  // useEffect(() => {
  //   if (publicKey) {
  //     const fetchAnalytics = async () => {
  //       const analytics = PublicKey.findProgramAddressSync(
  //         [Buffer.from('analytics')],
  //         program.programId
  //       )[0]
  //       console.log(analytics.toString())
  //       //@ts-ignore
  //       return await program.account.analytics.fetch(analytics)
  //     }
  //     fetchAnalytics()
  //       .then((response) => {
  //         console.log(response)
  //       })
  //       .catch((error) => console.log(error))
  //   }
  // }, [publicKey])

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

  const [isFirstMessage, setFirstMessage] = useState(true)

  const getChatRoom = useCallback(async () => {
    if (db && user.uid && currentChatRoomId) {
      try {
        const data = await get<UserChatRoom>(
          db,
          genUserChatRoomPath(user.uid),
          currentChatRoomId
        )
        if (data.title !== '') {
          setFirstMessage(false)
        }
        setChatRoom(data as ChatRoom)
      } catch (e) {
        console.error(e)
      }
    }
  }, [currentChatRoomId, user.uid])

  useEffect(() => {
    void (async () => {
      try {
        await getChatRoom()
      } catch (e) {
        console.error(e)
      }
    })()
  }, [getChatRoom])

  const [isSending, setSending] = useState(false)

  const getUserChatRoomMessage = useCallback(async () => {
    if (db && user.uid && currentChatRoomId) {
      const querySnapshot = await query<UserChatRoomMessage>(
        db,
        genUserChatRoomMessagePath(user.uid, currentChatRoomId),
        [orderBy('createdAt', 'asc')]
      )
      const messages: ChatMessage[] = []
      for await (const qs of querySnapshot.docs) {
        const data = qs.data()
        const html = await unified()
          .use(remarkParse)
          .use(remarkDirective)
          .use(remarkGfm)
          .use(remarkSlug)
          .use(remarkExternalLinks, {
            target: '_blank',
            rel: ['noopener noreferrer'],
          })
          .use(remark2Rehype)
          .use(rehypeCodeTitles)
          .use(rehypeHighlight)
          .use(rehypeStringify)
          .process(data.content as string)

        messages.push({
          id: qs.id,
          ...data,
          content: html.value,
        } as ChatMessage)
      }

      setChatMessages(messages)
    }
  }, [currentChatRoomId, user.uid])

  useEffect(() => {
    void (async () => {
      try {
        await getUserChatRoomMessage()
      } catch (e) {
        console.error(e)
      }
    })()
  }, [getUserChatRoomMessage])

  useEffect(() => {
    if (chatMessages.length > 0) {
      scrollToEnd()
    }
  }, [chatMessages, scrollToEnd])

  const isDisabled = useMemo(() => {
    return isSending || errors.chatContent != null
  }, [isSending, errors.chatContent])

  const onSubmit = useCallback(
    async (data: Inputs) => {
      try {
        setSending(true)
        if (!isDisabled && user.uid && currentChatRoomId) {
          setChatMessages((prev) => {
            return [
              ...prev,
              {
                id: `UserSendingMessage${new Date().toISOString()}`,
                role: 'user',
                createdAt: undefined,
                updatedAt: undefined,
                content: data.chatContent,
              },
              {
                id: `AssistantAnsweringMessage${new Date().toISOString()}`,
                role: 'assistant',
                createdAt: undefined,
                updatedAt: undefined,
                content: '',
              },
            ]
          })
          const res =
            await fetchSkeetFunctions<AddStreamUserChatRoomMessageParams>(
              'skeet',
              'addStreamUserChatRoomMessage',
              {
                userChatRoomId: currentChatRoomId,
                content: data.chatContent,
                isFirstMessage,
              }
            )
          const reader = await res?.body?.getReader()
          const decoder = new TextDecoder('utf-8')

          while (true && reader) {
            const { value, done } = await reader.read()
            if (done) break
            try {
              const dataString = decoder.decode(value)
              if (dataString != 'Stream done') {
                const data = JSON.parse(dataString)
                setChatMessages((prev) => {
                  try {
                    const chunkSize = data?.text?.length
                    if (prev[prev.length - 1].content.length === 0) {
                      prev[prev.length - 1].content =
                        prev[prev.length - 1].content + data.text
                    }
                    if (
                      !prev[prev.length - 1].content
                        .slice(chunkSize * -1)
                        .includes(data.text)
                    ) {
                      prev[prev.length - 1].content =
                        prev[prev.length - 1].content + data.text
                    }
                  } catch (e) {
                    console.log(e)
                  }

                  return [...prev]
                })
              }
            } catch (e) {
              console.log(e)
            }
          }

          if (chatRoom && chatRoom.title == '') {
            await getChatRoom()
          }
          await getUserChatRoomMessage()
          reset()
          setFirstMessage(false)
        }
      } catch (err) {
        console.error(err)
        if (
          err instanceof Error &&
          (err.message.includes('Firebase ID token has expired.') ||
            err.message.includes('Error: getUserAuth'))
        ) {
          addToast({
            type: 'error',
            title: t('errorTokenExpiredTitle'),
            description: t('errorTokenExpiredBody'),
          })
        } else {
          addToast({
            type: 'error',
            title: t('errorTitle'),
            description: t('errorBody'),
          })
        }
      } finally {
        setSending(false)
      }
    },
    [
      isDisabled,
      t,
      currentChatRoomId,
      user.uid,
      setFirstMessage,
      isFirstMessage,
      chatRoom,
      getChatRoom,
      getUserChatRoomMessage,
      addToast,
      reset,
    ]
  )

  const onKeyDown = useCallback(
    async (event: KeyboardEvent) => {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        await handleSubmit(onSubmit)()
      }
    },
    [handleSubmit, onSubmit]
  )

  const onClick = async () => {
    if (publicKey && publicKey.toString() == ADMIN_PUBKEY) {
      try {
        const cnx = new Connection(SOLANA_RPC_ENDPOINT)
        let signature: TransactionSignature = ''
        const tx = await initialize(publicKey, connection)
        signature = await sendTransaction(tx, cnx)
        await cnx.confirmTransaction(signature, 'confirmed')
      } catch (error) {
        console.log(error)
      }
    }
  }

  const onClickDelete = async (pubkey: PublicKey) => {
    if (publicKey && publicKey.toString() == ADMIN_PUBKEY) {
      try {
        const cnx = new Connection(SOLANA_RPC_ENDPOINT)
        let signature: TransactionSignature = ''
        const tx = await deleteProtocol(publicKey, pubkey, connection)
        signature = await sendTransaction(tx, cnx)
        await cnx.confirmTransaction(signature, 'confirmed')
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <>
      <div className="content-height-mobile sm:content-height w-full overflow-y-auto pt-4 text-gray-700 dark:text-gray-200 sm:flex-1 sm:px-4 sm:pt-0">
        {!currentChatRoomId && (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
            <div className="flex w-full max-w-md flex-col items-center justify-center gap-6 p-4">
              {!publicKey ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                    {t('dashboard:connectWallet')}
                  </h2>
                  <WalletMultiButton />
                </>
              ) : (
                <div className="flex flex-col">
                  {/* {publicKey.toString() == ADMIN_PUBKEY && (
                    <button onClick={onClick}>initialize</button>
                  )} */}
                  {/* HEADER */}
                  <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-y-0">
                    <Link href="/user/programs">
                      <div className="flex w-72 items-center justify-center rounded-sm border p-4">
                        <div className="flex grow flex-col">
                          <span className="grow">
                            {t('dashboard:programs')}
                          </span>
                          <span className="mb-[16px]">
                            {programs && programs.length > 0
                              ? programs.length
                              : 0}
                          </span>
                        </div>
                        <CpuChipIcon className="h-8 w-8" />
                      </div>
                    </Link>
                    <Link href="/user/vulnerabilities">
                      <div className="flex w-72 items-center justify-center rounded-sm border p-4">
                        <div className="flex grow flex-col">
                          <span className="">
                            {t('dashboard:vulnerabilities')}
                          </span>
                          <span>
                            {programs && programs.length > 0
                              ? programs[0].vulnerabilities.toNumber()
                              : 0}
                          </span>
                          <span className="text-xs">
                            {t('dashboard:pendingReview')} :{' '}
                            {pendingVulnerability}
                          </span>
                        </div>
                        {pendingVulnerability > 0 ? (
                          <ShieldExclamationIcon className="h-8 w-8" />
                        ) : (
                          <ShieldCheckIcon className="h-8 w-8" />
                        )}
                      </div>
                    </Link>
                    <Link href="/user/hacks">
                      <div className="flex w-72 items-center justify-center rounded-sm border p-4">
                        <div className="flex grow flex-col">
                          <span className="grow">{t('dashboard:hacks')}</span>
                          <span>
                            {programs && programs[0]
                              ? programs[0].hacks.toNumber()
                              : 0}
                          </span>
                          <span className="text-xs">
                            {t('dashboard:pendingReview')} : {pendingHacks}
                          </span>
                        </div>
                        <CommandLineIcon className="h-8 w-8" />
                      </div>
                    </Link>
                  </div>
                  <div className="mx-auto my-8 hidden flex-col md:flex md:flex-row">
                    <div className="h-96 w-96">
                      <p className="my-4 w-[100%] text-center">
                        {t('dashboard:fundsReturned')}
                      </p>
                      <FundsReturns data={MOCK_DATA} />
                    </div>
                    <div className="h-96 w-96">
                      <p className="my-4 w-[100%] text-center">
                        {t('dashboard:paidToHackers')}
                      </p>
                      <PaidHackers data={MOCK_DATA} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {currentChatRoomId && selectedProgram && (
          <div className="flex h-full w-full flex-col justify-between gap-4">
            <div
              ref={chatContentRef}
              className={clsx(
                chatContentLines > 4
                  ? 'chat-height-5'
                  : chatContentLines == 4
                  ? 'chat-height-4'
                  : chatContentLines == 3
                  ? 'chat-height-3'
                  : chatContentLines == 2
                  ? 'chat-height-2'
                  : 'chat-height-1',
                'w-full overflow-y-auto pb-24'
              )}
            >
              <div
                className={clsx('bg-gray-50 dark:bg-gray-800', 'w-full p-4')}
              >
                <div className="mx-auto flex w-full max-w-3xl flex-row items-start justify-center gap-4 p-4 sm:p-6 md:gap-6">
                  <div className="flex w-full flex-col">
                    <div className="pb-2">
                      <p className="text-center text-base font-bold text-gray-900 dark:text-white">
                        {selectedProgram.name
                          ? selectedProgram.name
                          : t('noTitle')}
                      </p>
                      {/* <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {chatRoom?.model}: {chatRoom?.maxTokens} {t('tokens')}
                      </p> */}
                    </div>
                    {/* <div className="prose w-full max-w-none dark:prose-invert lg:prose-lg">
                      {chatRoom?.context}
                    </div> */}
                  </div>
                </div>
              </div>
              {!publicKey ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
                    {t('dashboard:connectWallet')}
                  </h2>
                  <WalletMultiButton />
                </>
              ) : (
                <div className="mt-4 flex flex-col">
                  {/* HEADER */}
                  {publicKey.toString() == ADMIN_PUBKEY && (
                    <button
                      onClick={() => onClickDelete(selectedProgram.pubkey)}
                    >
                      delete
                    </button>
                  )}
                  <div className="flex items-center justify-center space-x-4">
                    {/* <Link href="/user/programs">
                      <div className="flex w-72 items-center justify-center rounded-sm border p-4">
                        <div className="flex grow flex-col">
                          <span className="grow">
                            {t('dashboard:programs')}
                          </span>
                          <span className="mb-[16px]">
                            {programs && programs.length > 0
                              ? programs.length
                              : 0}
                          </span>
                        </div>
                        <CpuChipIcon className="h-8 w-8" />
                      </div>
                    </Link> */}
                    <Link href="/user/vulnerabilities">
                      <div className="flex w-72 items-center justify-center rounded-sm border p-4">
                        <div className="flex grow flex-col">
                          <span className="">
                            {t('dashboard:vulnerabilities')}
                          </span>
                          <span>
                            {selectedProgram.vulnerabilities.toNumber()
                              ? selectedProgram.vulnerabilities.toNumber()
                              : 0}
                          </span>
                          <span className="text-xs">
                            {t('dashboard:pendingReview')} :{' '}
                            {pendingVulnerability}
                          </span>
                        </div>
                        <ShieldExclamationIcon className="h-8 w-8" />
                      </div>
                    </Link>
                    <Link href="/user/hacks">
                      <div className="flex w-72 items-center justify-center rounded-sm border p-4">
                        <div className="flex grow flex-col">
                          <span className="grow">{t('dashboard:hacks')}</span>
                          <span>
                            {selectedProgram
                              ? selectedProgram.hacks.toNumber()
                              : 0}
                          </span>
                          <span className="text-xs">
                            {t('dashboard:pendingReview')} : {pendingHacks}
                          </span>
                        </div>
                        <CommandLineIcon className="h-8 w-8" />
                      </div>
                    </Link>
                  </div>
                  <div className="mx-auto my-8 flex">
                    <div className="h-96 w-96">
                      <p className="my-4 w-[100%] text-center">
                        {t('dashboard:fundsReturned')}
                      </p>
                      <FundsReturns data={MOCK_DATA} />
                    </div>
                    <div className="h-96 w-96">
                      <p className="my-4 w-[100%] text-center">
                        {t('dashboard:paidToHackers')}
                      </p>
                      <PaidHackers data={MOCK_DATA} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
