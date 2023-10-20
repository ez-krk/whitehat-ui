import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import type { ReactElement } from 'react'
import DocLayout from '@/layouts/docs/DocLayout'
import { getStaticPaths } from '@/lib/getStatic'
import { getI18nProps } from '@/lib/getStatic'
import DocIndex from '@/components/articles/docs/DocIndex'

const articleDirName = 'docs'

const seo = {
  pathname: `/${articleDirName}`,
  title: {
    ja: 'ドキュメントトップページ',
    en: 'docs',
  },
  description: {
    ja: 'Next.js Template ドキュメントトップページ',
    en: 'whitehat docs home',
  },
  img: null,
}

export default function DocIndexPage() {
  return (
    <>
      <DocIndex />
    </>
  )
}

DocIndexPage.getLayout = function getLayout(page: ReactElement) {
  return <DocLayout>{page}</DocLayout>
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {
      ...(await getI18nProps(ctx, ['common', articleDirName], seo)),
    },
  }
}

export { getStaticPaths }
