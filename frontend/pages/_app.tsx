import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Footer from 'components/footer'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Footer/>
    </>
  )
}
export default MyApp
