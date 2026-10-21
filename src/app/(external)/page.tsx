"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ClipboardCheck,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  ShieldCheck,
  Users,
  Video,
  ScanFace,
  Radio,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import WatchDemoButton from "./_components/watch-demo-button"
import {
  AnimatedBlock,
  AnimatedStagger,
  AnimatedStaggerItem,
} from "./_components/page-animations"

const features = [
  {
    icon: ClipboardCheck,
    title: "Smart attendance",
    text: "Record daily attendance manually, by NFC tap, or with face check-in.",
  },
  {
    icon: GraduationCap,
    title: "Results",
    text: "Record grades and share academic progress in one connected place.",
  },
  {
    icon: CreditCard,
    title: "Fees & invoicing",
    text: "See what has been billed, paid, and remains outstanding.",
  },
  {
    icon: CalendarDays,
    title: "Timetables",
    text: "Give teachers and students a clear view of their school day.",
  },
  {
    icon: Users,
    title: "Parent connection",
    text: "Keep families close to attendance, results, and school updates.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based access",
    text: "Give each person the tools and information meant for them.",
  },
]

const audiences = [
  {
    label: "Administrators",
    heading: "A clearer view of your whole school.",
    text: "Manage students, classes, staff, fees, and school activity from one workspace.",
    points: [
      "Organized school records",
      "Fees and payment visibility",
      "Academic oversight",
    ],
    icon: LayoutDashboard,
  },
  {
    label: "Teachers",
    heading: "More time for teaching.",
    text: "See your classes, take attendance, manage assignments, and record results without juggling paper records.",
    points: [
      "Your classes and subjects",
      "Attendance and assignments",
      "Results and exams",
    ],
    icon: BookOpen,
  },
  {
    label: "Students",
    heading: "Everything for the school day.",
    text: "Find classes, timetables, assignments, exams, and results in one familiar place.",
    points: ["Timetable at a glance", "Assignments and exams", "Academic results"],
    icon: GraduationCap,
  },
  {
    label: "Parents",
    heading: "Stay connected to your child’s progress.",
    text: "Follow attendance, results, fees, and school updates from a dedicated parent portal.",
    points: ["Attendance updates", "Results and schoolwork", "Fee information"],
    icon: Users,
  },
]

const faqs = [
  {
    question: "What is SchoolBase?",
    answer:
      "SchoolBase is a digital school management system for administration, academics, attendance, report cards, fees, and parent engagement.",
  },
  {
    question: "Who can use SchoolBase?",
    answer:
      "Administrators, teachers, students, and parents each have a dedicated portal with access suited to their role.",
  },
  {
    question: "How does school setup work?",
    answer:
      "Administrators can create academic sessions, classes, and streams, then assign teachers and students to them.",
  },
  {
    question: "How is access controlled?",
    answer:
      "SchoolBase uses secure sign-in and role-based permissions so people see the information appropriate to them.",
  },
]

