import { createFileRoute, Link } from '@tanstack/react-router';
import { IoIosArrowForward } from 'react-icons/io';

import AnimatedPage from '@/components/AnimatedPage';
import AnimatedSection from '@/components/AnimatedSection';
import SocialsSection from '@/components/SocialsSection';
import { Button } from '@/components/ui/Button';
import { SOURCE_REPO_URL } from '@/constants/links';
import { pageTitle } from '@/lib/seo';

export const Route = createFileRoute('/about')({
  head: () => ({ meta: [pageTitle('About')] }),
  component: AboutPage
})

const timeline = [
  { year: '2002', content: <>Born in Asenovgrad, Bulgaria.</> },
  {
    year: '2019',
    content: <>Wrote my first lines of code and got into software development.</>
  },
  {
    year: '2021',
    content: (
      <>
        Finished high school in Asenovgrad and started university at{' '}
        <span className="bioHighlight">Paisii Hilendarski</span> in Plovdiv,
        studying computer science. That same year, I got into{' '}
        <span className="bioHighlight">fragrance</span>, and it&apos;s stuck
        with me ever since.
      </>
    )
  },
  {
    year: '2023',
    content: (
      <>
        Started taking <span className="bioHighlight">books</span>,{' '}
        <span className="bioHighlight">film</span>, and{' '}
        <span className="bioHighlight">fitness</span> more seriously, and they
        slowly became a big part of my life.
      </>
    )
  },
  {
    year: '2024',
    content: (
      <>
        Took on my first job as a software developer at{' '}
        <span className="bioHighlight">Inensia</span>.
      </>
    )
  },
  {
    year: '2025',
    content: (
      <>
        Graduated from <span className="bioHighlight">Paisii Hilendarski</span>{' '}
        and wrapped up my student years.
      </>
    )
  }
]

function AboutPage() {
  return (
    <AnimatedPage>
      <div className="mb-6 rounded-xl border border-dashed border-black/15 bg-white/40 p-3 text-center dark:border-white/15 dark:bg-white/5 dark:text-[#E6E6E6]">
        Hello, I&apos;m a Software Developer based in Bulgaria!
      </div>
      <div className="flex flex-col items-center gap-2 md:flex-row md:gap-0 dark:text-[#EEEEEE]">
        <div className="grow">
          <h2 className="font-Rounded1c text-[1.875rem] font-bold">
            Hristo Zagorliev
          </h2>
          <p className="text-[14px] md:text-[1rem]">
            Cinephile / Bookworm / Developer
          </p>
        </div>
        <div className="shrink-0 md:mr-52.5">
          <img
            src="/assets/images/hristo.png"
            alt="Hristo Zagorliev"
            width={105}
            height={105}
            loading="lazy"
            className="mt-1 inline-block max-w-26.25 rounded-full ring-2 ring-brand ring-offset-4 ring-offset-page"
          />
        </div>
      </div>
      <div className="dark:text-[#EEEEEE]">
        <AnimatedSection delay={0.1}>
          <h3 className="articleHeading">Why I made this</h3>
          <p className="mb-2 leading-relaxed">
            I created this blog as a personal diary of sorts, a place to write
            about the things I care about: film, literature, fragrance,
            fashion, fitness, sport, software development, and the odd
            slice-of-life piece. Everything here is written and curated by me.
            It&apos;s where I share my thoughts, experiences, and
            recommendations. No sign-ups, no feeds, just the writing. Feel free
            to read along.
          </p>
          <Button asChild variant="social" className="-ml-2 inline-flex">
            <a
              href={SOURCE_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              View source
              <IoIosArrowForward className="mt-0.5" />
            </a>
          </Button>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <h3 className="articleHeading">About me</h3>
          <ol className="timeline">
            {timeline.map(item => (
              <li key={item.year} className="timelineItem">
                <span aria-hidden className="timelineDot" />
                <span className="timelineYear">{item.year}</span>
                {item.content}
              </li>
            ))}
          </ol>
          <Button asChild variant="social" className="mt-2 -ml-2 inline-flex">
            <Link to="/posts">
              Read more
              <IoIosArrowForward className="mt-0.5" />
            </Link>
          </Button>
        </AnimatedSection>
        <SocialsSection delay={0.3} headingStyle="articleHeading" />
      </div>
    </AnimatedPage>
  );
}
