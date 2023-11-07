import { useMemo, type ReactElement, type ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import Layout from '@/layouts/Layout'
import { RecoilRoot } from 'recoil'
import Head from 'next/head'
import type { SeoData } from '@/lib/getStatic'
import 'highlight.js/styles/github-dark.css'
import '@/assets/styles/globals.css'
import { ThemeProvider } from 'next-themes'
import { WalletContextProvider } from '@/contexts/WalletContextProvider'
// solana
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { WhitehatProvider } from '@/contexts/WhitehatContextProvider'
require('@solana/wallet-adapter-react-ui/styles.css')

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps, router }: AppProps) {
  const cluster =
    (process.env.NEXT_PUBLIC_SOLANA_NETWORK as 'devnet' | 'mainnet-beta') ||
    'devnet'
  const network = useMemo(
    () =>
      cluster === 'mainnet-beta'
        ? WalletAdapterNetwork.Mainnet
        : WalletAdapterNetwork.Devnet,
    [cluster]
  )
  const endpoint =
    process.env.NEXT_PUBLIC_SOLANA_ENDPOINT || clusterApiUrl(network)
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network])
  return (
    <>
      <Head>
        <title>{pageProps.title}</title>
        {pageProps.seoData?.map((seo: SeoData, index: number) => (
          <meta {...seo} key={`metaSeo${index}`} />
        ))}
      </Head>
      <WalletContextProvider
        endpoint={endpoint}
        network={network}
        wallets={wallets}
      >
        <RecoilRoot>
          <WhitehatProvider>
            <ThemeProvider attribute="class">
              <main className="min-h-screen scroll-smooth font-sans antialiased">
                <Layout
                  Component={Component}
                  pageProps={pageProps}
                  router={router}
                />
              </main>
            </ThemeProvider>
          </WhitehatProvider>
        </RecoilRoot>
      </WalletContextProvider>
    </>
  )
}

export default appWithTranslation(MyApp)
