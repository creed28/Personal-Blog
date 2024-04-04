import Link from "next/link";
import AnimatedSection from "./AnimatedSection";
import { socialLinks } from "../constants/links";
import { Button } from "./Button";

type SocialLink = {
  href: string;
  title: string;
  icon: React.ReactNode;
  text: string;
}

type SocialsSectionProps = {
  delay?: number;
  wrapperStyle?: string;
  headingStyle?: string;
  listStyle?: string;
  linkStyle?: string;
}

const SocialsSection = ({ delay, wrapperStyle = '', headingStyle, listStyle = '', linkStyle }: SocialsSectionProps) => {
  return (
    <AnimatedSection delay={delay}>
      <div className={wrapperStyle}>
        <h3 className={headingStyle}>
          My links
        </h3>
      </div>
      <ul className={listStyle}>
        {socialLinks.map((link: SocialLink, index: number) => (
          <li key={index}>
            <Link 
              className="inline-block" 
              href={link.href} 
              target="_blank" 
              title={link.title}>
                <Button variant="social" className={linkStyle}>
                  {link.icon}
                  {link.text}
                </Button>
            </Link>
          </li>
        ))}
      </ul>
    </AnimatedSection>
  )
}

export default SocialsSection
