import type { FormEvent } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import AnimatedPage from '@/components/AnimatedPage';
import AnimatedSection from '@/components/AnimatedSection';
import SocialsSection from '@/components/SocialsSection';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { CONTACT_EMAIL } from '@/constants/links';
import { pageTitle } from '@/lib/seo';

export const Route = createFileRoute('/contact')({
  head: () => ({ meta: [pageTitle('Contact')] }),
  component: ContactPage
})

type FormSubmitResponse = {
  success?: boolean | string
  message?: string
}

async function sendContactMessage(form: FormData) {
  if (form.get('_honey')) return { success: true };

  const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ ...Object.fromEntries(form), _captcha: 'false' })
  });

  const json = (await res.json().catch(() => ({}))) as FormSubmitResponse
  if (!res.ok || String(json.success) !== 'true') {
    throw new Error(json.message ?? 'Failed to send message')
  };

  return json;
}

function ContactPage() {
  const send = useMutation({ mutationFn: sendContactMessage });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    send.mutate(new FormData(form), {
      onSuccess: () => {
        form.reset()
        toast.success('Thanks! Your message has been sent.')
      },
      onError: error => toast.error(error.message)
    })
  }

  return (
    <AnimatedPage>
      <h2 className="text-center font-Rounded1c text-[1.875rem] font-bold dark:text-[#EEEEEE]">
        Contact Me
      </h2>
      <p className="mt-1 text-center dark:text-[#EEEEEE]">
        Get in touch with me directly at&nbsp;
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="underline underline-offset-4"
        >
          {CONTACT_EMAIL}
        </a>
        &nbsp;or through this form.
      </p>
      <AnimatedSection delay={0.1}>
        <form onSubmit={handleSubmit} className="mt-6 mb-2 flex flex-col">
          <div className="flex w-full flex-col justify-between gap-2 md:flex-row">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              className="formInput"
              required
            />
            <Input
              type="text"
              name="_subject"
              placeholder="Subject"
              className="formInput"
              required
            />
          </div>
          <Textarea
            name="message"
            placeholder="Enter your message..."
            className="formTextArea"
            required
          />
          <input
            type="text"
            name="_honey"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px] h-px w-px opacity-0"
          />
          <div>
            <Button type="submit" size="md" disabled={send.isPending}>
              {send.isPending ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </form>
      </AnimatedSection>
      <div>
        <SocialsSection
          delay={0.2}
          wrapperStyle="md:flex md:justify-center"
          headingStyle="articleHeading"
          listStyle="flex flex-wrap gap-x-1 md:justify-center"
        />
      </div>
    </AnimatedPage>
  );
}
