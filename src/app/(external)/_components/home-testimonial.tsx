import React from "react"
import Image from "next/image"
import { testimonials } from "@/data/testimonials"
import {
  AnimatedCard,
  AnimatedList,
  AnimatedListItem,
  AnimatedStagger,
} from "./page-animations"

export default function HomeTestimonial() {
  return (
    <section className="w-full bg-[#fafafa] px-4 py-20 text-black md:px-6 lg:px-8">
      <div className="font-outfit mx-auto max-w-[1285px] px-4">
        <AnimatedList className="mb-12" stagger={0.14} viewportAmount={0.3}>
          <AnimatedListItem>
            <p className="text-primary mb-4 text-lg font-medium">Testimonials</p>
          </AnimatedListItem>
          <AnimatedListItem>
            <h3 className="text-text-secondary mb-4 text-base leading-tight font-semibold md:text-2xl">
              What Students, Staff & Parents Say About School Base
            </h3>
          </AnimatedListItem>
          <AnimatedListItem>
            <p className="text-primary mx-auto max-w-3xl lg:mx-0">
              Real stories from people who use School Base every day to learn, teach, and
              stay organized
            </p>
          </AnimatedListItem>
        </AnimatedList>

        <AnimatedStagger className="grid grid-cols-1 gap-8 lg:grid-cols-2" stagger={0.12}>
          {testimonials.map((testimonial, index) => (
            <AnimatedCard
              key={testimonial.id}
              className="rounded-2xl border border-gray-100 bg-[#EEEEEE] p-4 shadow-lg md:p-8"
            >
              <TestimonialCard testimonial={testimonial} index={index} />
            </AnimatedCard>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  )
}

const TestimonialCard = ({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0]
  index: number
}) => (
  <div className="flex flex-row gap-6 md:gap-8">
    <div className="shrink-0">
      <div className="relative mx-auto h-40 w-32 overflow-hidden rounded-xl shadow-lg md:mx-0 md:h-56 md:w-56 lg:h-60">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 8rem, 14rem"
          priority={index < 2}
        />
      </div>
    </div>

    <AnimatedList className="flex flex-1 flex-col gap-4 md:text-left" stagger={0.08}>
      <AnimatedListItem>
        <h3 className="line-clamp-3 text-sm font-semibold text-gray-900 md:text-xl">
          {testimonial.title}
        </h3>
      </AnimatedListItem>
      <AnimatedListItem>
        <p className="line-clamp-4 text-xs leading-none text-gray-700 md:text-base md:leading-relaxed">
          &ldquo;{testimonial.content}&rdquo;
        </p>
      </AnimatedListItem>
      <AnimatedListItem>
        <div>
          <h4 className="text-primary text-xs font-bold md:text-lg">
            {testimonial.name}
          </h4>
          <p className="text-text-secondary text-xs md:text-sm">{testimonial.role}</p>
        </div>
      </AnimatedListItem>
    </AnimatedList>
  </div>
)
