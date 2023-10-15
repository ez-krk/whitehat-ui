import Container from '@/components/common/atoms/Container'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import nextjsLogo from '@/assets/img/logo/projects/nextjs.svg'
// import i18nextLogo from '@/assets/img/logo/projects/i18next.webp'
// import recoilLogo from '@/assets/img/logo/projects/recoil.svg'
// import eslintLogo from '@/assets/img/logo/projects/eslint.svg'
// import prettierLogo from '@/assets/img/logo/projects/prettier.png'
import firebaseLogo from '@/assets/img/logo/projects/Firebase.svg'
import tailwindcssLogo from '@/assets/img/logo/projects/tailwindcss.svg'
import typescriptLogo from '@/assets/img/logo/projects/TypeScriptHorizontal.svg'
import solanaLogo from '@/assets/img/logo/projects/solana.svg'
import anchorLogo from '@/assets/img/logo/projects/anchor.png'
import heliusLogo from '@/assets/img/logo/projects/helius.png'
import rustLogo from '@/assets/img/logo/projects/rust.svg'
import skeetLogo from '@/assets/img/logo/projects/skeet.svg'
import Button from '@/components/common/atoms/Button'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { ANALYTICS_PUBKEY, PROGRAM_ID, SOLANA_RPC_ENDPOINT } from '@/constants'
import { useWallet } from '@solana/wallet-adapter-react'

export default function HomeHeroRow() {
  const { t } = useTranslation()
  const { publicKey } = useWallet()

  const [protocols, setProtocols] = useState<number>(0)
  const [vulnerabilities, setVulnerabilities] = useState<number>(0)
  const [hacks, setHacks] = useState<number>(0)
  const [solRecovered, setSolRecovered] = useState<number>(0)
  const [solPaid, setSolPaid] = useState<number>(0)

  const connection = new Connection(SOLANA_RPC_ENDPOINT)

  // const program = useMemo(
  //   () => new Program(IDL, PROGRAM_ID as Address, connection),
  //   [connection]
  // )

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
    <>
      <Container className="pb-40 pt-24 text-center lg:pb-64 lg:pt-40">
        <h1 className="font-display mx-auto max-w-4xl text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-7xl">
          whitehat.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-gray-700 dark:text-gray-200">
          {t('home:HeroRow.line')}
        </p>
        <p className="mx-auto mt-1 max-w-2xl text-lg tracking-tight text-gray-700 dark:text-gray-200">
          {t('home:HeroRow.body')}
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <Button href="/auth/login" className="">
            {t('getStarted')}
          </Button>
          <Button
            href="https://github.com/3uild-3thos/whitehat"
            variant="outline"
            className=""
            target="_blank"
            rel="noreferrer"
          >
            github
          </Button>
        </div>
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
        <div className="mt-8 lg:mt-10">
          <p className="mx-auto mt-1 max-w-2xl text-lg tracking-tight text-gray-700 dark:text-gray-200">
            our tech stack :
          </p>
          <ul
            role="list"
            className="mt-8 flex flex-col items-center justify-center gap-x-8 gap-y-10 sm:gap-x-0 xl:flex-row xl:gap-x-12 xl:gap-y-0"
          >
            {[
              [
                {
                  name: 'Solana',
                  logo: solanaLogo,
                  link: 'https://solana.com/',
                },
                {
                  name: 'Anchorlang',
                  logo: anchorLogo,
                  link: 'https://anchor-lang.com/',
                },
                {
                  name: 'Helius',
                  logo: heliusLogo,
                  link: 'https://helius.xyz/',
                },
                {
                  name: 'Rust',
                  logo: rustLogo,
                  link: 'https://nextjs.org/',
                },
                {
                  name: 'Skeet',
                  logo: skeetLogo,
                  link: 'https://skeet.dev/',
                },
                // {
                //   name: 'WBA',
                //   logo: wbaLogo,
                //   link: 'https://web3builders.dev/',
                // },
              ],
              [
                {
                  name: 'Next.js',
                  logo: nextjsLogo,
                  link: 'https://nextjs.org/',
                },
                {
                  name: 'Firebase',
                  logo: firebaseLogo,
                  link: 'https://firebase.google.com/',
                },
                {
                  name: 'TypeScript',
                  logo: typescriptLogo,
                  link: 'https://www.typescriptlang.org/',
                },
                {
                  name: 'Tailwind',
                  logo: tailwindcssLogo,
                  link: 'https://tailwindcss.com/',
                },
              ],
            ].map((group, groupIndex) => (
              <li key={`HeroRowLogoCloudList${groupIndex}`}>
                <ul
                  role="list"
                  className="flex flex-row items-center gap-x-6 sm:gap-x-12"
                >
                  {group.map((project) => (
                    <li key={project.name} className="flex">
                      <a href={project.link} target="_blank" rel="noreferrer">
                        <Image
                          src={project.logo}
                          alt={project.name}
                          className={clsx(
                            'hover:opacity-60 dark:grayscale',
                            project.name === 'React'
                              ? 'dark:invert-0'
                              : 'dark:invert'
                          )}
                          width={168}
                          height={48}
                          unoptimized
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </>
  )
}
