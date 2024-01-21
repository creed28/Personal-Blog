import Link from 'next/link';

const NotFound = () => {
  return (
    <section className="container max-w-[518px] mx-auto">
      <h1 className="text-4xl font-semibold mt-8 dark:text-[#EEEEEE] 
      font-Rounded1c ml-6">
        Not found
      </h1>
      <p className="text-[15px] mt-4 dark:text-[#EEEEEE] 
      font-Rounded1c ml-6">
        The page you&apos;re looking for was not found.
      </p>
      <hr className="my-6 mx-4" />
      <div className="my-6 text-center">
        <Link 
          href="/"
          className="inline-block px-4 py-2 bg-[#319795] hover:bg-[#2C7A7B]
          rounded text-white dark:bg-[#81e6d9] dark:hover:bg-[#4FD1C5] 
          font-semibold dark:text-[#244148]">
          Return to home
        </Link>
      </div>
    </section>
  )
}

export default NotFound
