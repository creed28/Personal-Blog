import NextLink from 'next/link';
import Link from 'next/link';
import Image from 'next/image';

const LinkItem = ({ href, path, children}) => {
  const active = path === href;
  
  return(
    <NextLink href={href}>
      <Link href={href} className={`p-2 ${active ? 'bg-[glassTeal] text-[#202023]' 
        : 'bg-[undefined] text-[gray]'}`}>          
        {children}
      </Link>
    </NextLink>
  )
}

const Navbar = () => {
  return (
    <nav className='bg-[#F4EDE4] w-[100%] blur-[10%] z-[1]'>
      <div className='flex p-2 max-w-screen-md mx-auto flex-wrap items-center justify-between'> 
        <Link href="/" className='flex items-center mr-5'>
          <h1 className='logoBox tracking-tight'>
            <Image 
              src="/assets/images/coffee-logo.png" 
              alt='Coffee logo' 
              width={25} 
              height={25}               
            />
            <p className='font-Rounded1c text-[#1A202C]'>
              Hristo Zagorliev
            </p>
          </h1>
        </Link>
        <ul>
          <li><LinkItem href='/about' path={'/'}>
            About
          </LinkItem></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
