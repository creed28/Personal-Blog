'use client'

import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Button } from '../Button';

const Social = () => {
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button size='lg' variant='outline'
        className='w-full border border-[#525252] dark:bg-[#202023] dark:hover:bg-[#323235]'
        onClick={() => {}}>
        <FcGoogle className='h-5 w-5' />
      </Button>
      <Button size='lg' variant='outline'
        className='w-full border border-[#525252] dark:bg-[#202023] dark:hover:bg-[#323235]'
        onClick={() => {}}>
        <FaGithub className='h-5 w-5 dark:text-white' />
      </Button>
    </div>
  )
}

export default Social
