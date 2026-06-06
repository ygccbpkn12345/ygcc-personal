import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import '@/app/globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps, router }: AppProps) {
  // 后台管理页面不显示导航和页脚
  const isAdmin = router.pathname.startsWith('/admin')

  return (
    <div className={inter.className}>
      <div className="flex flex-col min-h-screen">
        {!isAdmin && <Navbar />}
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        {!isAdmin && <Footer />}
      </div>
    </div>
  )
}
