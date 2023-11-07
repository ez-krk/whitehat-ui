import { ReactElement } from 'react'
import UserLayout from '@/layouts/user/UserLayout'
import siteConfig from '@/config/site'
import { getStaticPaths, makeStaticProps } from '@/lib/getStatic'
import Vulnerabilitiescreen from '@/components/pages/vulnerabilities/Vulnerabilitiescreen'

const seo = {
  pathname: '/user/vulnerabilities',
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

const getStaticProps = makeStaticProps(
  ['common', 'user', 'vulnerabilities'],
  seo
)
export { getStaticPaths, getStaticProps }

export default function Dashboard() {
  return (
    <>
      <Vulnerabilitiescreen />
    </>
  )
}

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>
}
