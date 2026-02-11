import { AnimatedList, AnimatedListItem } from "../../_components/page-animations"

const HowItWorksHero = () => {
  return (
    <section className="flex w-full justify-center bg-white px-4 pt-[30px] pb-10 md:pt-20 md:pb-60">
      <AnimatedList
        className="flex max-w-[823px] flex-col items-center gap-4 md:gap-6"
        stagger={0.14}
        viewportAmount={0.35}
      >
        <AnimatedListItem>
          <h1 className="text-text-primary text-center text-[20px] leading-[100%] font-bold sm:text-2xl md:text-[32px]">
            How It Works
          </h1>
        </AnimatedListItem>
        <AnimatedListItem>
          <p className="text-text-secondary text-center text-[18px] leading-[120%] font-normal md:text-2xl">
            A simple, unified explanation of how the entire system works for admins,
            teachers, parents, and students.
          </p>
        </AnimatedListItem>
      </AnimatedList>
    </section>
  )
}

export default HowItWorksHero
