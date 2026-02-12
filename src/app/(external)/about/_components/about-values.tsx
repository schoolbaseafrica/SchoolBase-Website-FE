import React from "react"
import { MdRocketLaunch, MdRemoveRedEye } from "react-icons/md"
import {
  AnimatedCard,
  AnimatedList,
  AnimatedListItem,
  AnimatedStagger,
} from "../../_components/page-animations"

const values = [
  {
    title: "Our Mission",
    description:
      "To empower Nigerian schools with accessible, high-quality technology to improve administration and educational outcomes.",
    icon: MdRocketLaunch,
  },
  {
    title: "Our Vision",
    description:
      "To become the standard for school management systems across Nigeria, fostering a digitally-enabled education ecosystem.",
    icon: MdRemoveRedEye,
  },
]

const AboutValues = () => {
  return (
    <section className="bg-white py-14">
      <AnimatedStagger className="container grid gap-5 md:grid-cols-2" stagger={0.14}>
        {values.map((value) => (
          <AnimatedCard
            key={value.title}
            className="flex flex-col gap-6 rounded-2xl border border-[#2d2d2d]/15 bg-[#F8F8F8] px-8 py-12"
          >
            <div className="flex items-center gap-2">
              <value.icon className="text-accent" size={32} />
              <p className="text-lg font-semibold text-[#2d2d2d] sm:text-xl md:text-2xl">
                {value.title}
              </p>
            </div>
            <AnimatedList className="flex flex-col" stagger={0.08}>
              <AnimatedListItem>
                <p className="text-sm text-[#535353] md:text-lg">{value.description}</p>
              </AnimatedListItem>
            </AnimatedList>
          </AnimatedCard>
        ))}
      </AnimatedStagger>
    </section>
  )
}

export default AboutValues
