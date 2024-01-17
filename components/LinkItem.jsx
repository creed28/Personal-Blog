'use client'

import Link from 'next/link';

const LinkItem = ({ href, path, content}) => {
  const active = path === href;
    
  return(
    <Link href={href} className={`p-2 ${active ? 'bg-[glassTeal] text-[#202023]' 
      : 'bg-[undefined] text-[gray]'}`}>          
      {content}
    </Link>
  )
}

export default LinkItem
