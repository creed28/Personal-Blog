'use client'

import { ThemeProvider as Provider } from 'next-themes';
import { type ThemeProviderProps } from "next-themes/dist/types";

const ThemeProvider = ({ children }: ThemeProviderProps) => {
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
