import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  AnimatedList,
  AnimatedListItem,
  AnimatedStagger,
  AnimatedStaggerItem,
} from "../../_components/page-animations"

export default function FAQAccordion() {
  const faqs = [
    {
      question: "What is school base?",
      answer:
        "School Base is a comprehensive all-in-one school management system designed to streamline administrative tasks. It helps schools manage students, track attendance, process fees, generate reports, and integrate NFC smart ID cards for secure access and tracking. The platform centralizes all your school's operations in one easy-to-use interface.",
    },
    {
      question: "Is there a cost to join waitlist?",
      answer:
        "No, joining the waitlist is completely free! By signing up early, you'll get priority access when we launch and receive exclusive updates about new features. Early waitlist members may also qualify for special launch pricing and promotional offers once the platform goes live.",
    },
    {
      question: "How does data security work?",
      answer:
        "We take data security very seriously. Your school's data is protected with enterprise-grade encryption both in transit and at rest. We implement strict access controls, regular security audits, and comply with international data protection standards. All data is backed up regularly, and we maintain redundant systems to ensure your information is always safe and accessible.",
    },
  ]

  return (
    <section className="w-full bg-white py-10 md:py-16">
      <div className="container w-full space-y-8">
        <AnimatedList className="space-y-3" stagger={0.12}>
          <AnimatedListItem>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Frequently Asked Questions
            </h2>
          </AnimatedListItem>
        </AnimatedList>

        <AnimatedStagger stagger={0.1} delayChildren={0.04}>
          <Accordion type="single" collapsible className="flex flex-col gap-2 py-3">
            {faqs.map((faq, index) => (
              <AnimatedStaggerItem key={faq.question}>
                <AccordionItem
                  value={`item-${index}`}
                  className="rounded-lg border border-gray-200"
                >
                  <AccordionTrigger className="p-3 text-lg md:p-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="p-3 text-lg md:px-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </AnimatedStaggerItem>
            ))}
          </Accordion>
        </AnimatedStagger>
      </div>
    </section>
  )
}
