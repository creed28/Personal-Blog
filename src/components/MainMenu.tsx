import { Link } from '@tanstack/react-router';
import { navLinks } from '@/constants/links';

const MainMenu = () => (
  <ul className="hidden w-full grow items-center gap-x-1 md:flex md:w-auto dark:text-[#EDEDED]">
    {navLinks.map(link => (
      <li key={link.to}>
        <Link
          to={link.to}
          className="linkItem"
          activeProps={{
            className:
              'bg-brand-soft text-[#1A202C] dark:text-[#EDEDED]'
          }}
        >
          {link.icon}
          {link.content}
        </Link>
      </li>
    ))}
  </ul>
)

export default MainMenu;
