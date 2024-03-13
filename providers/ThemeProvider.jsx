'use client'

import { ThemeProvider as Provider } from 'next-themes';

const ThemeProvider = ({ children }) => {
  return (
    <Provider 
      attribute="class" 
      defaultTheme='system' 
      enableSystem>
      {children}
    </Provider>
  )
}

export default ThemeProvider
