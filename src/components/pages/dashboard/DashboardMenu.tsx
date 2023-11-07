import { useTranslation } from 'next-i18next'
import clsx from 'clsx'
import {
  ChatBubbleLeftIcon,
  GlobeAltIcon,
  PlusCircleIcon,
  QueueListIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import LogoHorizontal from '@/components/common/atoms/LogoHorizontal'
import {
  Fragment,
  useCallback,
  useMemo,
  useRef,
  useState,
  KeyboardEvent,
  useContext,
} from 'react'
import { useRecoilValue } from 'recoil'
import { userState } from '@/store/user'
import { GPTModel, titleSchema, percentSchema } from '@/utils/form'

import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore'
import { format } from 'date-fns'
import useToastMessage from '@/hooks/useToastMessage'
import { Dialog, Transition } from '@headlessui/react'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerProtocol } from '@/utils/api/instructions/registerProtocol'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { SOLANA_RPC_ENDPOINT } from '@/constants'
import { Connection, PublicKey, TransactionSignature } from '@solana/web3.js'
import { PROTOCOL_PDA } from '@/types'
import { Program } from '@coral-xyz/anchor'
import { IDL } from '@/idl'
import { WhitehatContext } from '@/contexts/WhitehatContextProvider'

export type ChatRoom = {
  id: string
  createdAt: Timestamp
  updatedAt: Timestamp
  model: GPTModel
  maxTokens: number
  temperature: number
  context: string
  title: string
}

const schema = z.object({
  name: titleSchema,
  percent: percentSchema,
})

type Inputs = z.infer<typeof schema>

type Props = {
  program: Program<IDL> | null
  programs: PROTOCOL_PDA[] | null
  setPrograms: React.Dispatch<
    React.SetStateAction<PROTOCOL_PDA[] | null>
  > | null
  setSelectedProgram: React.Dispatch<React.SetStateAction<PROTOCOL_PDA | null>>
  isNewChatModalOpen: boolean
  setNewChatModalOpen: (_value: boolean) => void
  currentChatRoomId: string | null
  setCurrentChatRoomId: (_value: string | null) => void
  chatList: ChatRoom[]
  setChatList: (_value: ChatRoom[]) => void
  lastChat: QueryDocumentSnapshot<DocumentData> | null
  setLastChat: (_value: QueryDocumentSnapshot<DocumentData> | null) => void
  isDataLoading: boolean
  setDataLoading: (_value: boolean) => void
}

