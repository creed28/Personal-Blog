'use client'

import Link from 'next/link';
import Logo from './Logo';
import ThemeToggleButton from './ThemeToggleButton';
import { useEffect, useState } from 'react';
import DropdownMenu from './DropdownMenu';
import MainMenu from './MainMenu';
import AuthDialog from './auth/AuthDialog';

const Navbar = () => {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!isLoaded) return null;

  return (  
    <nav className='navbar' id='main-nav'>
      <div className='flex gap-x-32 sm:gap-x-40 md:gap-x-16'>
        <div className='flex p-2 max-w-screen-md mx-auto flex-wrap items-center 
          gap-x-4 justify-between ml-5'>
          <Link href='/' className='flex items-center shrink-0'>
            <Logo />
          </Link>
          {windowWidth > 768 && <MainMenu />}
        </div>
        <div className='flex items-center gap-x-3 mr-10 md:mr-10'>
          <AuthDialog windowWidth={windowWidth} />
          <div className='flex items-center shrink-0'>
            <ThemeToggleButton />
          </div>
          {windowWidth <= 768 && <DropdownMenu />}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
