import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import Link from '@/components/routing/Link'
import type { NewsIndex } from '@/types/article'

type Props = {
  articles: NewsIndex[]
  urls: string[]
}

export default function TopNewsRow({ articles, urls }: Props) {
  const { t } = useTranslation()

  const milestones = [
    {
      id: 1,
      title: 'ecies encryption',
      description:
        "encrypt vulnerability reports for a solana public key, and decrypt it with it's corresponding private key, to follow 'responsible disclosure' principle.",
      status: 'done',
      date: '2023-10-15',
    },
    {
      id: 2,
      title: 'write docs',
      description:
        'write comprehensible documentation for both parties involved : including instruction to use our rust/typescript cli clients, and accounts arrays for daos (squads/realms)',
      status: 'todo',
      date: 'Q4 2023',
    },
    {
      id: 3,
      title: 'wba hack competition (devnet)',
      description:
        'to boostrap program use and social traction : run a competition among wba students to help them discover bugs in their programs to iterate faster while fighting for a cashprize !',
      status: 'todo',
      date: 'Q4 2023',
    },
    {
      id: 4,
      title: 'allow multiple programs',
      description:
        "due to seed constraints, it's only possible to register 1 program per pubkey for now : this needs to change !",
      status: 'todo',
      date: 'Q4 2023',
    },
    {
      id: 5,
      title: 'mainnet',
      description: 'get our program on the battlefield',
      status: 'todo',
      date: 'Q1 2024',
    },
    {
      id: 6,
      title: 'atomic hacks',
      description:
        'use transaction introspection to allow hackers to perform a hack followed by a deposit in the same transaction, to legally discharge whitehat hackers even further : effectively never handing over the funds themselves',
      status: 'todo',
      date: 'Q2 2024',
    },
  ]

  return (
    <>
      <div className="pb-24 pt-8 sm:pb-48 sm:pt-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto w-full text-center">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl">
              product roadmap
            </h2>
          </div>
          <div className="mx-auto mt-8 grid w-full max-w-2xl grid-cols-1 gap-x-8 gap-y-2 lg:mx-0 lg:max-w-none">
            {milestones.map((mile, index) => (
              <article
                key={`NewsIndex Article${mile.title}`}
                className="group flex w-full flex-col items-center justify-center border border-black bg-gray-900 dark:bg-gray-50"
              >
                <div className="w-full">
                  <div className="mt-4 flex w-full items-center gap-x-4 px-3 text-xs">
                    <span
                      className={`relative ${
                        mile.status == 'done'
                          ? 'bg-success text-white'
                          : 'bg-gray-50 dark:bg-gray-900'
                      }  px-3 py-1.5 font-medium text-gray-900 dark:text-gray-50`}
                    >
                      {mile.status}
                    </span>
                    <time
                      dateTime={mile.date}
                      className="text-gray-50 dark:text-gray-900 dark:group-hover:text-gray-500"
                    >
                      {mile.date}
                    </time>
                  </div>
                  <div className="relative w-[100%] px-3">
                    <h2 className="my-1.5 text-lg font-semibold leading-6 text-gray-50 dark:text-gray-900">
                      <span className="absolute inset-0" />
                      {mile.title}
                    </h2>
                    <p className="my-1.5 w-full text-xs leading-6 text-gray-50 dark:text-gray-900">
                      {`${mile.description}`}
                    </p>
                  </div>
                </div>
              </article>
            ))}
            <div className="mx-auto w-full max-w-2xl border-t border-gray-900/10 pt-4 sm:pt-4 lg:mx-0 lg:max-w-none lg:border-t-0 lg:pt-0">
              <div className="-my-4 divide-y divide-gray-900/10">
                {articles.map((article, index) => (
                  <article
                    key={`NewsIndex Article${article.title}`}
                    className="py-4"
                  >
                    <Link href={urls[index + 1]}>
                      <div className="group relative flex gap-x-6">
                        <Image
                          src={article.thumbnail}
                          alt={article.title}
                          width="160"
                          height="90"
                          className="hidden aspect-video bg-gray-50 object-cover group-hover:opacity-80 dark:bg-gray-800 sm:block"
                          unoptimized
                        />
                        <div className="max-w-xl">
                          <div className="flex items-center gap-x-4 text-xs">
                            <span className="relative bg-gray-600 px-3 py-1.5 font-medium text-white group-hover:bg-gray-400 dark:bg-gray-400  dark:text-gray-50 dark:group-hover:bg-gray-700">
                              {article.category}
                            </span>
                          </div>
                          <h2 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-gray-600 dark:text-gray-50 dark:group-hover:text-gray-300">
                            <span className="absolute inset-0" />
                            {article.title}
                          </h2>
                          <p className="mt-4 text-sm leading-6 text-gray-600 group-hover:text-gray-400 dark:text-gray-300 dark:group-hover:text-gray-500">
                            {`${article.content}`}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
