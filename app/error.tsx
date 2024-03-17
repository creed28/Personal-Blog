'use client'

import Link from 'next/link';
import SadFace from '../public/assets/icons/error';

const ErrorPage = () => {
  return (
    <section className="container max-w-[518px] mx-auto">
      <div className='flex flex-col justify-center items-center'>
        <SadFace />
        <h2 className="text-5xl font-semibold mt-8 dark:text-[#EEEEEE] 
          font-Rounded1c">
          Oops...
        </h2>
        <p className="text-xl mt-4 dark:text-[#EEEEEE] 
          font-Rounded1c">
          Something went wrong!
        </p>
      </div>
      <hr className="my-8 mx-4" />
      <div className="my-6 text-center">
        <Link 
          href="/"
          className="btn inline-block px-4 my-0">
          Return to home
        </Link>
      </div>
    </section>
  )
}

export default ErrorPage
