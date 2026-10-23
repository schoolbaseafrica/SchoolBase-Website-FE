import React from "react"
import { featuresData } from "./_lib/features.data"
import FeatureSection from "./_components/feature-section"
import { ScanFace, Video } from "lucide-react"
import { NewBadge } from "../_components/new-badge"
import {
  AnimatedList,
  AnimatedListItem,
  AnimatedPage,
} from "../_components/page-animations"

const page = () => {
  return (
    <AnimatedPage className="min-h-screen pt-15">
      <div className="container flex flex-col gap-8">
        <AnimatedList
          className="flex flex-col items-center gap-2.5 text-center"
          stagger={0.12}
          viewportAmount={0.3}
        >
          <AnimatedListItem>
            <h1 className="text-lg font-medium text-[#2d2d2d] uppercase md:text-2xl lg:text-3xl">
              WHY YOU SHOULD USE SCHOOL BASE
            </h1>
          </AnimatedListItem>
          <AnimatedListItem>
            <p className="text-sm text-[#535353] sm:text-lg md:text-xl">
              Our platform powers the full student and school lifecycle from admissions to
              graduation.
            </p>
          </AnimatedListItem>
        </AnimatedList>
        <div className="grid gap-4 pt-10 md:grid-cols-2">
          <section className="site-card p-7">
            <span className="site-icon">
              <ScanFace className="size-5" />
            </span>
            <h2 className="mt-5 flex flex-wrap items-center gap-2 text-xl font-semibold">
              NFC & face attendance <NewBadge />
            </h2>
            <p className="mt-3 leading-7 text-[#666]">
              Take attendance manually, with an NFC tap in the mobile app, or with face
              check-in against an approved student photo.
            </p>
          </section>
          <section className="site-card p-7">
            <span className="site-icon">
              <Video className="size-5" />
            </span>
            <h2 className="mt-5 flex flex-wrap items-center gap-2 text-xl font-semibold">
              Virtual classrooms & meetings <NewBadge />
            </h2>
            <p className="mt-3 leading-7 text-[#666]">
              Teachers can open virtual classrooms for their assigned classes. Admins can
              schedule video meetings for invited school members.
            </p>
          </section>
        </div>
        <div className="flex flex-col gap-20 py-10">
          {featuresData.map((data, index) => (
            <FeatureSection
              key={index}
              number={data.number}
              title={data.title}
              description={data.description}
              features={data.listItems}
              imageSrc={data.imageSrc}
              imgWidth={data.imgWidth}
              imgHeight={data.imgHeight}
              isReversed={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </AnimatedPage>
  )
}

export default page
