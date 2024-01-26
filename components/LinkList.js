import { 
    IoLogoFacebook, 
    IoLogoGithub, 
    IoLogoInstagram, 
    IoMdMail 
} from "react-icons/io";

export const navLinks = [
    {href: '/posts', content: 'Posts'},
    {href: '/about', content: 'About'},
    {href: '/contact', content: 'Contact Me'},
    {href: 'https://github.com/creed28/Personal-Blog', content: 'View Source', target: '_blank'},
];

export const socialLinks = [
    { href: 'https://github.com/creed28', title: 'GitHub', 
        icon: <IoLogoGithub size={20} />, text: '@creed28' },
    { href: 'mailto:hristozagorliev283@gmail.com', title: 'Gmail', 
        icon: <IoMdMail size={20} />, text: '@hristozagorliev283' },
    { href: 'https://www.facebook.com/hristo.zagorliev/', title: 'Facebook', 
        icon: <IoLogoFacebook size={20} />, text: '@hristozagorliev' },
    { href: 'https://www.instagram.com/hristo_z28/', title: 'Instagram', 
        icon: <IoLogoInstagram size={20} />, text: '@hristo_z28' },
];
  