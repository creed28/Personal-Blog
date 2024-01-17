'use client'

import Link from 'next/link';
import Image from 'next/image';
import LinkItem from './LinkItem';

const Navbar = () => {
  return (
    <nav className='bg-[#F4EDE4] w-[100%] blur-[10%] z-[1]'>
      <div className='flex p-2 max-w-screen-md mx-auto flex-wrap items-center justify-between'> 
        <Link href="/" className='flex items-center mr-5'>
          <h1 className='logoBox tracking-tight'>
            <Image 
              src="/assets/images/coffee-logo.png" 
              alt='Coffee logo' 
              width={25} 
              height={25}               
            />
            <p className='font-Rounded1c text-[#1A202C]'>
              Hristo Zagorliev
            </p>
          </h1>
        </Link>
        <ul>
          <li>
            <LinkItem href='/about' path={'/'} content='About' />
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
