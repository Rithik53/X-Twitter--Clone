import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter, Quicksand } from 'next/font/google'
import { GoogleOAuthProvider } from '@react-oauth/google';

const inter = Inter({ subsets: ['latin'] })
const quicksand = Quicksand({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return<div className={inter.className}>
    <GoogleOAuthProvider clientId='141303922785-dngrsfsmq17druectfh1dsiqcicr99pc.apps.googleusercontent.com'>
      <Component {...pageProps} />
      </GoogleOAuthProvider>
      </div>
}
