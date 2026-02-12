import { Button } from "@/components/ui/button"
import Link from "next/link"
import WatchDemoButton from "./demo-video2"
import {
  AnimatedCard,
  AnimatedList,
  AnimatedListItem,
  AnimatedStagger,
  AnimatedStaggerItem,
} from "../../_components/page-animations"

const ReadyToSimplify = () => {
  return (
    <section className="mt-24 mb-48 flex w-full justify-center px-4">
      <AnimatedCard className="bg-accent flex max-w-[1069px] flex-col justify-center rounded-xl pt-12 pb-14 max-sm:w-[361px] sm:w-full">
        <AnimatedList
          className="mx-auto max-md:mb-[25px] max-sm:w-[293px] sm:px-20 md:mb-8"
          stagger={0.14}
        >
          <AnimatedListItem>
            <h1 className="text-center leading-[160%] font-bold text-[#FAFAFA] max-md:mb-[9px] max-md:text-[18px] md:mb-6 md:text-[32px]">
              Ready to Simplify Your School?
            </h1>
          </AnimatedListItem>
          <AnimatedListItem>
            <p className="text-center leading-[120%] font-normal text-pretty text-[#EBEBEB] max-md:text-sm md:text-[24px]">
              Join hundreds of schools who have streamlined their operations with School
              Base. Get started today.
            </p>
          </AnimatedListItem>
        </AnimatedList>

        <AnimatedStagger
          className="mx-auto flex items-center justify-center gap-4 max-md:w-[214px] md:w-[358px]"
          stagger={0.14}
        >
          <AnimatedStaggerItem variant="left">
            <Link href="/login">
              <Button
                variant="tertiary"
                size="sm"
                className="rounded max-md:w-24 max-md:text-[12px] md:h-12 md:w-[167px] md:text-lg"
              >
                Get Started
              </Button>
            </Link>
          </AnimatedStaggerItem>

          <AnimatedStaggerItem variant="right">
            <WatchDemoButton />
          </AnimatedStaggerItem>
        </AnimatedStagger>
      </AnimatedCard>
    </section>
  )
}

export default ReadyToSimplify
