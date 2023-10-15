import ChatMenu, { ChatRoom } from '@/components/pages/user/chat/ChatMenu'
import ChatBox from '@/components/pages/user/chat/ChatBox'
import { useCallback, useEffect, useState } from 'react'
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
import DashboardBox from './HacksBox'
import { PROTOCOL_PDA } from '@/types'
import HacksBox from './HacksBox'

export default function DashboardScreen() {
  const { t } = useTranslation()
  const [isNewChatModalOpen, setNewChatModalOpen] = useState(false)
  const [currentChatRoomId, setCurrentChatRoomId] = useState<string | null>(
    null
  )

  const user = useRecoilValue(userState)

  const [programs, setPrograms] = useState<PROTOCOL_PDA[]>([])

  return (
    <>
      <div className="content-height flex w-full flex-col items-start justify-start overflow-auto sm:flex-row">
        <HacksBox currentChatRoomId={currentChatRoomId} />
      </div>
    </>
  )
}
