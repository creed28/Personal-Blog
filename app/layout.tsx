import type { Metadata } from "next";
import '../styles/style.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ThemeProvider from "../providers/themeProvider";
import { DialogProvider } from "../providers/dialogProvider";
import { EdgeStoreProvider } from "../lib/edgestore";

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
        <EdgeStoreProvider>
          <ThemeProvider>
            <DialogProvider />
            <Navbar />
            <main className='max-w-screen-md mx-auto pt-24'>
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </EdgeStoreProvider>
      </body>
    </html>
  )
}

export default RootLayout
