import Image from "next/image"
import {
  AnimatedCard,
  AnimatedList,
  AnimatedListItem,
  AnimatedStagger,
} from "./page-animations"

const forWhoData = [
  {
    id: 1,
    image: "/images/home/for-who/image1.png",
    alt: "Students",
    description:
      "For administrators who require streamlined control of school processes and information.",
  },
  {
    id: 2,
    image: "/images/home/for-who/image2.png",
    alt: "Teachers",
    description:
      "For teachers who require streamlined management of classroom activities and student records.",
  },
  {
    id: 3,
    image: "/images/home/for-who/image3.png",
    alt: "Parents",
    description:
      "For students who want fast, organized access to their timetable, results, and academic updates.",
  },
  {
    id: 4,
    image: "/images/home/for-who/image4.png",
    alt: "Administrators",
    description:
      "For parents who want organized, real-time updates on attendance, results and school activities of their ward.",
  },
]

const HomeForWho = () => {
  return (
    <section
      id="for-who"
      className="flex scroll-mt-9 flex-col gap-6 bg-white pb-8 md:gap-8 md:pb-12 lg:pb-18"
    >
      <div className="container flex flex-col gap-6 md:gap-8">
        <AnimatedList
          className="flex w-full max-w-[1285px] flex-col gap-3 px-4 text-left md:gap-4"
          stagger={0.13}
          viewportAmount={0.3}
        >
          <AnimatedListItem>
            <h2 className="text-2xl font-semibold md:text-3xl">Who is it for?</h2>
          </AnimatedListItem>
          <AnimatedListItem>
            <p className="text-base leading-7 md:text-lg md:leading-8 lg:text-xl">
              With School Base, students, teachers, parents, and administrators stay
              connected to everything they need learning, communication, and school
              management anytime, anywhere.
            </p>
          </AnimatedListItem>
        </AnimatedList>

        <AnimatedStagger
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4"
          stagger={0.14}
        >
          {forWhoData.map((item) => (
            <AnimatedCard key={item.id} className="flex flex-col gap-4 md:gap-6 lg:gap-8">
              <Image
                src={item.image}
                alt={item.alt}
                width={400}
                height={400}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading="lazy"
                className="w-full rounded-2xl"
              />
              <AnimatedList className="flex flex-col" stagger={0.08}>
                <AnimatedListItem>
                  <p className="text-text-secondary text-base md:text-lg">
                    {item.description}
                  </p>
                </AnimatedListItem>
              </AnimatedList>
            </AnimatedCard>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  )
}

export default HomeForWho
