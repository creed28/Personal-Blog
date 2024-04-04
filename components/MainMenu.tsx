import React from 'react';
import LinkItem from './LinkItem';
import { usePathname } from 'next/navigation';
import { navLinks } from '../constants/links';
import { NavLink } from '../types/NavLink';

const MainMenu = () => {
  const pathname: string = usePathname();

  return (
    <ul className="items-center flex-grow gap-x-2 hidden w-full md:flex md:w-auto
     dark:text-[#EDEDED]">
      {navLinks.map((link: NavLink, index: number) => (
        <li key={index}>
          <LinkItem
            href={link.href}
            path={pathname}
            content={link.content}
          />
        </li>
      ))}
    </ul>
  )
}

export default MainMenu
