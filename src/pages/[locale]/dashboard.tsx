import { ReactElement } from 'react'
import UserLayout from '@/layouts/user/UserLayout'
import siteConfig from '@/config/site'
import { getStaticPaths, makeStaticProps } from '@/lib/getStatic'
import DashboardScreen from '@/components/pages/dashboard/DashboardScreen'

const seo = {
  pathname: '/user/dashboard',
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

const getStaticProps = makeStaticProps(['common', 'user', 'dashboard'], seo)
export { getStaticPaths, getStaticProps }

export default function Dashboard() {
  return (
    <>
      <DashboardScreen />
    </>
  )
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>
}
