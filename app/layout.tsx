import type { Metadata } from "next";
import '../styles/style.css';
import ThemeProvider from '../providers/ThemeProvider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: {
    default: "Homepage | Hristo's Blog",
    template: "%s | Hristo's Blog"
  },
  description: "Hristo Zagorliev's personal blog",
  icons: {
    icon: {
      url: '/assets/favicon.png',
      href: '/assets/favicon.png'
    }
  }
}

const RootLayout = ({ children }: {
  children: React.ReactNode
}) => {
  return (
    <html lang="en">
      <body className='bg-[#F0E7DB] dark:bg-[#202023]'>
        <ThemeProvider>
          <Navbar />
          <main className='max-w-screen-md mx-auto pt-24'>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
