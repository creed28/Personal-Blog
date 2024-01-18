import '../styles/style.css';
import Navbar from '../components/Navbar';

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
      <body className='bg-[#F0E7DB]'>
        <Navbar />
        <main className='max-w-screen-md mx-auto pt-14'>
          {children}
        </main>
      </body>
    </html>
  )
}

export default RootLayout
