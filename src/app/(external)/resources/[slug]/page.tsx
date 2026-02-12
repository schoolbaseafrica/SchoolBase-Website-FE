import React from "react"
import BackButton from "../_components/back-button"
import BlogArticle from "../_components/blog-article"
import { articles } from "../_data/article"
import {
  AnimatedList,
  AnimatedListItem,
  AnimatedPage,
} from "../../_components/page-animations"

type PostContent = { type: "paragraph"; text: string } | { type: "list"; items: string[] }

type Post = {
  key: string
  heading: string
  content: PostContent[]
}

type Article = {
  id: number
  heading: string
  subheading?: string
  slug: string
  date: string
  posts: Post[]
}

type BlogPageProps = {
  params: Promise<{ slug: string }>
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params
  const article: Article | undefined = articles.find((a) => a.slug === slug)

  if (!article) {
    return (
      <AnimatedPage className="min-h-60 p-10 text-center">
        <BackButton />
        <p>Article not found.</p>
      </AnimatedPage>
    )
  }

  return (
    <AnimatedPage>
      <BlogArticle title={article.heading} date={article.date}>
        {article.posts.map((post) => (
          <AnimatedList key={post.key} className="mb-8" stagger={0.1}>
            {post.heading && (
              <AnimatedListItem>
                <h2 className="mb-3 text-2xl font-semibold">{post.heading}</h2>
              </AnimatedListItem>
            )}

            {post.content.map((block, i) => {
              if (block.type === "paragraph") {
                return (
                  <AnimatedListItem key={`${post.key}-paragraph-${i}`}>
                    <p className="mb-4">{block.text}</p>
                  </AnimatedListItem>
                )
              }

              if (block.type === "list") {
                return (
                  <AnimatedListItem key={`${post.key}-list-${i}`}>
                    <AnimatedList
                      className="mb-4 list-disc space-y-2 pl-6"
                      stagger={0.08}
                    >
                      {block.items.map((item, j) => (
                        <AnimatedListItem key={`${post.key}-item-${j}`}>
                          {item}
                        </AnimatedListItem>
                      ))}
                    </AnimatedList>
                  </AnimatedListItem>
                )
              }

              return null
            })}
          </AnimatedList>
        ))}
      </BlogArticle>
    </AnimatedPage>
  )
}
