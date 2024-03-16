import { Metadata } from "next";
import AnimatedSection from "../../components/AnimatedSection";
import AnimatedPage from "../../components/AnimatedPage";
import Link from "next/link";
import SocialsSection from "../../components/SocialsSection";
import { Button } from "../../components/Button";

export const metadata: Metadata = {
  title: 'Contact'
}

const Contact = () => {
  return (
    <AnimatedPage>
      <h2 className="text-[1.875rem] font-bold font-Rounded1c text-center 
        dark:text-[#EEEEEE]">
        Contact Me
      </h2>
      <p className="mt-1 text-center dark:text-[#EEEEEE]">
        Please get in touch with me directly at&nbsp;
        <Link 
          href="mailto:hristozagorliev283@gmail.com" target="_blank" 
          className="bioHighlight">
            hristozagorliev283@gmail.com
        </Link>
        &nbsp;or through this form.
      </p>
      <AnimatedSection delay={0.1}>
          <form 
            action="https://formsubmit.co/hristozagorliev283@gmail.com" 
            method="POST"
            className="mt-6 mb-2 flex flex-col mx-6 md:mx-0">
              <div className="w-full flex md:flex-row justify-between gap-2 flex-col">
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email"
                  className="formInput" 
                  autoFocus
                  required 
                />
                <input 
                  type="text" 
                  name="_subject" 
                  placeholder='Subject'
                  className="formInput"
                  required 
                />
              </div>
              <textarea
                name="message"
                placeholder="Enter your message..."
                className="formTextArea"
                required
              />
              <Button type="submit" size="md">
                Send
              </Button>
              <input type="hidden" name="_next" value='http://localhost:3000/contact' />
              <input type="hidden" name="_captcha" value="false" />
          </form>
      </AnimatedSection>
      <div className="mx-6 md:mx-0">
        <SocialsSection 
          delay={0.2}
          wrapperStyle={'md:flex md:justify-center'}
          headingStyle={'articleHeading md:text-[1.3rem]'}
          listStyle={'md:flex md:justify-center md:gap-x-10'}
          linkStyle={'socialLink md:py-3 md:px-6 md:text-[1.1rem]'}
        />
      </div>
    </AnimatedPage>
  )
}

export default Contact
