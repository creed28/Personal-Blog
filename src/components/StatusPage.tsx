import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';

import SadFace from './icons/SadFace';
import { Button } from './ui/Button';

type StatusPageProps = {
  title: ReactNode
  message: ReactNode
  action?: ReactNode
}

const StatusPage = ({ title, message, action }: StatusPageProps) => (
  <section className="container mx-auto max-w-129.5">
    <div className="flex flex-col items-center justify-center">
      <SadFace />
      <h2 className="mt-8 font-Rounded1c text-4xl font-semibold dark:text-[#EEEEEE]">
        {title}
      </h2>
      <p className="mt-4 text-center font-Rounded1c text-xl dark:text-[#EEEEEE]">
        {message}
      </p>
    </div>
    <hr className="mx-4 my-8" />
    <div className="my-6 flex justify-center gap-x-3">
      {action}
      <Button asChild>
        <Link to="/">Return to home</Link>
      </Button>
    </div>
  </section>
)

export default StatusPage;
