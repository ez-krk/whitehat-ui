import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import clsx from 'clsx'
import Container from '@/components/common/atoms/Container'
import Button from '@/components/common/atoms/Button'
import nextjsLogo from '@/assets/img/logo/projects/nextjs.svg'
// import i18nextLogo from '@/assets/img/logo/projects/i18next.webp'
// import recoilLogo from '@/assets/img/logo/projects/recoil.svg'
// import eslintLogo from '@/assets/img/logo/projects/eslint.svg'
// import prettierLogo from '@/assets/img/logo/projects/prettier.png'
import tailwindcssLogo from '@/assets/img/logo/projects/tailwindcss.svg'
import typescriptLogo from '@/assets/img/logo/projects/TypeScriptHorizontal.svg'
import solanaLogo from '@/assets/img/logo/projects/solana.svg'
import anchorLogo from '@/assets/img/logo/projects/anchor.png'
import heliusLogo from '@/assets/img/logo/projects/helius.png'
import rustLogo from '@/assets/img/logo/projects/rust.svg'
import skeetLogo from '@/assets/img/logo/projects/skeet.svg'
import bluepill from '@/assets/img/props/bluepill.svg'
import redpill from '@/assets/img/props/redpill.svg'
import AnalyticsRow from './AnalyticsRow'

export default function HomeHeroRow() {
  const { t } = useTranslation()
  const { publicKey } = useWallet()

  return (
    <>
      <Container className="pb-40 pt-24 text-center lg:pb-64 lg:pt-40">
        <h1 className="font-display mx-auto max-w-4xl text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-7xl">
          whitehat
        </h1>
        {/* <div className="mx-auto mt-8 flex items-center justify-between md:w-[50%]">
          <Image
            src={bluepill}
            width={42}
            height={42}
            alt="pill"
            className="-rotate-135"
            id="bluePill"
          />
          <p className="mt-2 text-lg leading-8 text-gray-700 dark:text-gray-300">
            {t('home:HeroRow:bluePill')}
          </p>
          <span className="inline-block align-middle" aria-hidden="true">
            &#8203;
          </span>
          <p className="mt-2 text-lg leading-8 text-gray-700 dark:text-gray-300">
            {t('home:HeroRow:redPill')}
          </p>
          <Image
            src={redpill}
            width={42}
            height={42}
            alt="pill"
            className="-rotate-45"
            id="redPill"
          />
        </div> */}
        {/* <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-gray-700 dark:text-gray-200">
          {t('home:HeroRow.line')}
        </p> */}
        <p className="mx-auto mt-4 max-w-2xl text-xl font-bold tracking-tight text-gray-700 dark:text-gray-200">
          {t('home:HeroRow.body')}
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <Button href="/auth/login" className="">
            {t('home:HeroRow.getHacked')}
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
        <AnalyticsRow />
        <div className="mt-8 lg:mt-10">
          <p className="mx-auto mt-1 max-w-2xl text-2xl tracking-tight text-gray-700 dark:text-gray-200">
            {t('home:Technologies.technologies')}
          </p>
          <ul
            role="list"
            className="mt-4 flex flex-col items-center justify-center gap-x-8 gap-y-10 sm:gap-x-0 xl:flex-row xl:gap-x-12 xl:gap-y-0"
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
                  link: 'https://www.rust-lang.org/',
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
