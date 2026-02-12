import React from "react"
import AboutHero from "./_components/about-hero"
import AboutPerks from "./_components/about-perks"
import AboutValues from "./_components/about-values"
import { AnimatedPage } from "../_components/page-animations"

const page = () => {
  return (
    <AnimatedPage className="min-h-screen">
      <AboutHero />
      <AboutPerks />
      <AboutValues />
    </AnimatedPage>
  )
}

export default page
