import { useState, useEffect, type ReactNode } from 'react'
import Link from '@/components/routing/Link'
import clsx from 'clsx'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'

type Props = {
  children: ReactNode | string
  text: string
  onClick?: () => void
}

export default function Button({ children, text, ...props }: Props) {
  const [isShown, setIsShown] = useState(false)
  const [clicked, setClicked] = useState(false)

  const onClick = async () => {
    await navigator.clipboard.writeText(text)
    setClicked(true)
  }

  useEffect(() => {
    if (!isShown) {
      setClicked(false)
    }
  }, [])
  return (
    <>
      {children}
      <div
        className="tooltip flex items-center justify-center"
        data-tip={`${clicked ? 'copied !' : 'copy'}`}
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
      >
        <DocumentDuplicateIcon
          className="ml-1 h-4 w-4 cursor-pointer"
          onClick={onClick}
        />
      </div>
    </>
  )
}
