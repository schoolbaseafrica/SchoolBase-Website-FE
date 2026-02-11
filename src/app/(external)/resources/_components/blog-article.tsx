"use client"

import React, { ReactNode } from "react"
import BackButton from "./back-button"
import ResourceContactForm from "./resource-contact"
import { articles } from "../_data/article"
import {
  AnimatedList,
  AnimatedListItem,
  AnimatedStagger,
  AnimatedStaggerItem,
} from "../../_components/page-animations"

type BlogArticleProps = {
  title: string
  date: string
  children: ReactNode
}

export default function BlogArticle({ title, date, children }: BlogArticleProps) {
  const articleId = articles.findIndex((article) => article.heading === title)
  const article = articles[articleId]

  return (
    <>
      <BackButton />
      <article className="mx-auto max-w-[1200px] px-5 py-10">
        <AnimatedList className="mb-8" stagger={0.12}>
          <AnimatedListItem>
            <h1 className="mb-2 text-2xl font-bold lg:text-4xl">{title}</h1>
          </AnimatedListItem>
          <AnimatedListItem>
            <p className="text-sm text-gray-500">{date}</p>
          </AnimatedListItem>
        </AnimatedList>

        <AnimatedStagger className="prose prose-lg mb-16 leading-relaxed" stagger={0.08}>
          {React.Children.map(children, (child, index) => (
            <AnimatedStaggerItem key={index}>{child}</AnimatedStaggerItem>
          ))}
        </AnimatedStagger>

        <div className="mt-10 w-full pt-8">
          <ResourceContactForm articleId={article.id} />
        </div>
      </article>
    </>
  )
}
