'use client'

import Image from "next/image";
import AnimatedSection from "../../components/AnimatedSection";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";

const About = () => {
    return (
      <article>
        <div className="rounded-lg bg-[#F5F0E8] p-3 text-center mb-6 mx-6 
          md:mx-0">
          Hello, I&apos;m a Computer Science student based in Bulgaria!
        </div>

        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-0">
          <div className="flex-grow">
            <h2 className="text-[1.875rem] font-bold font-Rounded1c">
              Hristo Zagorliev
            </h2>
            <p className="text-[15px] md:text-[1rem]">
              Digital Craftsman ( Developer / Web Designer / Bookworm )
            </p>
          </div>
          <div className="shrink-0 md:mr-[210px]">
            <Image
              src='/assets/images/hristo.png'
              alt="Profile Image" 
              width={96}
              height={100}
              loading="lazy"
              className="border-[#fff] border-2 border-solid max-w-[100px] 
                inline-block rounded-full"
            />
          </div>
        </div>
        <div className="mt-[2rem] mx-6 md:mx-0">
          <AnimatedSection delay={0.1}>
            <h3 className="articleHeading">
                Work
            </h3>
            <p className="indent-4 text-justify">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium aliquam esse 
              debitis at accusamus natus, aut similique. Exercitationem veniam minima sed modi 
              in est distinctio, perspiciatis, placeat sequi numquam pariatur.
            </p>
            <div className="flex justify-center">
              <Link href={'/'}>
                <button className="flex bg-[#319795] hover:bg-[#2C7A7B] 
                  items-center p-2 px-3 font-semibold rounded-md gap-2 my-4 
                  text-center text-white">
                  My portfolio 
                  <IoIosArrowForward className="mt-1" />
                </button>
              </Link>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <h3 className="articleHeading">
              Bio
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
              I completed my high school education at &quot;St. Knyaz Boris I &quot; 
              Asenovgrad and 
              commenced my university studies at &quot;Paisii Hilendarski&quot; 
              in Plovdiv, furthering 
              my pursuit of software development.
            </section>
            <section className="bioHeading">
              <span className="bioParagraph">2023</span>
              I successfully concluded my first internship, as a backend developer 
              utilizing Spring, 
              at Dreamix. Shortly after, I embarked on a second internship as a
               full-stack 
              intern at Re4Life.
            </section>
          </AnimatedSection>
        </div>
      </article>
    )
  }
  
  export default About
  