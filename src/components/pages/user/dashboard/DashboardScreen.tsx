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
import { PROTOCOL_PDA, VULNERABILITY_PDA } from '@/types'
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

  const [programs, setPrograms] = useState<PROTOCOL_PDA[] | null>(null)
  const [selectedProgram, setSelectedProgram] = useState<PROTOCOL_PDA | null>(
    null
  )

  const [vulnerabilities, setVulnerabilities] = useState<
    VULNERABILITY_PDA[] | null
  >(null)

  const [pendingVulnerabilities, setPendingVulnerabilities] =
    useState<number>(0)

  const [chatList, setChatList] = useState<ChatRoom[]>([])

  const [lastChat, setLastChat] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const [isDataLoading, setDataLoading] = useState(false)

  const program = useMemo(
    () => new Program(IDL, PROGRAM_ID as Address, connection),
    [connection]
  )

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

  useEffect(() => {
    if (publicKey && programs && programs.length > 0) {
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
        //
        // ()
      }
      fetchVulnerabilities()
        .then((response) => {
          console.log(response)
          // @ts-ignore
          const vulnerabilitiesMap = response.map(({ account, publicKey }) => {
            const result = account
            account.pubkey = publicKey
            console.log(result)
            return result
          })
          console.log('vulnerabilities', vulnerabilitiesMap)
          setVulnerabilities(vulnerabilitiesMap)
        })
        .catch((error) => console.log(error))
    }
  }, [programs, publicKey])

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
        />
        <DashboardBox
          programs={programs}
          selectedProgram={selectedProgram}
          vulnerabilities={vulnerabilities}
          pendingVulnerabilities={pendingVulnerabilities}
          setNewChatModalOpen={setNewChatModalOpen}
          currentChatRoomId={currentChatRoomId}
        />
      </div>
    </>
  )
}
