import { 
  IoLogoFacebook, 
  IoLogoGithub, 
  IoLogoInstagram, 
} from "react-icons/io";
import { FaDiscord } from 'react-icons/fa';

export const navLinks = [
  { href: '/posts', content: 'Posts' },
  { href: '/about', content: 'About' },
  { href: '/contact', content: 'Contact Me' },
];

export const socialLinks = [
  { href: 'https://github.com/creed28', title: 'GitHub', 
      icon: <IoLogoGithub size={20} />, text: 'creed28' },
  { href: 'https://discordapp.com/users/200159728540581895', title: 'Discord',
      icon: <FaDiscord size={20} />, text: 'creed' },
  { href: 'https://www.facebook.com/hristo.zagorliev/', title: 'Facebook', 
      icon: <IoLogoFacebook size={20} />, text: 'hristozagorliev' },
  { href: 'https://www.instagram.com/hristo_z28/', title: 'Instagram', 
      icon: <IoLogoInstagram size={20} />, text: 'hristo_z28' },
];
