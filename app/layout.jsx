import '../styles/style.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Hristo Zagorliev - Homepage',
  description: "Hristo Zagorliev's personal blog",
}

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
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
