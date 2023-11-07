import type { ReactNode } from 'react'
import { useMemo, useCallback, useEffect, useState, Fragment } from 'react'
import { Transition, Dialog, Menu } from '@headlessui/react'
import { XMarkIcon, Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { userHeaderNav, userMenuNav } from '@/config/navs'
import { useTranslation } from 'next-i18next'
import Link from '@/components/routing/Link'
import LogoNavbarLink from '@/components/common/atoms/LogoNavbarLink'
import LogoHorizontalLink from '@/components/common/atoms/LogoHorizontalLink'
import Wallet from '@/components/common/atoms/Wallet'
import { useWallet } from '@solana/wallet-adapter-react'

type Props = {
  children: ReactNode
}

const mainContentId = 'userMainContent'

export default function UserLayout({ children }: Props) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { t } = useTranslation()
  const { publicKey } = useWallet()

  const asPathWithoutLang = useMemo(() => {
    return router.asPath.replace('/ja/', '/').replace('/en/', '/')
  }, [router.asPath])

  const resetWindowScrollPosition = useCallback(() => {
    const element = document.getElementById(mainContentId)
    if (element) {
      element.scrollIntoView({ block: 'start' })
    }
  }, [])
  useEffect(() => {
    void (async () => {
      try {
        setSidebarOpen(false)
        await new Promise((resolve) => setTimeout(resolve, 100))
        if (!router.asPath.includes('#')) {
          resetWindowScrollPosition()
        }
      } catch (e) {
        console.error(e)
      }
    })()
  }, [router.asPath, resetWindowScrollPosition])

  return (
    <>
      <div className="relative h-full min-h-screen w-full bg-white dark:bg-gray-900">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 bg-white dark:bg-gray-900 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900 bg-opacity-90" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white pb-4 pt-5 dark:bg-gray-900">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute right-0 top-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex h-10 w-10 items-center justify-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex flex-shrink-0 items-center px-4">
                    <LogoNavbarLink href="/" className="h-8 w-auto sm:h-10" />
                  </div>
                  <div className="mt-5 h-0 flex-1 overflow-y-auto">
                    <nav className="space-y-1 px-2">
                      {userMenuNav.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href ?? ''}
                          className={clsx(
                            asPathWithoutLang === item.href
                              ? 'bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white'
                              : 'text-gray-700 hover:bg-gray-50 dark:text-gray-50 dark:hover:bg-gray-800',
                            'group flex items-center px-2 py-2 text-base font-medium'
                          )}
                        >
                          {item.icon && (
                            <item.icon
                              className={clsx(
                                asPathWithoutLang === item.href
                                  ? 'text-gray-900 dark:text-white'
                                  : 'text-gray-700 dark:text-gray-50',
                                'mr-4 h-6 w-6 flex-shrink-0'
                              )}
                              aria-hidden="true"
                            />
                          )}
                          {t(item.name)}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="w-14 flex-shrink-0" aria-hidden="true" />
            </div>
          </Dialog>
        </Transition.Root>

        <div className="z-10 hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-grow flex-col overflow-y-auto break-words bg-white pt-5 scrollbar-hide dark:bg-gray-900">
            <div className="flex w-[100vw] items-center overflow-y-visible px-4">
              <LogoNavbarLink href="/" className="h-8 w-auto sm:h-10" />
            </div>
            <div className="mt-5 flex flex-1 flex-col">
              <nav className="flex-1 space-y-1 px-2 pb-4">
                {userMenuNav.map((item) => (
                  <Link
                    key={`UserLayout Menu ${item.name}`}
                    href={item.href ?? ''}
                    className={clsx(
                      asPathWithoutLang === item.href
                        ? 'bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-50 dark:hover:bg-gray-800',
                      'group flex items-center px-2 py-2 text-sm font-medium'
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        className={clsx(
                          asPathWithoutLang === item.href
                            ? 'text-gray-900  dark:text-white'
                            : 'text-gray-700 dark:text-gray-50',
                          'mr-3 h-6 w-6 flex-shrink-0'
                        )}
                        aria-hidden="true"
                      />
                    )}
                    {t(item.name)}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col lg:pl-64">
          <div className="flex-shrink- sticky top-0 flex h-16 bg-white bg-opacity-90 dark:bg-gray-900 dark:bg-opacity-90">
            {publicKey && (
              <div className="flex w-full items-center justify-end px-6">
                <Wallet />
              </div>
            )}
            <button
              type="button"
              className="px-4 text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 dark:text-gray-50 dark:hover:text-gray-200 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">open sidebar</span>
              <Bars3BottomLeftIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex flex-1 items-center justify-between pl-2 pr-4">
              <div className="flex flex-1">
                <div className="md:hidden">
                  <LogoHorizontalLink href="/" className="w-16" />
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <div id={mainContentId} className="mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
