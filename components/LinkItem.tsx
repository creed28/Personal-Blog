import Link from 'next/link';

type LinkItemProps = {
  href: string;
  path: string;
  content: React.ReactNode;
  target? : string;
}

const LinkItem = ({ href, path, content, target = '' }: LinkItemProps) => {
  const active = path === href;

  return (
    <Link 
      href={href} 
      target={target}
      className={`linkItem
      ${active ? 'bg-[#88CCCA] dark:text-[#2F383B]' 
      : 'bg-[undefined]'}`}> 
        {content}       
    </Link>
  )
}

export default LinkItem
