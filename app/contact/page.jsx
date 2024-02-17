import AnimatedSection from "../../components/AnimatedSection";
import AnimatedPage from "../../components/AnimatedPage";
import Link from "next/link";

export const metadata = {
  title: 'Contact'
}

const Contact = () => {
  return (
    <AnimatedPage>
      <h2 className="text-[1.875rem] font-bold font-Rounded1c text-center dark:text-[#EEEEEE]">
        Contact Me
      </h2>
      <p className="mt-2 text-center dark:text-[#EEEEEE]">
        Please get in touch with me directly at&nbsp;
        <Link 
          href="mailto:hristozagorliev283@gmail.com" target="_blank" 
          className="underline underline-offset-2">
            hristozagorliev283@gmail.com
        </Link>
        &nbsp;or through this form.
      </p>
      <AnimatedSection delay={0.1}>
          <form 
            action="https://formsubmit.co/hristozagorliev283@gmail.com" 
            method="POST"
            className="mt-10 flex flex-col">
              <div className="w-full flex justify-between gap-2">
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email"
                  className="h-14 rounded-lg bg-[#F5F0E8] outline-[#525252] w-[50%] p-4 
                    dark:bg-[#313134] dark:text-[#E6E6E6] dark:outline-[#EEEEEE] 
                    placeholder-[#7b7b7b]" 
                  required 
                />
                <input 
                  type="text" 
                  name="_subject" 
                  placeholder='Subject'
                  className="h-14 rounded-lg bg-[#F5F0E8] outline-[#525252] w-[50%] p-4
                    dark:bg-[#313134] dark:text-[#E6E6E6] dark:outline-[#EEEEEE]
                    placeholder-[#7b7b7b]"
                  required 
                />
              </div>
              <textarea
                name="message"
                placeholder="Enter a message..."
                className="h-52 my-3 rounded-lg bg-[#F5F0E8] outline-[#525252] p-4 
                  resize-none dark:bg-[#313134] dark:text-[#E6E6E6] dark:outline-[#EEEEEE]
                  placeholder-[#7b7b7b]"
                required
              />
              <button 
                type="submit"
                className="flex bg-[#319795] hover:bg-[#2C7A7B] 
                  p-2 font-semibold rounded-md justify-center
                  my-4 text-center text-white dark:bg-[#81e6d9] 
                  dark:hover:bg-[#4FD1C5] dark:text-[#244148] outline-none 
                  w-[6rem]">
                    Send
              </button>
              <input type="hidden" name="_next" value='http://localhost:3000/contact' />
              <input type="hidden" name="_captcha" value="false" />
          </form>
      </AnimatedSection>
    </AnimatedPage>
  )
}

export default Contact
