import '@styles/style.css';

export const metadata = {
  title: 'Hristo Zagorliev - Homepage',
  description: 'Hristo Zagorliev\'s personal blog',
}

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
<<<<<<< Updated upstream
      <head>
        <meta name="viewport" content='width=device-width, initial-scale=1' />
      </head>
      <body>{children}</body>
=======
      <body className='bg-[#F0E7DB]'>
        <Navbar />
        <main className='max-w-screen-md mx-auto pt-14'>
          {children}
        </main>
        </body>
>>>>>>> Stashed changes
    </html>
  )
}

export default RootLayout
