import HowItWorksHero from "./_components/how-it-works-hero"
import ReadyToSimplify from "./_components/how-it-works-ready-to-simplify"
import HowItWorksFeaturesPage from "./_components/how-works-features"
import { AnimatedPage } from "../_components/page-animations"

const HowItWorks = () => {
  return (
    <AnimatedPage>
      <HowItWorksHero />
      <HowItWorksFeaturesPage />
      <ReadyToSimplify />
    </AnimatedPage>
  )
}

export default HowItWorks