export default function Home() {
  const [audience, setAudience] = useState(0)
  const selected = audiences[audience]
  const SelectedIcon = selected.icon

  return (
    <div className="site-home overflow-hidden bg-[#fdfcfc] text-[#252525]">
      <section className="site-section relative pt-16 pb-20 md:pt-24 lg:pt-32 lg:pb-28">
        <div className="site-wrap grid items-center gap-14 lg:grid-cols-[.92fr_1.08fr] lg:gap-16">
          <AnimatedBlock variant="left" className="relative z-10">
            <span className="site-eyebrow inline-flex items-center gap-2 rounded-full border border-[#f1d7d9] bg-white px-4 py-2">
              <span className="bg-accent size-2 rounded-full" /> SCHOOLBASE FOR SCHOOLS
            </span>
            <h1 className="mt-7 max-w-[11ch] text-[clamp(3.25rem,6vw,5.8rem)] leading-[1.03] font-bold tracking-[-.055em]">
              A better way to <span className="text-accent">run your school.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#656565]">
              Bring attendance, live learning, results, fees, and your school community
              together in one connected workspace.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild className="site-button">
                <Link href="/contact-us">
                  Consult Us <ArrowRight className="size-4" />
                </Link>
              </Button>
              <WatchDemoButton className="site-button-outline" />
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-[#ece8e8] pt-6 text-sm text-[#666]">
              <span className="flex items-center gap-2">
                <Check className="text-accent size-4" /> NFC & face attendance
              </span>
              <span className="flex items-center gap-2">
                <Check className="text-accent size-4" /> Virtual classes & meetings
              </span>
            </div>
          </AnimatedBlock>
          <AnimatedBlock
            variant="right"
            className="relative mx-auto w-full max-w-[710px]"
          >
            <div
              className="absolute inset-6 rounded-[2rem] bg-[#fbebec] blur-3xl"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-[#eee5e6] bg-white p-3 shadow-[0_24px_70px_rgba(60,30,35,.12)] sm:p-4">
              <div className="mb-3 flex items-center gap-1.5 px-2">
                <i className="size-2 rounded-full bg-[#e9b7bc]" />
                <i className="size-2 rounded-full bg-[#e9d7d9]" />
                <i className="size-2 rounded-full bg-[#e9d7d9]" />
                <span className="ml-3 text-xs font-medium text-[#777]">
                  SchoolBase workspace
                </span>
              </div>
              <Image
                src="/assets/Hero-img (2).png"
                alt="Preview of the SchoolBase dashboard"
                width={1050}
                height={599}
                priority
                sizes="(max-width: 1024px) 100vw, 52vw"
                className="h-auto w-full rounded-xl border border-[#f2eded]"
              />
            </div>
            <div className="site-float-card absolute -bottom-7 -left-4 hidden items-center gap-3 rounded-2xl p-4 sm:flex lg:-left-10">
              <span className="site-icon">
                <ClipboardCheck className="size-5" />
              </span>
              <span>
                <strong className="block text-sm">Attendance</strong>
                <small className="text-[#777]">Clear daily records</small>
              </span>
            </div>
            <div className="site-float-card absolute -top-8 -right-2 hidden items-center gap-3 rounded-2xl p-4 sm:flex lg:-right-8">
              <span className="site-icon">
                <CreditCard className="size-5" />
              </span>
              <span>
                <strong className="block text-sm">School fees</strong>
                <small className="text-[#777]">Easy to track</small>
              </span>
            </div>
          </AnimatedBlock>
        </div>
      </section>

      <section className="site-section border-y border-[#f0e9ea] bg-white py-20 md:py-28">
        <div className="site-wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
          <AnimatedBlock variant="left">
            <p className="site-eyebrow">THE EVERYDAY CHALLENGE</p>
            <h2 className="site-heading mt-4">
              School work is connected.{" "}
              <span className="text-accent">Your records should be too.</span>
            </h2>
            <p className="site-copy mt-6">
              When attendance, grades, fees, and messages sit in different places, it
              takes longer to get a clear picture. SchoolBase brings those everyday tasks
              into one school workspace.
            </p>
          </AnimatedBlock>
          <AnimatedBlock variant="right" className="grid gap-4 sm:grid-cols-2">
            <div className="site-card border-[#f4d8db] bg-[#fff8f8] p-6">
              <span className="site-eyebrow">SCATTERED</span>
              <ul className="mt-5 space-y-4 text-[#6e6263]">
                <li>Paper attendance sheets</li>
                <li>Results in separate files</li>
                <li>Fee questions in messages</li>
              </ul>
            </div>
            <div className="site-card p-6">
              <span className="site-eyebrow">WITH SCHOOLBASE</span>
              <ul className="mt-5 space-y-4 font-medium">
                <li className="flex gap-2">
                  <Check className="text-accent size-5 shrink-0" /> Connected records
                </li>
                <li className="flex gap-2">
                  <Check className="text-accent size-5 shrink-0" /> Clear academic
                  progress
                </li>
                <li className="flex gap-2">
                  <Check className="text-accent size-5 shrink-0" /> Fees at a glance
                </li>
              </ul>
            </div>
          </AnimatedBlock>
        </div>
      </section>

      <section id="features" className="site-section py-20 md:py-28">
        <div className="site-wrap">
          <AnimatedBlock className="mx-auto max-w-2xl text-center">
            <p className="site-eyebrow">ONE CONNECTED PLATFORM</p>
            <h2 className="site-heading mt-4">
              Everything your school needs to{" "}
              <span className="text-accent">move forward.</span>
            </h2>
            <p className="site-copy mt-5">
              Practical tools for the work your school does every day.
            </p>
          </AnimatedBlock>
          <AnimatedStagger
            className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.08}
          >
            {features.map(({ icon: Icon, title, text }) => (
              <AnimatedStaggerItem key={title} className="site-card group p-6 md:p-8">
                <span className="site-icon">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-7 text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-3 leading-7 text-[#666]">{text}</p>
              </AnimatedStaggerItem>
            ))}
          </AnimatedStagger>
          <div className="mt-9 text-center">
            <Link
              href="/features"
              className="text-accent inline-flex items-center gap-2 font-semibold hover:underline"
            >
              Explore all features <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section
        id="connected-school"
        className="site-section border-y border-[#f0e9ea] bg-white py-20 md:py-28"
      >
        <div className="site-wrap">
          <AnimatedBlock className="mx-auto max-w-2xl text-center">
            <p className="site-eyebrow">BEYOND THE BASICS</p>
            <h2 className="site-heading mt-4">
              A school that stays{" "}
              <span className="text-accent">present and connected.</span>
            </h2>
            <p className="site-copy mt-5">
              Take attendance in the way that fits your school, teach online, and bring
              your community together.
            </p>
          </AnimatedBlock>
          <AnimatedStagger className="mt-12 grid gap-5 lg:grid-cols-2" stagger={0.12}>
            <AnimatedStaggerItem className="site-card p-7 sm:p-9">
              <span className="site-icon">
                <ScanFace className="size-5" />
              </span>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight">
                Attendance that fits your day
              </h3>
              <p className="mt-3 max-w-lg leading-7 text-[#666]">
                Record student attendance manually, with an NFC tap, or with face check-in
                against an approved student photo. Keep the record in one place.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {["Manual", "NFC tap", "Face check-in"].map((method) => (
                  <span
                    key={method}
                    className="rounded-full border border-[#f0dee0] bg-[#fff8f9] px-3 py-1.5 text-sm font-medium text-[#8c3740]"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </AnimatedStaggerItem>
            <AnimatedStaggerItem className="site-card p-7 sm:p-9">
              <span className="site-icon">
                <Video className="size-5" />
              </span>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight">
                Classrooms and meetings, online
              </h3>
              <p className="mt-3 max-w-lg leading-7 text-[#666]">
                Teachers can open virtual classrooms for their assigned classes.
                Administrators can schedule video meetings and invite the people who need
                to join.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#f0dee0] bg-[#fff8f9] px-3 py-1.5 text-sm font-medium text-[#8c3740]">
                  <Radio className="size-4" /> Virtual classrooms
                </span>
                <span className="rounded-full border border-[#f0dee0] bg-[#fff8f9] px-3 py-1.5 text-sm font-medium text-[#8c3740]">
                  Scheduled meetings
                </span>
              </div>
            </AnimatedStaggerItem>
          </AnimatedStagger>
        </div>
      </section>

      <section
        id="how-it-works"
        className="site-section border-y border-[#f0e9ea] bg-white py-20 md:py-28"
      >
        <div className="site-wrap">
          <AnimatedBlock className="mx-auto max-w-2xl text-center">
            <p className="site-eyebrow">HOW IT WORKS</p>
            <h2 className="site-heading mt-4">
              From setup to a <span className="text-accent">clearer school day.</span>
            </h2>
          </AnimatedBlock>
          <AnimatedStagger
            className="relative mt-14 grid gap-5 md:grid-cols-3"
            stagger={0.12}
          >
            {[
              {
                n: "01",
                title: "Set up your school",
                text: "Create your sessions, classes, students, teachers, and fee structure.",
              },
              {
                n: "02",
                title: "Run daily activities",
                text: "Take attendance, manage learning, record results, and stay in touch.",
              },
              {
                n: "03",
                title: "See the full picture",
                text: "Follow academic progress and school activity from connected records.",
              },
            ].map((step) => (
              <AnimatedStaggerItem key={step.n} className="site-card relative p-7 md:p-8">
                <span className="site-icon text-sm font-bold">{step.n}</span>
                <h3 className="mt-8 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 leading-7 text-[#666]">{step.text}</p>
              </AnimatedStaggerItem>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      <section id="for-who" className="site-section py-20 md:py-28">
        <div className="site-wrap">
          <AnimatedBlock className="mx-auto max-w-2xl text-center">
            <p className="site-eyebrow">MADE FOR YOUR COMMUNITY</p>
            <h2 className="site-heading mt-4">
              Everyone has a place in <span className="text-accent">SchoolBase.</span>
            </h2>
          </AnimatedBlock>
          <div
            role="tablist"
            aria-label="Choose a school role"
            className="mt-10 flex flex-wrap justify-center gap-2"
          >
            {audiences.map((item, index) => (
              <button
                key={item.label}
                type="button"
                role="tab"
                id={`audience-tab-${index}`}
                aria-selected={audience === index}
                aria-controls="audience-panel"
                onClick={() => setAudience(index)}
                className={`focus-visible:outline-accent rounded-full border px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${audience === index ? "border-accent bg-accent text-white shadow-[0_5px_15px_rgba(218,55,67,.16)]" : "hover:border-accent hover:text-accent border-[#eadfe0] bg-white text-[#555]"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div
            id="audience-panel"
            role="tabpanel"
            aria-labelledby={`audience-tab-${audience}`}
            className="site-card mx-auto mt-6 grid min-h-80 max-w-5xl items-center gap-8 p-8 sm:p-12 md:grid-cols-[1.2fr_.8fr]"
          >
            <div>
              <span className="site-icon">
                <SelectedIcon className="size-5" />
              </span>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight sm:text-3xl">
                {selected.heading}
              </h3>
              <p className="site-copy mt-4">{selected.text}</p>
              <Link
                href="/modules"
                className="text-accent mt-6 inline-flex items-center gap-2 font-semibold hover:underline"
              >
                Explore modules <ArrowRight className="size-4" />
              </Link>
            </div>
            <ul className="grid gap-3">
              {selected.points.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-3 rounded-xl border border-[#f1e9ea] bg-[#fffafa] px-4 py-3 font-medium"
                >
                  <Check className="text-accent size-5 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="site-section bg-[#28262a] py-20 text-white md:py-28">
        <div className="site-wrap grid items-center gap-12 lg:grid-cols-2">
          <AnimatedBlock variant="left">
            <p className="site-eyebrow text-[#ffb9bf]">WHY SCHOOLBASE</p>
            <h2 className="site-heading mt-4 text-white">
              Less chasing records.{" "}
              <span className="text-[#ff9da6]">More time for learning.</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
              Give each person a useful view of school life while keeping the full picture
              connected for your team.
            </p>
            <Button
              asChild
              className="site-button mt-8 bg-white text-[#28262a] hover:bg-[#fff3f4]"
            >
              <Link href="/about">
                Learn about SchoolBase <ArrowRight className="size-4" />
              </Link>
            </Button>
          </AnimatedBlock>
          <AnimatedBlock variant="right" className="grid gap-4 sm:grid-cols-2">
            {[
              "One school workspace",
              "Clearer communication",
              "Organized daily work",
              "Access for every role",
            ].map((point, index) => (
              <div
                key={point}
                className="rounded-2xl border border-white/15 bg-white/5 p-6"
              >
                <span className="text-sm font-bold text-[#ff9da6]">0{index + 1}</span>
                <p className="mt-8 text-lg font-semibold">{point}</p>
              </div>
            ))}
          </AnimatedBlock>
        </div>
      </section>

      <section id="faq" className="site-section bg-white py-20 md:py-28">
        <div className="site-wrap max-w-[900px]">
          <AnimatedBlock className="text-center">
            <p className="site-eyebrow">FAQ</p>
            <h2 className="site-heading mt-4">Common questions.</h2>
          </AnimatedBlock>
          <div className="mt-10 space-y-3">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="site-faq group rounded-2xl border border-[#eee5e6] bg-white px-5 py-4 sm:px-7"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-semibold marker:hidden">
                  {faq.question}
                  <span className="text-accent text-2xl font-light transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl leading-7 text-[#666]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section bg-white pb-20 md:pb-28">
        <div className="site-wrap">
          <div className="bg-accent rounded-[2rem] px-7 py-12 text-white sm:px-12 md:flex md:items-center md:justify-between md:gap-8 md:py-16">
            <div>
              <p className="text-xs font-bold tracking-[.18em] text-white/75">
                LET’S GET STARTED
              </p>
              <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
                Ready for a more connected school?
              </h2>
              <p className="mt-4 max-w-xl text-white/85">
                Talk with us about bringing SchoolBase to your school.
              </p>
            </div>
            <div className="mt-7 shrink-0 md:mt-0">
              <Button
                asChild
                className="site-button text-accent bg-white hover:bg-[#fff3f4]"
              >
                <Link href="/contact-us">
                  Consult Us <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
