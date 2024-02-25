import Image from "next/image";
import AnimatedSection from "../../components/AnimatedSection";
import Link from "next/link";
import AnimatedPage from '../../components/AnimatedPage';
import { IoIosArrowForward } from "react-icons/io";
import SocialsSection from "../../components/SocialsSection";

export const metadata = {
  title: 'About'
}

const About = () => {
    return (
      <AnimatedPage>
        <div className="rounded-lg bg-[#F5F0E8] p-3 text-center mb-6 mx-6 
          md:mx-0 dark:bg-[#313134] dark:text-[#E6E6E6]">
          Hello, I&apos;m a Computer Science student based in Bulgaria!
        </div>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-0 dark:text-[#EEEEEE]">
          <div className="flex-grow">
            <h2 className="text-[1.875rem] font-bold font-Rounded1c">
              Hristo Zagorliev
            </h2>
            <p className="text-[14px] md:text-[1rem]">
              Digital Craftsman ( Developer / Web Designer / Bookworm )
            </p>
          </div>
          <div className="shrink-0 md:mr-[210px]">
            <Image
              src='/assets/images/hristo.png'
              alt="Profile Image" 
              width={105}
              height={105}
              loading="lazy"
              className="border-[#fff] border-2 border-solid max-w-[105px] 
                inline-block rounded-full mt-1"
            />
          </div>
        </div>
        <div className="mt-[30px] mx-6 md:mx-0 dark:text-[#EEEEEE]">
          <AnimatedSection delay={0.1}>
            <h3 className="articleHeading">
                Why I made this
            </h3>
            <p className="indent-4 text-justify mb-4">
              I created this blog as a virtual diary to cover a wide range of topics I&apos;m 
              passionate about, including fragrances, fashion, books, movies, fitness, sports, 
              software development, and general slice-of-life articles. It&apos;s a curated space 
              for sharing insights, experiences, and recommendations, fostering a community 
              of like-minded individuals. Join me on this journey by creating an account, 
              save your favorite articles, and engage in discussions with fellow readers.
            </p>
            <div className="flex justify-center">
              <Link href={'https://github.com/creed28/Personal-Blog'} target="_blank">
                <button className='btn'>
                  View Source
                  <IoIosArrowForward className="mt-1" />
                </button>
              </Link>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <h3 className="articleHeading">
              About me
            </h3>
            <section className="bioHeading">
              <span className="bioParagraph">2002</span>
              Born in Asenovgrad, Bulgaria.
            </section>
            <section className="bioHeading">
              <span className="bioParagraph">2020</span>
              Embarked on my journey into software development.
            </section>
            <section className="bioHeading">
              <span className="bioParagraph">2021</span>
              Completed my high school education at &quot;St. Knyaz Boris I&quot; 
              in Asenovgrad and commenced my university studies at 
              &quot;Paisii Hilendarski&quot; in Plovdiv, furthering 
              my pursuit of software development.
            </section>
            <section className="bioHeading">
              <span className="bioParagraph">2023</span>
              Successfully concluded my first internship as a backend developer  
              at Dreamix. Shortly after that, I embarked on a second internship as a
              full-stack intern at Re4Life.
            </section>
            <div className="flex justify-center">
              <Link href={'/'}>
                <button className="btn">
                  Read More
                  <IoIosArrowForward className="mt-1" />
                </button>
              </Link>
            </div>
          </AnimatedSection>
          <SocialsSection 
            delay={0.3}
            headingStyle={'articleHeading'}
            linkStyle={'socialLink'}
          />
        </div>
      </AnimatedPage>
    )
  }
  
  export default About
  