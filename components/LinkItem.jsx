'use client'

import Link from 'next/link';

const LinkItem = ({ href, path, content}) => {
  const active = path === href;

  return(
    <Link 
      href={href} 
      className={`linkItem
      ${active ? 'bg-[#88CCCA]' 
      : 'bg-[undefined]'}`}> 
        {content}       
    </Link>
  )
}

export default LinkItem
