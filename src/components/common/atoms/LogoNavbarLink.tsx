import Link from '@/components/routing/Link'
import Image from 'next/image'
import logoHorizontal from '@/assets/img/logo/whitehat.webp'
import clsx from 'clsx'

type Props = {
  className?: string
  href?: string
  onClick?: () => void
}

export default function LogoNavbarLink({
  className,
  href = '/',
  ...rest
}: Props) {
  return (
    <>
      <Link href={href} {...rest}>
        <span className="sr-only">whitehat</span>
        <div className="flex items-center">
          <Image
            src={logoHorizontal}
            alt="Skeet Framework"
            className={clsx('dark:hidden ', className)}
            unoptimized
          />
          <span className="ml-2 font-bold text-gray-700  hover:text-gray-900  dark:hidden  dark:text-gray-50 dark:hover:text-gray-200">
            whitehat.
          </span>
        </div>
        <div className="flex items-center">
          <Image
            src={logoHorizontal}
            alt="Skeet Framework"
            className={clsx('hidden dark:block', className)}
            unoptimized
          />
          <span className="ml-2 hidden font-bold text-gray-700 hover:text-gray-900  dark:block  dark:text-gray-50 dark:hover:text-gray-200">
            whitehat.
          </span>
        </div>
      </Link>
    </>
  )
}
