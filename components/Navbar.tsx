'use client'

import Link from 'next/link';
import Logo from './Logo';
import ThemeToggleButton from './ThemeToggleButton';
import { useEffect, useState } from 'react';
import DropdownMenu from './DropdownMenu';
import MainMenu from './MainMenu';

const Navbar = () => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;

      setWindowWidth(prevWidth => {
        if (prevWidth !== newWidth) {
          return newWidth;
        }
        return prevWidth;
      })
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (  
    <nav className='navbar' id='main-nav'>
      <div className='flex gap-x-64 md:gap-x-48'>
        <div className='flex p-2 max-w-screen-md mx-auto flex-wrap items-center 
          gap-x-5 justify-between'>
          <Link href='/' className='flex items-center shrink-0'>
            <Logo />
          </Link>
          {windowWidth > 768 && <MainMenu />}
        </div>
        <div className='flex gap-x-2 mr-5 md:mr-10'>
          <div className='flex items-center shrink-0'>
            <ThemeToggleButton />
          </div>
          {windowWidth <= 768 && (
            <div className="relative mt-4">
              <DropdownMenu />
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
