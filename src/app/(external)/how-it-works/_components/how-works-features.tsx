"use client"

import React, { CSSProperties } from "react"
import Image from "next/image"
import { useMediaQuery } from "@/hooks/use-media-query"
import { HowItWorksFeatures } from "../_data/features"
import {
  AnimatedBlock,
  AnimatedCard,
  AnimatedList,
  AnimatedListItem,
  AnimatedStagger,
  AnimatedStaggerItem,
} from "../../_components/page-animations"

const HowItWorksFeaturesPage = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  return (
    <article className="font-outfit container mb-40 bg-white px-5 md:px-20 lg:space-y-40">
      <AnimatedStagger className="space-y-40" stagger={0.16} delayChildren={0.06}>
        {HowItWorksFeatures.map((feature, index) => (
          <AnimatedStaggerItem key={feature.id}>
            <section
              className={`grid min-h-[380px] grid-cols-1 md:gap-10 md:p-7 lg:grid-cols-2 ${
                index === 0 ? "gap-48" : "gap-40"
              }`}
            >
              <AnimatedList
                className={`flex flex-col justify-center gap-4 ${
                  index % 2 === 1 ? "lg:order-2" : "lg:order-1"
                }`}
                stagger={0.12}
                viewportAmount={0.2}
              >
                <AnimatedListItem>
                  <p className="text-accent text-3xl font-black lg:text-5xl">
                    {`${index + 1}`.padStart(2, "0")}
                  </p>
                </AnimatedListItem>

                <AnimatedListItem>
                  <h3 className="text-primary text-lg font-bold lg:text-2xl">
                    {feature.header}
                  </h3>
                </AnimatedListItem>

                <AnimatedListItem>
                  <p className="text-text-secondary text-base lg:text-lg">
                    {feature.paragraph}
                  </p>
                </AnimatedListItem>
              </AnimatedList>

              <AnimatedBlock
                className={`relative ${index % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}
                variant={index % 2 === 1 ? "left" : "right"}
                viewportAmount={0.2}
              >
                <AnimatedCard className="bg-accent flex h-[174px] flex-col justify-center rounded-xl p-8 pt-3 md:mt-0 md:h-[388px] md:w-full md:p-10 xl:w-[574px]">
                  <div className="relative h-[138px] rounded-b-xl bg-white md:h-[220px]">
                    <AnimatedStagger className="h-full" stagger={0.1} delayChildren={0.1}>
                      {feature.images.map((image, imgIndex) => {
                        const style: CSSProperties = {
                          position: "absolute",
                          zIndex: image.zIndex,
                          bottom: isDesktop ? image.desktop.bottom : image.mobile.bottom,
                          left: isDesktop ? image.desktop.left : image.mobile.left,
                        }

                        return (
                          <AnimatedStaggerItem
                            key={imgIndex}
                            style={style}
                            variant="scale"
                          >
                            <Image
                              src={image.src}
                              alt={feature.header}
                              width={isDesktop ? image.desktop.width : image.mobile.width}
                              height={
                                isDesktop ? image.desktop.height : image.mobile.height
                              }
                            />
                          </AnimatedStaggerItem>
                        )
                      })}
                    </AnimatedStagger>
                  </div>
                </AnimatedCard>

                {isDesktop ? (
                  <AnimatedBlock
                    className={`absolute ${
                      index % 2 === 1 ? "lg:-right-20" : "lg:-left-40"
                    } ${index === 4 ? "hidden" : "block"}`}
                    delay={0.2}
                    variant={index % 2 === 1 ? "right" : "left"}
                  >
                    {index % 2 === 1 ? (
                      <Image
                        src="/assets/icons/curl-arrow-right.svg"
                        alt="an arrow pointing right"
                        width={220}
                        height={190}
                        className="max-h-[200px]"
                      />
                    ) : (
                      <Image
                        src="/assets/icons/curl-arrow-left.svg"
                        alt="an arrow pointing left"
                        width={220}
                        height={120}
                        className="max-h-[100px] lg:max-h-[200px]"
                      />
                    )}
                  </AnimatedBlock>
                ) : (
                  <AnimatedBlock className="mx-auto w-fit" delay={0.2}>
                    {index < HowItWorksFeatures.length - 1 && (
                      <Image
                        src="/assets/icons/curl-arrow-down.svg"
                        alt="an arrow pointing down"
                        width={61}
                        height={132}
                      />
                    )}
                  </AnimatedBlock>
                )}
              </AnimatedBlock>
            </section>
          </AnimatedStaggerItem>
        ))}
      </AnimatedStagger>
    </article>
  )
}

export default HowItWorksFeaturesPage
