import ChatMenu, { ChatRoom } from '@/components/pages/user/chat/ChatMenu'
import ChatBox from '@/components/pages/user/chat/ChatBox'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { userState } from '@/store/user'
import { useRecoilValue } from 'recoil'
import useToastMessage from '@/hooks/useToastMessage'
import {
  DocumentData,
  QueryDocumentSnapshot,
  limit,
  orderBy,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useTranslation } from 'next-i18next'
import { UserChatRoom, genUserChatRoomPath } from '@/types/models'
import { query } from '@/lib/skeet/firestore'
import DashboardMenu from './DashboardMenu'
import DashboardBox from './DashboardBox'
import { PROTOCOL_PDA } from '@/types'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Address, Program } from '@coral-xyz/anchor'
import { IDL } from '@/idl'
import { PROGRAM_ID } from '@/constants'

export default function DashboardScreen() {
  const { t } = useTranslation()
  const { publicKey } = useWallet()
  const connection = useConnection()
  const user = useRecoilValue(userState)
  const addToast = useToastMessage()

  const [isNewChatModalOpen, setNewChatModalOpen] = useState(false)
  const [currentChatRoomId, setCurrentChatRoomId] = useState<string | null>(
    null
  )

  const [programs, setPrograms] = useState<PROTOCOL_PDA[]>([])
  const [selectedProgram, setSelectedProgram] = useState<PROTOCOL_PDA | null>(
    null
  )
  const [chatList, setChatList] = useState<ChatRoom[]>([])

  const [lastChat, setLastChat] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [isDataLoading, setDataLoading] = useState(false)

  const program = useMemo(
    () => new Program(IDL, PROGRAM_ID as Address, connection),
    [connection]
  )

  const getChatRooms = useCallback(async () => {
    if (db && user.uid) {
      try {
        setDataLoading(true)

        const querySnapshot = await query<UserChatRoom>(
          db,
          genUserChatRoomPath(user.uid),
          [orderBy('createdAt', 'desc'), limit(15)]
        )
        const list: ChatRoom[] = []
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          list.push({ id: doc.id, ...data } as ChatRoom)
        })
        // console.log(list)
        setChatList(list)
        setLastChat(querySnapshot.docs[querySnapshot.docs.length - 1])
      } catch (err) {
        console.log(err)
        if (err instanceof Error && err.message.includes('permission-denied')) {
          addToast({
            type: 'error',
            title: t('errorTokenExpiredTitle') ?? 'Token Expired.',
            description: t('errorTokenExpiredBody') ?? 'Please sign in again.',
          })
        } else {
          addToast({
            type: 'error',
            title: t('errorTitle') ?? 'Error',
            description:
              t('errorBody') ?? 'Something went wrong... Please try it again.',
          })
        }
      } finally {
        setDataLoading(false)
      }
    }
  }, [user.uid, setDataLoading, addToast, t])

  useEffect(() => {
    void (async () => {
      try {
        await getChatRooms()
      } catch (e) {
        console.error(e)
      }
    })()
  }, [getChatRooms])

  useEffect(() => {
    if (publicKey) {
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
          // console.log(response)
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
      <div className="content-height flex w-full flex-col items-start justify-start overflow-auto sm:flex-row">
        <DashboardMenu
          programs={programs}
          setSelectedProgram={setSelectedProgram}
          isNewChatModalOpen={isNewChatModalOpen}
          setNewChatModalOpen={setNewChatModalOpen}
          currentChatRoomId={currentChatRoomId}
          setCurrentChatRoomId={setCurrentChatRoomId}
          chatList={chatList}
          setChatList={setChatList}
          lastChat={lastChat}
          setLastChat={setLastChat}
          isDataLoading={isDataLoading}
          setDataLoading={setDataLoading}
          getChatRooms={getChatRooms}
        />
        <DashboardBox
          programs={programs}
          selectedProgram={selectedProgram}
          setNewChatModalOpen={setNewChatModalOpen}
          currentChatRoomId={currentChatRoomId}
        />
      </div>
    </>
  )
}
