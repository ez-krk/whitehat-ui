import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import useToastMessage from '@/hooks/useToastMessage'
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import { useTranslation } from 'next-i18next'
import DashboardMenu from './DashboardMenu'
import DashboardBox from './DashboardBox'
import { PROTOCOL_PDA, SOL_HACK_PDA, VULNERABILITY_PDA } from '@/types'
import { WhitehatContext } from '@/contexts/WhitehatContextProvider'
import { useWallet } from '@solana/wallet-adapter-react'

export default function DashboardScreen() {
  const { t } = useTranslation()

  const addToast = useToastMessage()

  const { publicKey } = useWallet()

  const [isNewChatModalOpen, setNewChatModalOpen] = useState(false)
  const [currentChatRoomId, setCurrentChatRoomId] = useState<string | null>(
    null
  )

  const [selectedProgram, setSelectedProgram] = useState<PROTOCOL_PDA | null>(
    null
  )

  const [chatList, setChatList] = useState<any[]>([])

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
        {publicKey && (
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
        )}

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
