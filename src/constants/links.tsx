import type { ReactNode } from 'react';
import { IoLogoFacebook, IoLogoGithub, IoLogoInstagram } from 'react-icons/io';
import { FaDiscord } from 'react-icons/fa';
import { BookOpen, Mail, UserRound } from 'lucide-react';

export type NavLink = {
  to: '/posts' | '/about' | '/contact'
  content: string
  icon: ReactNode
}

export type SocialLink = {
  href: string
  title: string
  icon: ReactNode
  text: string
}

export const navLinks: NavLink[] = [
  { to: '/posts', content: 'Posts', icon: <BookOpen size={15} /> },
  { to: '/about', content: 'About', icon: <UserRound size={15} /> },
  { to: '/contact', content: 'Contact Me', icon: <Mail size={15} /> }
]

export const socialLinks: SocialLink[] = [
  {
    href: 'https://www.instagram.com/hristo.zagorliev/',
    title: 'Instagram',
    icon: <IoLogoInstagram size={20} />,
    text: 'hristo.zagorliev'
  },
  {
    href: 'https://www.facebook.com/hristo.zagorliev/',
    title: 'Facebook',
    icon: <IoLogoFacebook size={20} />,
    text: 'hristozagorliev'
  },
  {
    href: 'https://github.com/creed28',
    title: 'GitHub',
    icon: <IoLogoGithub size={20} />,
    text: 'creed28'
  },
  {
    href: 'https://discordapp.com/users/200159728540581895',
    title: 'Discord',
    icon: <FaDiscord size={20} />,
    text: 'creed'
  }
]

export const CONTACT_EMAIL = 'hristozagorliev283@gmail.com';

export const SOURCE_REPO_URL = 'https://github.com/creed28/Personal-Blog';
