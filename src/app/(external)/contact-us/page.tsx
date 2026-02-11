import ContactForm from "../_components/contact-form"
import { AnimatedBlock, AnimatedPage } from "../_components/page-animations"

export default function ContactPage() {
  return (
    <AnimatedPage className="mx-auto max-w-2xl p-6">
      <AnimatedBlock>
        <h1 className="mb-4 py-5 text-center text-3xl font-bold">Contact Us</h1>
      </AnimatedBlock>
      <AnimatedBlock delay={0.05}>
        <p className="mb-6">
          Fill out the form below and we will get back to you as soon as possible.
        </p>
      </AnimatedBlock>
      <AnimatedBlock delay={0.1}>
        <ContactForm />
      </AnimatedBlock>
    </AnimatedPage>
  )
}
