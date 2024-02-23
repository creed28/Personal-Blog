import '../styles/style.css';
import Providers from './providers';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: {
    default: "Homepage | Hristo's Blog",
    template: "%s | Hristo's Blog"
  },
  description: "Hristo Zagorliev's personal blog",
}

const RootLayout = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/assets/favicon.png" sizes="any" />
      </head>
      <body className='bg-[#F0E7DB] dark:bg-[#202023]'>
        <Providers>
          <Navbar />
          <main className='max-w-screen-md mx-auto pt-24'>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export default RootLayout
