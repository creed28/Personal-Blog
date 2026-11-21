import { socialLinks } from '@/constants/links';
import AnimatedSection from './AnimatedSection';
import { Button } from './ui/Button';

type SocialsSectionProps = {
  delay?: number
  wrapperStyle?: string
  headingStyle?: string
  listStyle?: string
  linkStyle?: string
}

const SocialsSection = ({
  delay,
  wrapperStyle = '',
  headingStyle,
  listStyle = '-ml-2 flex flex-wrap gap-x-1',
  linkStyle
}: SocialsSectionProps) => (
  <AnimatedSection delay={delay}>
    <div className={wrapperStyle}>
      <h3 className={headingStyle}>My links</h3>
    </div>
    <ul className={listStyle}>
      {socialLinks.map(link => (
        <li key={link.href}>
          <Button
            asChild
            variant="social"
            className={`inline-flex ${linkStyle ?? ''}`}
          >
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              title={link.title}
            >
              {link.icon}
              {link.text}
            </a>
          </Button>
        </li>
      ))}
    </ul>
  </AnimatedSection>
)

export default SocialsSection;
