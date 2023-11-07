import { useState } from 'react'
import useToastMessage from '@/hooks/useToastMessage'
import { useTranslation } from 'next-i18next'
import VulnerabilitiesBox from './VulnerabilitiesBox'

export default function VulnerabilitiesScreen() {
  const { t } = useTranslation()
  const [currentChatRoomId, setCurrentChatRoomId] = useState<string | null>(
    null
  )

  const addToast = useToastMessage()

  return (
    <>
      <div className="content-height flex w-full flex-col items-start justify-start overflow-auto sm:flex-row">
        <VulnerabilitiesBox currentChatRoomId={currentChatRoomId} />
      </div>
    </>
  )
}
