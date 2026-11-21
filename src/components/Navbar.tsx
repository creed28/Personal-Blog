import { Link } from '@tanstack/react-router';
import { IoLogoGithub } from 'react-icons/io';

import { SOURCE_REPO_URL } from '@/constants/links';

import Logo from './Logo';
import MainMenu from './MainMenu';
import DropdownMenu from './DropdownMenu';
import ThemeToggleButton from './ThemeToggleButton';

const Navbar = () => (
  <nav className="navbar" id="main-nav">
    <div className="flex w-full items-center justify-between gap-x-4">
      <div className="flex items-center gap-x-4">
        <Link to="/" className="flex shrink-0 items-center">
          <Logo />
        </Link>
        <MainMenu />
      </div>
      <div className="flex items-center gap-x-2">
        <a
          href={SOURCE_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[#1A202C]/65 transition-colors hover:bg-brand-soft hover:text-[#1A202C] sm:inline-flex dark:text-[#EDEDED]/65 dark:hover:text-[#EDEDED]"
        >
          <IoLogoGithub size={17} />
          Source
        </a>
        <span
          aria-hidden
          className="hidden h-6 w-px bg-black/10 sm:block dark:bg-white/15"
        />
        <ThemeToggleButton />
        <DropdownMenu />
      </div>
    </div>
  </nav>
)

export default Navbar;
