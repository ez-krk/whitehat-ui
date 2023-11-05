import { useTranslation } from 'next-i18next'
import Link from '@/components/routing/Link'
import type { DocIndex } from '@/types/article'
import {
  HeartIcon,
  RocketLaunchIcon,
  ArrowUpRightIcon,
  ShieldCheckIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline'
import bluepill from '@/assets/img/props/bluepill.svg'
import redpill from '@/assets/img/props/redpill.svg'
import clsx from 'clsx'
import Image from 'next/image'

const actions = [
  {
    title: 'docs:actions.motivation.title',
    body: 'docs:actions.motivation.body',
    href: '/docs/general/motivation',
    icon: HeartIcon,
    iconForeground: 'text-pink-700',
    iconBackground: 'bg-pink-50',
  },
  {
    title: 'docs:actions.quickstart.title',
    body: 'docs:actions.quickstart.body',
    href: '/docs/general/quickstart',
    icon: RocketLaunchIcon,
    iconForeground: 'text-green-700',
    iconBackground: 'bg-green-50',
  },
  {
    title: 'docs:actions.protocols.title',
    body: 'docs:actions.quickstart.body',
    href: '/docs/general/quickstart',
    icon: ShieldCheckIcon,
    iconForeground: 'text-blue-700',
    iconBackground: 'bg-blue-50',
  },
  {
    title: 'docs:actions.hackers.title',
    body: 'docs:actions.quickstart.body',
    href: '/docs/general/quickstart',
    icon: CommandLineIcon,
    iconForeground: 'text-red-700',
    iconBackground: 'bg-red-50',
  },
]

export default function DocIndex() {
  const { t } = useTranslation()

  return (
    <>
      <div className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
              {t('docs:title')}
            </h2>
            <div className="flex items-center justify-between space-x-4">
              <Image
                src={bluepill}
                width={42}
                height={42}
                alt="pill"
                className="-rotate-135"
                id="bluePill"
              />
              <p className="mt-2 text-lg leading-8 text-gray-700 dark:text-gray-300">
                {t('docs:bluePill')}
              </p>
              <span className="inline-block align-middle" aria-hidden="true">
                &#8203;
              </span>
              <p className="mt-2 text-lg leading-8 text-gray-700 dark:text-gray-300">
                {t('docs:redPill')}
              </p>
              <Image
                src={redpill}
                width={42}
                height={42}
                alt="pill"
                className="-rotate-45"
                id="redPill"
              />
            </div>
          </div>
        </div>
        <div className="py-12">
          <div className="divide-y divide-gray-200 overflow-hidden bg-gray-200 shadow sm:grid sm:grid-cols-2 sm:gap-px sm:divide-y-0">
            {actions.map((action, actionIdx) => (
              <div
                key={action.title}
                className={clsx(
                  actionIdx === 0 ? '' : '',
                  actionIdx === 1 ? '' : '',
                  actionIdx === actions.length - 2 ? '' : '',
                  actionIdx === actions.length - 1 ? '' : '',
                  'group relative bg-gray-50 p-6 text-gray-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700 dark:hover:text-gray-200'
                )}
              >
                <div>
                  <span
                    className={clsx(
                      action.iconBackground,
                      action.iconForeground,
                      'inline-flex p-3 ring-4 ring-white'
                    )}
                  >
                    <action.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-8">
                  <h3 className="text-lg font-medium">
                    <Link href={action.href} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {t(action.title)}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-200">
                    {t(action.body)}
                  </p>
                </div>
                <span
                  className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400"
                  aria-hidden="true"
                >
                  <ArrowUpRightIcon className="h-6 w-6" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
