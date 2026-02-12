"use client"

import React from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { articles } from "../_data/article"
import {
  AnimatedCard,
  AnimatedList,
  AnimatedListItem,
  AnimatedStagger,
} from "../../_components/page-animations"

const BlogCards = () => {
  return (
    <section className="w-full py-10">
      <AnimatedStagger
        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        stagger={0.12}
      >
        {articles.map((article) => (
          <AnimatedCard key={article.id}>
            <Card className="rounded-2xl border bg-[#EEEEEE] p-6 shadow-sm transition-all hover:shadow-md">
              <AnimatedList className="space-y-0" stagger={0.1}>
                <AnimatedListItem>
                  <CardHeader className="space-y-3">
                    <span className="text-primary text-xs font-semibold tracking-wide">
                      BLOG
                    </span>
                    <CardTitle className="text-primary text-xl leading-tight capitalize">
                      {article.heading}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      {article.date}
                    </CardDescription>
                  </CardHeader>
                </AnimatedListItem>

                <AnimatedListItem>
                  <CardContent className="flex justify-end">
                    <Link
                      href={`/resources/${article.slug}`}
                      className="text-text-secondary flex items-center gap-2 text-sm font-medium hover:underline"
                    >
                      Read article -&gt;
                    </Link>
                  </CardContent>
                </AnimatedListItem>
              </AnimatedList>
            </Card>
          </AnimatedCard>
        ))}
      </AnimatedStagger>
    </section>
  )
}

export default BlogCards
