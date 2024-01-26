'use client'

import Link from 'next/link';
import { FaBars } from "react-icons/fa";
import { useState } from 'react';
import { navLinks } from './LinkList';

const DropdownMenu = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  }

  return (
    <>
      <div
        className={`dropdownIcon 
          ${isDropdownOpen ? 'bg-[#EDF2F7] dark:bg-[#323235]' 
          : ''}`}
        onClick={handleDropdownToggle}>
        <FaBars size={14} />
      </div>
      {isDropdownOpen && (
        <div className="dropdown">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={`dropdownLink ${index !== navLinks.length - 1 ? 'mt-2' : 'mb-2'}`}>
                {link.content}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

export default DropdownMenu
