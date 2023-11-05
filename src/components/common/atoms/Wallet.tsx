import dynamic from 'next/dynamic'
// import localFont from 'next/font/local'
// const pixel = localFont({ src: '../../assets/fonts/pixel.ttf' })

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
)

const Wallet = () => {
  return (
    // <span className={pixel.className}>
    <WalletMultiButtonDynamic
      style={{
        color: 'white',
        height: '40px',
        // fontFamily: "monospace",
        textTransform: 'lowercase',
        borderRadius: '0px',
      }}
      className="btn-md btn bg-[mediumslateblue] hover:bg-[slateblue]"
      // className="btn btn-md bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
    />
    // </span>
  )
}

export default Wallet
