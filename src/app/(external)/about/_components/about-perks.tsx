import React from "react"
import { PiCodeSimpleBold } from "react-icons/pi"
import { FaMobile, FaLocationDot } from "react-icons/fa6"
import { BiShieldQuarter } from "react-icons/bi"
import {
  AnimatedCard,
  AnimatedList,
  AnimatedListItem,
  AnimatedStagger,
} from "../../_components/page-animations"

const perks = [
  {
    title: "Open Source",
    description:
      "Community-driven, cost-effective, and customizable to fit your school's unique needs.",
    icon: PiCodeSimpleBold,
  },
  {
    title: "Mobile-First",
    description:
      "Accessible on any device, ensuring parents, teachers, and students are always connected.",
    icon: FaMobile,
  },
  {
    title: "Local & Relevant",
    description:
      "Tailored features that meet the specific requirements of the Nigerian education system.",
    icon: FaLocationDot,
  },
  {
    title: "Secure & Structured",
    description:
      "Prioritizing data privacy and security with organized, reliable information management.",
    icon: BiShieldQuarter,
  },
]

const AboutPerks = () => {
  return (
    <section className="bg-[#FBFBFB] py-8">
      <div className="container flex flex-col gap-20 xl:flex-row">
        <AnimatedList className="flex max-w-120 flex-col gap-4 md:gap-6" stagger={0.13}>
          <AnimatedListItem>
            <h2 className="text-lg font-medium sm:text-2xl lg:text-3xl">
              We&apos;re building the future of school management in Nigeria
            </h2>
          </AnimatedListItem>
          <AnimatedListItem>
            <p className="text-sm leading-7 text-[#535353] md:text-lg">
              School Base is an all-in-one, free platform designed for Nigerian schools.
              It simplifies school administration with features for attendance tracking,
              result processing, fee management, student information systems, and seamless
              parent-teacher communication.
            </p>
          </AnimatedListItem>
        </AnimatedList>

        <AnimatedStagger className="grid gap-4 md:grid-cols-2 md:gap-6" stagger={0.12}>
          {perks.map((perk) => (
            <AnimatedCard
              key={perk.title}
              className="flex flex-col gap-8 rounded-lg border border-[#2d2d2d]/15 bg-white px-5 py-10"
            >
              <perk.icon className="text-accent" size={32} />
              <AnimatedList className="flex flex-col gap-2" stagger={0.08}>
                <AnimatedListItem>
                  <h3 className="text-lg font-semibold text-[#2d2d2d] sm:text-xl md:text-2xl">
                    {perk.title}
                  </h3>
                </AnimatedListItem>
                <AnimatedListItem>
                  <p className="text-sm text-[#535353] md:text-lg">{perk.description}</p>
                </AnimatedListItem>
              </AnimatedList>
            </AnimatedCard>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  )
}

export default AboutPerks
