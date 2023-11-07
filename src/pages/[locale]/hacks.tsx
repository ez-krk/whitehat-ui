import { ReactElement } from 'react'
import UserLayout from '@/layouts/user/UserLayout'
import siteConfig from '@/config/site'
import { getStaticPaths, makeStaticProps } from '@/lib/getStatic'
import HacksScreen from '@/components/pages/hacks/HacksScreen'

const seo = {
  pathname: '/user/hacks',
  title: {
    ja: 'AIチャット',
    en: 'dashboard',
  },
  description: {
    ja: siteConfig.descriptionJA,
    en: siteConfig.descriptionEN,
  },
  img: null,
}

const getStaticProps = makeStaticProps(['common', 'user', 'hacks'], seo)
export { getStaticPaths, getStaticProps }

export default function Dashboard() {
  return (
    <>
      <HacksScreen />
    </>
  )
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>
}
