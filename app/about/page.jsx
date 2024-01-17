'use client'

import Image from "next/image"

const About = () => {
    return (
      <section>
        <div className="rounded-lg bg-[#F5F0E8] p-3 text-center mb-6 mx-6 md:mx-0">
          Hello, I&apos;m a Computer Science student based in Bulgaria!
        </div>
  
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-0 mx-6 md:mx-0">
          <div className="flex-grow">
            <h2 className="text-[1.875rem] font-bold font-Rounded1c">
              Hristo Zagorliev
            </h2>
            <p className="text-[15px] md:text-[1rem]">
              Digital Craftsman ( Developer / Web Designer / Bookworm )
            </p>
          </div>
          <div className="flex-shrink-0 md:mr-[210px]">
            <Image
              src='/assets/images/hristo.png'
              alt="Profile Image" 
              width={96}
              height={100}
              loading="lazy"
              className="border-[#fff] border-2 border-solid max-w-[100px] 
              inline-block rounded-full" />
          </div>
        </div>
      </section>
    )
  }
  
  export default About
  