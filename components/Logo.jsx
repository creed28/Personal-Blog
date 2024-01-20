'use client'

import Image from 'next/image';

const Logo = () => {
  return (
    <h1 className='logoBox tracking-tighter'>
      <Image
        src="/assets/images/coffee-logo.png" 
        alt='Coffee logo' 
        width={27} 
        height={27}               
      />
      <p className='font-Rounded1c text-[#1A202C] dark:text-[#EDEDED]'>
        Hristo Zagorliev
      </p>
    </h1>
  )
}

export default Logo
