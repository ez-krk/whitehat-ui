import { useCallback, useEffect, useState } from 'react'
import { userState } from '@/store/user'
import { useRecoilValue } from 'recoil'
import useToastMessage from '@/hooks/useToastMessage'
import { useTranslation } from 'next-i18next'
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
