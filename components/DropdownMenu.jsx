'use client'

import Link from 'next/link';
import { FaBars } from "react-icons/fa";
import { useEffect, useRef, useState } from 'react';
import { navLinks } from './LinkList';

const DropdownMenu = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  }

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <button
        className={`dropdownIcon 
          ${isDropdownOpen ? 'bg-[#EDF2F7] dark:bg-[#323235]' 
          : ''}`}
        onClick={handleDropdownToggle}
        ref={dropdownRef}>
        <FaBars size={14} />
      </button>
      <div className={`dropdown ${isDropdownOpen ? 'opacity-100 scale-100' : 
        'opacity-0 scale-95 hidden'}`}>
        {isDropdownOpen && (
          <>
            {navLinks.map((link, index) => (
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
    </>
  )
}

export default DropdownMenu
