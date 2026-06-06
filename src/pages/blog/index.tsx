import Link from 'next/link'
import { useState, useEffect } from 'react'

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string | null
  tags: string | null
  createdAt: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 animate-fade-in">
            <p className="text-sm text-[#7b888e] font-mono mb-2">Blog</p>
            <h1 className="text-3xl font-bold text-[#334f52] mb-3">博客</h1>
            <p className="text-[#7b888e] leading-relaxed">
              记录技术学习与成长的点滴，分享开发经验和心得。
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-6 animate-pulse">
                  <div className="h-5 w-32 bg-[#334f52]/5 rounded mb-3" />
                  <div className="h-6 w-3/4 bg-[#334f52]/5 rounded mb-2" />
                  <div className="h-4 w-full bg-[#334f52]/5 rounded mb-4" />
                  <div className="h-3 w-40 bg-[#334f52]/5 rounded" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-[#7b888e] text-lg mb-2">暂无文章</p>
              <p className="text-[#7b888e]/60 text-sm">还没有发布任何博客文章</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="glass-card p-6 block group"
                  style={{ animationDelay: `${0.1 + i * 0.06}s` }}
                >
                  {post.tags && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.split(',').map((tag) => (
                        <span key={tag} className="tag">{tag.trim()}</span>
                      ))}
                    </div>
                  )}
                  <h2 className="text-lg font-semibold text-[#334f52] mb-2 group-hover:text-[#35bfab] transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-[#7b888e] mb-4 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="text-xs text-[#7b888e]/60">
                    {new Date(post.createdAt).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
