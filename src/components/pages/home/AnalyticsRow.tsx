import { ANALYTICS_PUBKEY, SOLANA_RPC_ENDPOINT } from '@/constants'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function AnalyticsRow() {
  const { t } = useTranslation()

  const [protocols, setProtocols] = useState<number>(0)
  const [vulnerabilities, setVulnerabilities] = useState<number>(0)
  const [hacks, setHacks] = useState<number>(0)
  const [solRecovered, setSolRecovered] = useState<number>(0)
  const [solPaid, setSolPaid] = useState<number>(0)

  const connection = new Connection(SOLANA_RPC_ENDPOINT)
  useEffect(() => {
    const fetchAnalytics = async () => {
      return await connection.getAccountInfo(new PublicKey(ANALYTICS_PUBKEY))
    }
    fetchAnalytics()
      .then((response) => {
        if (response) {
          console.log(response.data)
          // pub admin: Pubkey, // 32
          // pub protocols: u64,
          // pub vulnerabilities: u64,
          // pub hacks: u64,
          // pub sol_recovered: u64,
          // pub sol_paid: u64,
          // pub fees: u64,
          // pub created_at: i64,

          // protocols
          console.log(
            'protocols : ',
            parseInt(response.data.readBigInt64LE(8 + 32).toString())
          )
          setProtocols(
            parseInt(response.data.readBigInt64LE(8 + 32).toString())
          )
          // vulnerabilities
          console.log(
            'vulnerabilities : ',
            parseInt(response.data.readBigInt64LE(8 + 32 + 8).toString())
          )
          setVulnerabilities(
            parseInt(response.data.readBigInt64LE(8 + 32 + 8).toString())
          )
          // hacks
          console.log(
            'hacks : ',
            parseInt(response.data.readBigInt64LE(8 + 32 + 8 + 8).toString())
          )
          setHacks(
            parseInt(response.data.readBigInt64LE(8 + 32 + 8 + 8).toString())
          )
          console.log(
            'sol recovered : ',
            parseInt(
              response.data.readBigInt64LE(8 + 32 + 8 + 8 + 8).toString()
            )
          )
          setSolRecovered(
            parseInt(
              response.data.readBigInt64LE(8 + 32 + 8 + 8 + 8).toString()
            ) / LAMPORTS_PER_SOL
          )
          console.log(
            'sol paid : ',
            parseInt(
              response.data.readBigInt64LE(8 + 32 + 8 + 8 + 8 + 8).toString()
            )
          )
          setSolPaid(
            parseInt(
              response.data.readBigInt64LE(8 + 32 + 8 + 8 + 8 + 8).toString()
            ) / LAMPORTS_PER_SOL
          )
        }
        // const analyticsMap = response.map(({ account }) => {
        //   return account
        // })
        // setAnalytics(analyticsMap)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])
  return (
    <div className="mt-6 lg:mt-8">
      <p className="mx-auto mt-1 max-w-2xl text-lg tracking-tight text-gray-700 dark:text-gray-200">
        {t('home:Analytics.help')}{' '}
        <span className="bg-gradient-to-tr from-[#9945FF] to-[#14F195] bg-clip-text font-bold text-transparent">
          {protocols}
        </span>{' '}
        {t('home:Analytics.protocols')} {t('home:Analytics.recover')}{' '}
        <span className="bg-gradient-to-tr from-[#9945FF] to-[#14F195] bg-clip-text font-bold text-transparent">
          {solRecovered}
        </span>{' '}
        sol {t('home:Analytics.across')}{' '}
        <span className="bg-gradient-to-tr from-[#9945FF] to-[#14F195] bg-clip-text font-bold text-transparent">
          {hacks}
        </span>{' '}
        {t('home:Analytics.hacks')} *
      </p>
      <p className="mx-auto mt-1 max-w-2xl text-lg tracking-tight text-gray-700 dark:text-gray-200">
        {t('home:Analytics.help')} {t('home:Analytics.flag')}{' '}
        <span className="bg-gradient-to-tr from-[#9945FF] to-[#14F195] bg-clip-text font-bold text-transparent">
          {vulnerabilities}
        </span>{' '}
        {t('home:Analytics.vulnerabilities')} *
      </p>
      <p className="mx-auto mt-1 max-w-2xl text-lg tracking-tight text-gray-700 dark:text-gray-200">
        {t('home:Analytics.hackers')}{' '}
        <span className="bg-gradient-to-tr from-[#9945FF] to-[#14F195] bg-clip-text font-bold text-transparent">
          {solPaid - solRecovered / 100}
        </span>{' '}
        sol {t('home:Analytics.safer')} *
      </p>
      <p className="mx-auto mt-2 max-w-2xl text-sm tracking-tight text-gray-700 dark:text-gray-200">
        * devnet numbers for demonstration purposes
      </p>
    </div>
  )
}
