import '@styles/style.css';

export const metadata = {
  title: 'Hristo Zagorliev - Homepage',
  description: 'Hristo Zagorliev\'s personal blog',
}

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content='width=device-width, initial-scale=1' />
      </head>
      <body>{children}</body>
    </html>
  )
}

export default RootLayout
