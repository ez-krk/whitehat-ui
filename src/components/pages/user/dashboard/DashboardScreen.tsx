import ChatMenu, { ChatRoom } from '@/components/pages/user/chat/ChatMenu'
import ChatBox from '@/components/pages/user/chat/ChatBox'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
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
import { PROTOCOL_PDA, SOL_HACK_PDA, VULNERABILITY_PDA } from '@/types'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Address, Program } from '@coral-xyz/anchor'
import { IDL } from '@/idl'
import { PROGRAM_ID } from '@/constants'
import Spinner from '@/components/utils/Spinner'
import { WhitehatContext } from '@/contexts/WhitehatContextProvider'

export default function DashboardScreen() {
  const { t } = useTranslation()

  const user = useRecoilValue(userState)
  const addToast = useToastMessage()

  const [loading, setLoading] = useState(true)

  const [isNewChatModalOpen, setNewChatModalOpen] = useState(false)
  const [currentChatRoomId, setCurrentChatRoomId] = useState<string | null>(
    null
  )

  const [selectedProgram, setSelectedProgram] = useState<PROTOCOL_PDA | null>(
    null
  )

  const [chatList, setChatList] = useState<ChatRoom[]>([])

  const [lastChat, setLastChat] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [isDataLoading, setDataLoading] = useState(false)

  const {
    program,
    programs,
    setPrograms,
    vulnerability,
    setVulnerability,
    pendingVulnerability,
    solHacks,
    setSolHacks,
    pendingHacks,
  } = useContext(WhitehatContext)

  return (
    <>
      <div className="content-height flex w-full flex-col items-start justify-start overflow-auto sm:flex-row">
        <DashboardMenu
          program={program}
          programs={programs}
          setPrograms={setPrograms}
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
        />
        <DashboardBox
          programs={programs}
          selectedProgram={selectedProgram}
          pendingVulnerability={pendingVulnerability}
          pendingHacks={pendingHacks}
          currentChatRoomId={currentChatRoomId}
        />
      </div>
    </>
  )
}
