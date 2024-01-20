'use client'

import Link from 'next/link';

const LinkItem = ({ href, path, content, target="" }) => {
  const active = path === href;

  return(
    <Link 
      href={href} 
      target={target}
      className={`linkItem
      ${active ? 'bg-[#88CCCA] dark:text-[#2F383B]' 
      : 'bg-[undefined]'}`}> 
        {content}       
    </Link>
  )
}

export default LinkItem
