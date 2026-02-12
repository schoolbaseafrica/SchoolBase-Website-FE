"use client"

import type { CSSProperties, ReactNode } from "react"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

export const viewportConfig = {
  once: true,
  amount: 0.2,
  margin: "0px 0px -70px 0px",
}

const easing = [0.22, 1, 0.36, 1] as const

type RevealVariant = "up" | "fade" | "scale" | "left" | "right"

type CommonAnimationProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

type RevealAnimationProps = CommonAnimationProps & {
  delay?: number
  duration?: number
  variant?: RevealVariant
  viewportAmount?: number
}

type StaggerAnimationProps = CommonAnimationProps & {
  stagger?: number
  delayChildren?: number
  viewportAmount?: number
}

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
  },
}

const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
  },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
}

const slideInLeft = {
  hidden: { opacity: 0, x: -28 },
  show: {
    opacity: 1,
    x: 0,
  },
}

const slideInRight = {
  hidden: { opacity: 0, x: 28 },
  show: {
    opacity: 1,
    x: 0,
  },
}

const resolveVariant = (variant: RevealVariant) => {
  if (variant === "fade") return fadeIn
  if (variant === "scale") return scaleIn
  if (variant === "left") return slideInLeft
  if (variant === "right") return slideInRight

  return fadeInUp
}

export const createStaggerContainer = (stagger = 0.12, delayChildren = 0.08) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
})

const withReducedMotion = (
  reduceMotion: boolean | null,
  renderStatic: () => ReactNode,
  renderMotion: () => ReactNode
) => {
  if (reduceMotion) return renderStatic()

  return renderMotion()
}

export function AnimatedPage({
  children,
  className,
  style,
  delay = 0,
  duration = 0.7,
}: RevealAnimationProps) {
  const reduceMotion = useReducedMotion()

  return withReducedMotion(
    reduceMotion,
    () => (
      <div className={className} style={style}>
        {children}
      </div>
    ),
    () => (
      <motion.div
        className={className}
        style={style}
        initial="hidden"
        animate="show"
        variants={fadeIn}
        transition={{ duration, delay, ease: easing }}
      >
        {children}
      </motion.div>
    )
  )
}

export function AnimatedSection({
  children,
  className,
  style,
  delay = 0,
  duration = 0.7,
  variant = "up",
  viewportAmount,
}: RevealAnimationProps) {
  const reduceMotion = useReducedMotion()

  return withReducedMotion(
    reduceMotion,
    () => (
      <section className={className} style={style}>
        {children}
      </section>
    ),
    () => (
      <motion.section
        className={className}
        style={style}
        initial="hidden"
        whileInView="show"
        viewport={{ ...viewportConfig, amount: viewportAmount ?? viewportConfig.amount }}
        variants={resolveVariant(variant)}
        transition={{ duration, delay, ease: easing }}
      >
        {children}
      </motion.section>
    )
  )
}

export function AnimatedBlock({
  children,
  className,
  style,
  delay = 0,
  duration = 0.7,
  variant = "up",
  viewportAmount,
}: RevealAnimationProps) {
  const reduceMotion = useReducedMotion()

  return withReducedMotion(
    reduceMotion,
    () => (
      <div className={className} style={style}>
        {children}
      </div>
    ),
    () => (
      <motion.div
        className={className}
        style={style}
        initial="hidden"
        whileInView="show"
        viewport={{ ...viewportConfig, amount: viewportAmount ?? viewportConfig.amount }}
        variants={resolveVariant(variant)}
        transition={{ duration, delay, ease: easing }}
      >
        {children}
      </motion.div>
    )
  )
}

export function AnimatedStagger({
  children,
  className,
  style,
  stagger = 0.12,
  delayChildren = 0.08,
  viewportAmount,
}: StaggerAnimationProps) {
  const reduceMotion = useReducedMotion()

  return withReducedMotion(
    reduceMotion,
    () => (
      <div className={className} style={style}>
        {children}
      </div>
    ),
    () => (
      <motion.div
        className={className}
        style={style}
        initial="hidden"
        whileInView="show"
        viewport={{ ...viewportConfig, amount: viewportAmount ?? viewportConfig.amount }}
        variants={createStaggerContainer(stagger, delayChildren)}
      >
        {children}
      </motion.div>
    )
  )
}

export function AnimatedStaggerItem({
  children,
  className,
  style,
  delay = 0,
  duration = 0.72,
  variant = "up",
}: RevealAnimationProps) {
  const reduceMotion = useReducedMotion()

  return withReducedMotion(
    reduceMotion,
    () => (
      <div className={className} style={style}>
        {children}
      </div>
    ),
    () => (
      <motion.div
        className={cn(className)}
        style={style}
        variants={resolveVariant(variant)}
        transition={{ duration, delay, ease: easing }}
      >
        {children}
      </motion.div>
    )
  )
}

export function AnimatedList({
  children,
  className,
  style,
  stagger = 0.1,
  delayChildren = 0.04,
  viewportAmount,
}: StaggerAnimationProps) {
  const reduceMotion = useReducedMotion()

  return withReducedMotion(
    reduceMotion,
    () => (
      <ul className={className} style={style}>
        {children}
      </ul>
    ),
    () => (
      <motion.ul
        className={className}
        style={style}
        initial="hidden"
        whileInView="show"
        viewport={{ ...viewportConfig, amount: viewportAmount ?? viewportConfig.amount }}
        variants={createStaggerContainer(stagger, delayChildren)}
      >
        {children}
      </motion.ul>
    )
  )
}

export function AnimatedListItem({
  children,
  className,
  style,
  delay = 0,
  duration = 0.68,
  variant = "up",
}: RevealAnimationProps) {
  const reduceMotion = useReducedMotion()

  return withReducedMotion(
    reduceMotion,
    () => (
      <li className={className} style={style}>
        {children}
      </li>
    ),
    () => (
      <motion.li
        className={className}
        style={style}
        variants={resolveVariant(variant)}
        transition={{ duration, delay, ease: easing }}
      >
        {children}
      </motion.li>
    )
  )
}

export function AnimatedReveal(props: RevealAnimationProps) {
  return <AnimatedBlock {...props} />
}

export function AnimatedCard(props: RevealAnimationProps) {
  return <AnimatedBlock {...props} variant="scale" />
}
