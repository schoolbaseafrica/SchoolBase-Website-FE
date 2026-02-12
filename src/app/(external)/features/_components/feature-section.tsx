import Image from "next/image"
import { IoIosCheckbox } from "react-icons/io"
import {
  AnimatedBlock,
  AnimatedList,
  AnimatedListItem,
  AnimatedStagger,
  AnimatedStaggerItem,
} from "../../_components/page-animations"

interface FeatureSectionProps {
  number: number
  title: string
  description: string
  features: string[]
  imageSrc: string
  isReversed?: boolean
  imgWidth?: number
  imgHeight?: number
}

const FeatureSection = ({
  number,
  title,
  description,
  features,
  imageSrc,
  isReversed = false,
  imgWidth = 700,
  imgHeight = 600,
}: FeatureSectionProps) => {
  return (
    <section
      className={`flex flex-col items-center gap-15 ${
        isReversed ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      <AnimatedStagger
        className={`flex w-fit flex-col gap-4 ${
          isReversed ? "justify-self-end" : "justify-self-start"
        }`}
        stagger={0.12}
        viewportAmount={0.25}
      >
        <AnimatedStaggerItem>
          <div className="flex w-fit items-center gap-4 rounded-md border border-[#2d2d2d]/30 p-1 pr-2">
            <p className="bg-accent flex size-9 items-center justify-center rounded-sm text-3xl font-bold text-white">
              {number}
            </p>
            <p className="text-lg font-bold text-[#2d2d2d] sm:text-xl">{title}</p>
          </div>
        </AnimatedStaggerItem>

        <AnimatedStaggerItem>
          <p className="text-base font-medium text-[#2d2d2d] md:text-lg">{description}</p>
        </AnimatedStaggerItem>

        <AnimatedList className="flex flex-col gap-2" stagger={0.09} delayChildren={0.08}>
          {features.map((feature) => (
            <AnimatedListItem
              key={feature}
              className="flex items-center gap-2"
              variant="left"
            >
              <IoIosCheckbox className="size-6 shrink-0 rounded-xl text-[#10B981]" />
              <p className="text-sm text-[#535353] md:text-lg">{feature}</p>
            </AnimatedListItem>
          ))}
        </AnimatedList>
      </AnimatedStagger>

      <AnimatedBlock
        className={`flex w-full flex-1 ${!isReversed ? "justify-end" : "justify-start"}`}
        variant={isReversed ? "left" : "right"}
        viewportAmount={0.25}
      >
        <Image
          src={imageSrc}
          alt={title}
          width={imgWidth}
          height={imgHeight}
          className="h-auto w-full object-contain"
          style={{ maxWidth: imgWidth }}
        />
      </AnimatedBlock>
    </section>
  )
}

export default FeatureSection
