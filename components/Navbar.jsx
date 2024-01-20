'use client'

import Link from 'next/link';
import Logo from './Logo';
import LinkItem from './LinkItem';
import ThemeToggleButton from './ThemeToggleButton';
import { usePathname } from 'next/navigation';
import { FaBars } from "react-icons/fa";
import { useState } from 'react';

const Navbar = () => {
  const pathname = usePathname();
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  }

  return (
    <nav className='bg-[#F4EDE4] w-full z-[2] max-h-[56px] 
      items-center flex justify-center fixed dark:bg-[#202023] 
      dark:bg-opacity-40 bg-opacity-40 backdrop-filter backdrop-blur-md'>
      <div className='flex gap-x-48 md:gap-x-32'>
        <div className='flex p-2 max-w-screen-md mx-auto flex-wrap items-center 
          gap-x-5 justify-between'>
          <Link href='/' className='flex items-center shrink-0'>
            <Logo />
          </Link>
          <ul className='items-center flex-grow gap-x-2 hidden w-full 
            md:flex md:w-auto dark:text-[#EDEDED]'>
            <li>
              <LinkItem 
                href='/posts' 
                path={pathname} 
                content='Posts' />
            </li>
            <li>
              <LinkItem 
                href='/about' 
                path={pathname} 
                content='About' />
            </li>
            <li>
              <LinkItem 
                href='/contact' 
                path={pathname} 
                content='Contact Me' />
            </li>
            <li>
              <LinkItem 
                href='https://github.com/creed28/Personal-Blog' 
                content='View Source'
                target="_blank" />
            </li>
          </ul>
        </div>
        <div className='flex gap-x-2 mr-5 md:m-0'>
          <div className='flex items-center shrink-0'>
            <ThemeToggleButton />
          </div>
          <div className="relative mt-4 md:hidden">
            <div
              className={`dropdownIcon 
              ${isDropdownOpen ? 'bg-[#EDF2F7] dark:bg-[#323235]' 
              : ''}`}
              onClick={handleDropdownToggle}
            >
              <FaBars size={14} />
            </div>
            {isDropdownOpen && (
              <div className="dropdown">
                <Link 
                  href='/posts' 
                  className='dropdownLink mt-2'>
                    Posts
                </Link>
                <Link 
                  href='/about' 
                  className='dropdownLink'>
                    About
                </Link>
                <Link 
                  href='/contact' 
                  className='dropdownLink'>
                    Contact Me
                </Link>
                <Link 
                  href='https://github.com/creed28/Personal-Blog' 
                  className='dropdownLink mb-2'
                  target="_blank">
                    View Source
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
