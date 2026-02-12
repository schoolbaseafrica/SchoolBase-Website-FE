import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  AnimatedList,
  AnimatedListItem,
  AnimatedStagger,
  AnimatedStaggerItem,
} from "./page-animations"

const HomeAboutSection = () => {
  return (
    <section className="bg-white px-4 py-8 md:py-12 lg:py-20">
      <div className="container flex flex-col-reverse gap-20 md:grid md:grid-cols-2">
        <AnimatedStagger
          className="grid grid-cols-2 gap-5"
          stagger={0.2}
          viewportAmount={0.25}
        >
          <AnimatedStaggerItem variant="scale">
            <Image
              src="/images/home/about/image1.png"
              alt="SchoolBase dashboard on desktop"
              width={500}
              height={800}
              className="max-h-97 w-full max-w-77 rounded-lg"
            />
          </AnimatedStaggerItem>
          <AnimatedStaggerItem variant="scale">
            <Image
              src="/images/home/about/image2.png"
              alt="SchoolBase dashboard on tablet"
              width={500}
              height={800}
              className="mt-25 max-h-97 w-full max-w-77 rounded-lg"
            />
          </AnimatedStaggerItem>
        </AnimatedStagger>

        <AnimatedList
          className="flex flex-col gap-6"
          stagger={0.16}
          viewportAmount={0.25}
        >
          <AnimatedListItem>
            <h2 className="text-lg font-medium sm:text-2xl lg:text-3xl">About Us</h2>
          </AnimatedListItem>
          <AnimatedListItem>
            <p className="text-2xl text-[#535353]">
              We&apos;re Building a Smarter, Connected School Experience
            </p>
          </AnimatedListItem>
          <AnimatedListItem>
            <p className="text-lg text-[#535353]">
              SchoolBase is a modern school management system that helps schools automate
              tasks, improve communication, and give students, teachers, and parents a
              seamless digital experience. We focus on making everyday school operations
              faster, easier, and more transparent.
            </p>
          </AnimatedListItem>
          <AnimatedListItem variant="left">
            <Button asChild className="w-full md:w-fit">
              <Link href="/about">Explore</Link>
            </Button>
          </AnimatedListItem>
        </AnimatedList>
      </div>
    </section>
  )
}

export default HomeAboutSection
