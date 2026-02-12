import HomeDemo from "./_components/home-demo"
import HomeForWho from "./_components/home-for-who"
import HomeHero from "./_components/home-hero"
import HomeTestimonial from "./_components/home-testimonial"
import HomeWhyUs from "./_components/home-why-us"
import HomeAboutSection from "./_components/home-about-us"
import HomeHowItWorks from "./_components/home-how-it-works"
import HomeFaq from "./_components/home-faq"
import { AnimatedPage } from "./_components/page-animations"

export default function Home() {
  return (
    <AnimatedPage className="min-h-screen">
      <HomeHero />
      <HomeAboutSection />
      <HomeHowItWorks />
      <HomeWhyUs />
      <HomeForWho />
      <HomeTestimonial />
      <HomeFaq />
      <HomeDemo />
    </AnimatedPage>
  )
}
