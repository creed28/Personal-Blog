'use client' 

import LinkItem from "./LinkItem";
import { usePathname } from 'next/navigation';
import { navLinks } from "./LinkList";

const MainMenu = () => {
  const pathname = usePathname();

  return (
    <ul className='items-center flex-grow gap-x-2 hidden w-full md:flex
      md:w-auto dark:text-[#EDEDED]'>
      {navLinks.map((link, index) => (
        <li key={index}>
          <LinkItem
            href={link.href} 
            path={pathname} 
            content={link.content}
            target={link.target}
          />
        </li>
      ))}
    </ul>
  )
}

export default MainMenu
