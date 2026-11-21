import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { FaBars } from 'react-icons/fa';

import { navLinks } from '@/constants/links';
import { cn } from '@/lib/utils';
import { Button } from './ui/Button';

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    }

    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen])

  return (
    <div className="relative md:hidden" ref={containerRef}>
      <Button
        variant="outline"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        className={cn(isOpen && 'bg-[#EDF2F7] dark:bg-[#323235]')}
        onClick={() => setIsOpen(open => !open)}
      >
        <FaBars size={14} />
      </Button>
      {isOpen && (
        <nav className="dropdown">
          {navLinks.map((link, index) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={cn(
                'dropdownLink',
                index === 0 && 'mt-2',
                index === navLinks.length - 1 && 'mb-2'
              )}
            >
              {link.icon}
              {link.content}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}

export default DropdownMenu;
