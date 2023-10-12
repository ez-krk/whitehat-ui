import Image from 'next/image'
import logoHorizontal from '@/assets/img/logo/whitehat.webp'
import logoHorizontalInvert from '@/assets/img/logo/SkeetLogoHorizontalInvert.svg'
import clsx from 'clsx'

type Props = {
  className?: string
  onClick?: () => void
}

export default function LogoHorizontal({ className, ...rest }: Props) {
  return (
    <>
      <div {...rest}>
        <span className="sr-only">whitehat</span>
        <Image
          src={logoHorizontal}
          alt="whitehat"
          className={clsx('dark:hidden ', className)}
          unoptimized
        />
        <Image
          src={logoHorizontal}
          alt="whitehat"
          className={clsx('hidden dark:block', className)}
          unoptimized
        />
      </div>
    </>
  )
}