export default function DashboardMenu({
  program,
  programs,
  setPrograms,
  setSelectedProgram,
  isNewChatModalOpen,
  setNewChatModalOpen,
  currentChatRoomId,
  setCurrentChatRoomId,
  chatList,
}: Props) {
  const { t, i18n } = useTranslation()
  const [isCreateLoading, setCreateLoading] = useState(false)
  const [isChatListModalOpen, setChatListModalOpen] = useState(false)
  const addToast = useToastMessage()
  const { publicKey, sendTransaction } = useWallet()
  const connection = useConnection()
  const { keypair } = useContext(WhitehatContext)
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      percent: 10,
    },
  })

  const chatMenuRef = useRef<HTMLDivElement>(null)
  const chatMenuRefMobile = useRef<HTMLDivElement>(null)

  const isDisabled = useMemo(() => {
    return isCreateLoading || errors.name != null || errors.percent != null
  }, [isCreateLoading, errors.name, errors.percent])

  const onSubmit = useCallback(
    async (data: Inputs) => {
      try {
        setCreateLoading(true)
        if (!isDisabled && publicKey && program && keypair) {
          const tx = await registerProtocol(
            publicKey,
            keypair.publicKey,
            data.name,
            data.percent,
            connection
          )

          const cnx = new Connection(SOLANA_RPC_ENDPOINT)
          let signature: TransactionSignature = ''
          signature = await sendTransaction(tx, cnx)
          await cnx.confirmTransaction(signature, 'confirmed')

          addToast({
            type: 'success',
            title: t(':programCreatedSuccessTitle'),
            description: t('dashboard:programCreatedSuccessBody'),
          })

          const protocol = PublicKey.findProgramAddressSync(
            [Buffer.from('protocol'), publicKey.toBytes()],
            program.programId
          )[0]

          // @ts-ignore
          const { account } = await program.account.protocol.fetch(protocol)
          console.log(account)
          // setCurrentChatRoomId(docRef.id)
          // setPrograms((prevState) => ({
          //   ...prevState,
          // }))
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
        setNewChatModalOpen(false)
        setCreateLoading(false)
      }
    },
    [isDisabled, publicKey, addToast, t, setNewChatModalOpen]
  )

  const onKeyDown = useCallback(
    async (event: KeyboardEvent) => {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        await handleSubmit(onSubmit)()
      }
    },
    [handleSubmit, onSubmit]
  )

  return (
    <>
      <div className="flex w-full flex-col items-center justify-start pb-4 sm:w-64 sm:pb-0">
        <div className="w-full sm:hidden">
          <div className="flex w-full flex-row items-center justify-center">
            {/* <button
              onClick={() => {
                setChatListModalOpen(true)
              }}
              className={clsx('flex flex-row items-center justify-center')}
            >
              <QueueListIcon
                className={clsx(
                  'h-6 w-6 flex-shrink-0 text-gray-900 dark:text-white'
                )}
              />{' '}
              aaa
            </button> */}
            {/* <div className="flex-grow" />
            <h2 className="text-center font-bold">{t('dashboard:title')}</h2>
            <button
              onClick={() => {
                setNewChatModalOpen(true)
              }}
              className={clsx('flex flex-row items-center justify-center')}
            >
              <PlusCircleIcon
                className={clsx(
                  'h-6 w-6 flex-shrink-0 text-gray-900 dark:text-white'
                )}
              />
            </button>
            <button
              onClick={() => {
                setNewChatModalOpen(true)
              }}
              className={clsx('flex flex-row items-center justify-center')}
            >
              <PlusCircleIcon
                className={clsx(
                  'h-6 w-6 flex-shrink-0 text-gray-900 dark:text-white'
                )}
              />
            </button> */}
          </div>
        </div>
        <div
          ref={chatMenuRef}
          // onScroll={handleScroll}
          className="content-height hidden w-full overflow-auto p-2 sm:flex"
        >
          <div className="flex w-full flex-col gap-6">
            <button
              onClick={() => {
                setCurrentChatRoomId(null)
              }}
              className={clsx(
                'flex w-full flex-row items-center justify-center bg-gray-900 px-3 py-2 dark:bg-gray-600'
              )}
            >
              <GlobeAltIcon className="mr-3 h-6 w-6 flex-shrink-0 text-white" />
              <span className="text-center text-lg font-bold text-white">
                {t('dashboard:global')}
              </span>
            </button>
            <button
              onClick={() => {
                setNewChatModalOpen(true)
              }}
              className={clsx(
                'flex w-full flex-row items-center justify-center bg-gray-900 px-3 py-2 dark:bg-gray-600'
              )}
            >
              <PlusCircleIcon className="mr-3 h-6 w-6 flex-shrink-0 text-white" />
              <span className="text-center text-lg font-bold text-white">
                {t('dashboard:addProgram')}
              </span>
            </button>
            <div className="flex flex-col gap-3 pb-20">
              {programs &&
                programs.map((program) => (
                  <div
                    onClick={() => {
                      setCurrentChatRoomId(program.pubkey.toString())
                      setSelectedProgram(program)
                    }}
                    key={`ChatMenu Desktop ${program.pubkey.toString()}`}
                    className={clsx(
                      currentChatRoomId === program.pubkey.toString() &&
                        'border-2 border-gray-900 dark:border-gray-50',
                      'flex flex-row items-center justify-center gap-2 bg-gray-50 p-2 text-center hover:cursor-pointer dark:bg-gray-800'
                    )}
                  >
                    {/* <ChatBubbleLeftIcon
                    className={clsx(
                      'h-5 w-5 flex-shrink-0 text-gray-900 dark:text-white'
                    )}
                  /> */}
                    <div className="flex flex-col gap-2">
                      {program.name !== '' ? (
                        <p className="font-medium text-gray-900 dark:text-white">
                          {program.name.length > 20
                            ? `${program.name.slice(0, 20)} ...`
                            : program.name}
                        </p>
                      ) : (
                        <p className="font-light italic text-gray-600 dark:text-gray-300">
                          {t('noTitle')}
                        </p>
                      )}
                      <p className="text-sm font-light text-gray-700 dark:text-gray-200">
                        {format(
                          new Date(program.createdAt * 1000),
                          'yyyy-MM-dd HH:mm'
                        )}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <Transition appear show={isNewChatModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setNewChatModalOpen(false)}
        >
          <div className="text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="my-8 inline-block w-full max-w-xl -translate-y-10 transform overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-900">
                <div className="flex w-full flex-col pb-8">
                  <div className="flex flex-row items-center justify-center p-4">
                    <LogoHorizontal className="w-24" />
                    <div className="flex-grow" />
                    <button
                      onClick={() => {
                        setNewChatModalOpen(false)
                      }}
                      className="h-5 w-5 text-gray-900 hover:cursor-pointer hover:text-gray-700 dark:text-gray-50 dark:hover:text-gray-200"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex flex-grow flex-col gap-2">
                    <p className="text-center text-lg font-bold">
                      {t('dashboard:addProgram')}
                    </p>
                    <div className="w-full sm:mx-auto sm:max-w-xl">
                      <div className="gap-6  sm:px-10">
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <div className="flex flex-col gap-6  py-6 sm:px-10">
                            <div>
                              <p className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-50">
                                {t('dashboard:protocolName')}
                                {errors.name && (
                                  <span className="text-xs text-red-500 dark:text-red-300">
                                    {' : '}
                                    {t('chat:modelErrorText')}
                                  </span>
                                )}
                              </p>
                              <div className="mt-2">
                                <Controller
                                  name="name"
                                  control={control}
                                  render={({ field }) => (
                                    <input
                                      {...field}
                                      onKeyDown={onKeyDown}
                                      className="w-full border-2 border-gray-900 p-3 text-lg font-bold text-gray-900 dark:border-gray-50 dark:bg-gray-800 dark:text-white sm:leading-6"
                                    />
                                  )}
                                />
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-50">
                                {t('dashboard:percent')}
                                {errors.percent && (
                                  <span className="text-xs text-red-500 dark:text-red-300">
                                    {' : '}
                                    {t('dashboard:errorPercent')}
                                  </span>
                                )}
                              </p>
                              <div className="mt-2">
                                <Controller
                                  name="percent"
                                  control={control}
                                  render={({ field }) => (
                                    <>
                                      <input
                                        {...field}
                                        type="range"
                                        min={0}
                                        max={100}
                                        step={1}
                                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                                        onChange={(e) =>
                                          field.onChange(
                                            e.target.value
                                              ? parseFloat(e.target.value)
                                              : 0
                                          )
                                        }
                                      />
                                      <p className="text-bold text-gray-900 dark:text-white">
                                        {field.value} %
                                      </p>
                                    </>
                                  )}
                                />
                              </div>
                            </div>
                            <div></div>
                            <div>
                              <button
                                type="submit"
                                disabled={isDisabled}
                                className={clsx(
                                  isDisabled
                                    ? 'cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                    : 'bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200',
                                  'w-full px-3 py-2 text-center text-lg font-bold'
                                )}
                              >
                                {t('dashboard:addProgram')}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isChatListModalOpen} as={Fragment}>
        <Dialog
          as="div"
          ref={chatMenuRefMobile}
          // onScroll={handleScrollMobile}
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setChatListModalOpen(false)}
        >
          <div className=" text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="my-8 inline-block w-full max-w-xl -translate-y-10 transform overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-900">
                <div className="flex w-full flex-col bg-white pb-12 dark:bg-gray-900">
                  <div className="flex flex-row items-center justify-center p-4">
                    <LogoHorizontal className="w-24" />
                    <div className="flex-grow" />
                    <button
                      onClick={() => {
                        setChatListModalOpen(false)
                      }}
                      className="h-5 w-5 hover:cursor-pointer"
                    >
                      <XMarkIcon className="h-5 w-5 text-gray-900 hover:text-gray-800 dark:text-gray-50 dark:hover:text-gray-100" />
                    </button>
                  </div>
                  <div className="flex w-full flex-grow flex-col gap-6">
                    <p className="text-center text-lg font-bold">
                      {t('chat:chatList')}
                    </p>
                    <div className="w-full sm:mx-auto sm:max-w-xl">
                      <div className="flex flex-col gap-3 pb-20 sm:px-10">
                        {chatList.map((chat) => (
                          <div
                            onClick={() => {
                              setCurrentChatRoomId(chat.id)
                              setChatListModalOpen(false)
                            }}
                            key={`ChatMenu Mobile ${chat.id}`}
                            className={clsx(
                              currentChatRoomId === chat.id &&
                                'border-2 border-gray-900 dark:border-gray-50',
                              'flex flex-row items-start justify-start gap-2 bg-gray-50 p-2 hover:cursor-pointer dark:bg-gray-800'
                            )}
                          >
                            <ChatBubbleLeftIcon
                              className={clsx(
                                'h-5 w-5 flex-shrink-0 text-gray-900 dark:text-white'
                              )}
                            />
                            <div className="flex flex-col gap-2">
                              {chat.title !== '' ? (
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {chat.title.length > 20
                                    ? `${chat.title.slice(0, 20)} ...`
                                    : chat.title}
                                </p>
                              ) : (
                                <p className="font-light italic text-gray-600 dark:text-gray-300">
                                  {t('noTitle')}
                                </p>
                              )}

                              <p className="text-sm font-light text-gray-700 dark:text-gray-200">
                                {format(
                                  chat.createdAt.toDate(),
                                  'yyyy-MM-dd HH:mm'
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
