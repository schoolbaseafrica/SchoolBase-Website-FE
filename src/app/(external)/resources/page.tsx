import BlogCards from "./_components/blog-cards"
import {
  AnimatedBlock,
  AnimatedList,
  AnimatedListItem,
  AnimatedPage,
} from "../_components/page-animations"

const Resources = () => {
  return (
    <AnimatedPage className="min-h-screen pt-15">
      <div className="container flex flex-col gap-8">
        <AnimatedList
          className="flex flex-col items-center gap-2.5 text-center"
          stagger={0.12}
          viewportAmount={0.3}
        >
          <AnimatedListItem>
            <h1 className="text-4xl font-bold uppercase sm:text-5xl md:text-6xl">
              SCHOOL BASE
            </h1>
          </AnimatedListItem>
          <AnimatedListItem>
            <h2 className="max-w-[50ch] text-center text-xl font-medium text-[#535353] sm:text-2xl md:text-3xl">
              Learn how to use School Base to power the full student and school lifecycle
              from admissions to graduation.
            </h2>
          </AnimatedListItem>
          <AnimatedListItem>
            <p className="max-w-[45ch] text-center">
              We have all the guides you need to know how to effectively customize School
              Base.
            </p>
          </AnimatedListItem>
        </AnimatedList>

        <AnimatedBlock delay={0.1}>
          <BlogCards />
        </AnimatedBlock>
      </div>
    </AnimatedPage>
  )
}

export default Resources
