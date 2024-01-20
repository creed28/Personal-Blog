import '../styles/style.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Hristo Zagorliev - Homepage',
  description: "Hristo Zagorliev's personal blog",
}

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/favicon.png" sizes="any" />
      </head>
      <body className='bg-[#F0E7DB] dark:bg-[#202023]'>
        <Navbar />
        <main className='max-w-screen-md mx-auto pt-24'>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

export default RootLayout
