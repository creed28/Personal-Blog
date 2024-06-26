'use client'

import Link from 'next/link';
import { FaBars } from "react-icons/fa";
import { useEffect, useRef, useState } from 'react';
import { navLinks } from '../constants/links';
import { NavLink } from '../types/NavLink';
import { Button } from './Button';

const DropdownMenu = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  }

  const dropdownRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      window.addEventListener('click', handleClickOutside);
    } else {
      window.removeEventListener('click', handleClickOutside);
    }

    return () => {
      window.removeEventListener('click', handleClickOutside);
    }
  }, [isDropdownOpen])

  return (
    <div className="relative">
      <Button
        variant='outline'
        className={`${isDropdownOpen && 'bg-[#EDF2F7] dark:bg-[#323235]'}`}
        onClick={handleDropdownToggle}
        ref={dropdownRef}>
        <FaBars size={14} />
      </Button>
      <div className={`dropdown ${isDropdownOpen ? 'opacity-100 scale-100' : 
        'opacity-0 scale-95 hidden'}`}>
        {isDropdownOpen && (
          <>
            {navLinks.map((link: NavLink, index: number) => (
              <Link 
                key={index}
                href={link.href}
                className={`dropdownLink 
                  ${index === 0 ? 'mt-2' : ''} 
                  ${index === navLinks.length - 1 ? 'mb-2' : ''}`}
              >
                {link.content}
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default DropdownMenu
