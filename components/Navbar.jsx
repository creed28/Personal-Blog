'use client'

import Link from 'next/link';
import Logo from './Logo';
import ThemeToggleButton from './ThemeToggleButton';
import { useEffect, useState } from 'react';
import DropdownMenu from './DropdownMenu';
import MainMenu from './MainMenu';

const Navbar = () => {
  const[windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize)
  }, []);

  return (  
    <nav className='navbar' id='main-nav'>
      <div className='flex gap-x-64 md:gap-x-32'>
        <div className='flex p-2 max-w-screen-md mx-auto flex-wrap items-center 
          gap-x-5 justify-between'>
          <Link href='/' className='flex items-center shrink-0'>
            <Logo />
          </Link>
          {windowWidth > 768 && <MainMenu />}
        </div>
        <div className='flex gap-x-2 mr-5 md:m-0'>
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
