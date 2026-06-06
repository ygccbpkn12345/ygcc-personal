import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string | null
  tags: string | null
  createdAt: string
}

export default function BlogDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/blogs?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setPost(null)
        } else {
          setPost(data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-12 animate-pulse">
            <div className="h-4 w-20 bg-[#334f52]/5 rounded mb-6" />
            <div className="h-8 w-3/4 bg-[#334f52]/5 rounded mb-3" />
            <div className="h-4 w-32 bg-[#334f52]/5 rounded mb-8" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-[#334f52]/5 rounded" />
              <div className="h-4 w-full bg-[#334f52]/5 rounded" />
              <div className="h-4 w-2/3 bg-[#334f52]/5 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="glass-card p-12">
            <p className="text-4xl mb-4">📄</p>
            <h1 className="text-xl font-bold text-[#334f52] mb-2">文章未找到</h1>
            <p className="text-sm text-[#7b888e] mb-6">该文章不存在或已被删除</p>
            <Link href="/blog" className="btn-primary text-sm">
              ← 返回博客列表
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <article className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10 animate-fade-in">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm text-[#7b888e] hover:text-[#35bfab] transition-colors mb-6"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回博客列表
            </Link>

            {post.tags && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.split(',').map((tag) => (
                  <span key={tag} className="tag">{tag.trim()}</span>
                ))}
              </div>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-[#334f52] mb-3 leading-tight">
              {post.title}
            </h1>
            <p className="text-sm text-[#7b888e]/60">
              {new Date(post.createdAt).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })}
            </p>
          </div>

          <div className="glass-card p-8 md:p-10">
            <div className="prose-custom">
              {post.content.split('\n').map((line, i) => {
                if (line.startsWith('## ')) {
                  return <h2 key={i} className="text-xl font-bold text-[#334f52] mt-8 mb-4">{line.slice(3)}</h2>
                }
                if (line.startsWith('### ')) {
                  return <h3 key={i} className="text-lg font-semibold text-[#334f52] mt-6 mb-3">{line.slice(4)}</h3>
                }
                if (line.startsWith('- **')) {
                  const match = line.match(/- \*\*(.+?)\*\*[：:]?\s*(.*)/)
                  if (match) {
                    return (
                      <p key={i} className="text-[#7b888e] mb-2 ml-4 text-sm leading-relaxed">
                        <strong className="text-[#334f52] font-semibold">{match[1]}</strong>：{match[2]}
                      </p>
                    )
                  }
                }
                if (line.startsWith('- ')) {
                  return <li key={i} className="text-[#7b888e] ml-4 mb-1.5 text-sm">{line.slice(2)}</li>
                }
                if (line.trim() === '') {
                  return <div key={i} className="h-3" />
                }
                if (line.startsWith('```')) {
                  return null
                }
                return <p key={i} className="text-[#7b888e] leading-relaxed mb-3 text-sm">{line}</p>
              })}
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
