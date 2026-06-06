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

interface Project {
  id: number
  name: string
  slug: string
  description: string
  techStack: string | null
  featured: boolean
  createdAt: string
}

interface LifePost {
  id: number
  content: string
  createdAt: string
}

export default function Home() {
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([])
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [lifeMoments, setLifeMoments] = useState<LifePost[]>([])
  const [loading, setLoading] = useState(true)

  const emojiList = ['🏔️', '💻', '📚', '☕', '🏋️', '📸', '🍜', '🎯']

  useEffect(() => {
    Promise.all([
      fetch('/api/blogs').then((r) => r.json()),
      fetch('/api/projects').then((r) => r.json()),
      fetch('/api/life').then((r) => r.json()),
    ])
      .then(([blogs, projects, life]) => {
        setLatestPosts((Array.isArray(blogs) ? blogs : []).slice(0, 3))
        setFeaturedProjects(
          (Array.isArray(projects) ? projects : [])
            .filter((p: Project) => p.featured)
            .slice(0, 3)
        )
        setLifeMoments((Array.isArray(life) ? life : []).slice(0, 8))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero 区域 - 极简风格 */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #35bfab 0%, #1fc9e7 40%, transparent 70%)' }}
        />
        <div className="absolute top-40 right-1/4 w-72 h-72 rounded-full blur-[100px] opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #1fc9e7 0%, transparent 70%)' }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-sm text-[#7b888e] mb-4 animate-fade-in font-mono tracking-wider" style={{ animationDelay: '0.1s' }}>
            Hello, World!
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#334f52] mb-6 animate-fade-in leading-tight" style={{ animationDelay: '0.2s' }}>
            Hi, I&apos;m{' '}
            <span className="bg-gradient-to-r from-[#35bfab] to-[#1fc9e7] bg-clip-text text-transparent">
              ygccbpkn
            </span>
          </h1>
          <p className="text-lg text-[#7b888e] mb-10 animate-fade-in max-w-xl mx-auto leading-relaxed" style={{ animationDelay: '0.3s' }}>
            全栈开发者，专注于 Java 后端与 React 前端开发。
            <br />
            热爱技术，记录成长，分享生活。
          </p>
          <div className="flex items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link href="/blog" className="btn-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              阅读博客
            </Link>
            <Link href="/projects" className="btn-outline">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              查看项目
            </Link>
          </div>
        </div>
      </section>

      {/* 最新博客预览 */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-[#334f52]">最新文章</h2>
            <Link
              href="/blog"
              className="text-sm text-[#7b888e] hover:text-[#35bfab] transition-colors flex items-center gap-1"
            >
              查看全部
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-6 animate-pulse">
                  <div className="h-5 w-16 bg-[#334f52]/5 rounded mb-3" />
                  <div className="h-6 w-3/4 bg-[#334f52]/5 rounded mb-2" />
                  <div className="h-4 w-full bg-[#334f52]/5 rounded mb-4" />
                  <div className="h-3 w-24 bg-[#334f52]/5 rounded" />
                </div>
              ))}
            </div>
          ) : latestPosts.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-[#7b888e]/60 text-sm">还没有发布文章，去后台添加第一篇吧</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.map((post, i) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="glass-card p-6 group"
                  style={{ animationDelay: `${0.5 + i * 0.1}s` }}
                >
                  {post.tags && (
                    <span className="tag mb-3 inline-block">
                      {post.tags.split(',')[0].trim()}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-[#334f52] mb-2 group-hover:text-[#35bfab] transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-[#7b888e] mb-4 line-clamp-2">{post.excerpt}</p>
                  )}
                  <p className="text-xs text-[#7b888e]/60">
                    {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 精选项目 */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-[#334f52]">精选项目</h2>
            <Link
              href="/projects"
              className="text-sm text-[#7b888e] hover:text-[#35bfab] transition-colors flex items-center gap-1"
            >
              查看全部
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="glass-card p-6 animate-pulse">
                  <div className="flex justify-between mb-3">
                    <div className="h-6 w-40 bg-[#334f52]/5 rounded" />
                    <div className="h-4 w-12 bg-[#334f52]/5 rounded" />
                  </div>
                  <div className="h-4 w-full bg-[#334f52]/5 rounded mb-2" />
                  <div className="flex gap-2">
                    <div className="h-5 w-16 bg-[#334f52]/5 rounded" />
                    <div className="h-5 w-20 bg-[#334f52]/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProjects.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-[#7b888e]/60 text-sm">还没有精选项目，去后台添加吧</p>
            </div>
          ) : (
            <div className="space-y-4">
              {featuredProjects.map((project, i) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="glass-card p-6 block group"
                  style={{ animationDelay: `${0.6 + i * 0.1}s` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-[#334f52] group-hover:text-[#35bfab] transition-colors">
                          {project.name}
                        </h3>
                        {project.featured && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#35bfab]/10 text-[#35bfab] border border-[#35bfab]/20">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#7b888e] leading-relaxed max-w-2xl">{project.description}</p>
                    </div>
                    <span className="text-xs text-[#7b888e]/60 font-mono whitespace-nowrap shrink-0">
                      {new Date(project.createdAt).getFullYear()}
                    </span>
                  </div>
                  {project.techStack && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.split(',').map((tech) => (
                        <span key={tech} className="text-[11px] px-2 py-0.5 rounded-md bg-[#334f52]/5 text-[#7b888e] font-mono">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 生活瞬间 */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-[#334f52]">生活瞬间</h2>
            <Link
              href="/life"
              className="text-sm text-[#7b888e] hover:text-[#35bfab] transition-colors flex items-center gap-1"
            >
              查看全部
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="glass-card aspect-square animate-pulse flex items-center justify-center">
                  <div className="w-10 h-10 bg-[#334f52]/5 rounded-full" />
                </div>
              ))}
            </div>
          ) : lifeMoments.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-[#7b888e]/60 text-sm">还没有生活记录，去后台分享吧</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {lifeMoments.map((moment, i) => (
                <div
                  key={moment.id}
                  className="glass-card aspect-square flex flex-col items-center justify-center gap-3 cursor-pointer group p-4"
                  style={{ animationDelay: `${0.5 + i * 0.05}s` }}
                >
                  <span className="text-3xl transition-transform duration-300 group-hover:scale-125">
                    {emojiList[i % emojiList.length]}
                  </span>
                  <div className="text-center">
                    <p className="text-sm font-medium text-[#334f52] line-clamp-1">{moment.content}</p>
                    <p className="text-[10px] text-[#7b888e]/60 mt-0.5">
                      {new Date(moment.createdAt).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 底部 CTA */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card p-10 animate-glow">
            <p className="text-2xl mb-2">👋</p>
            <h2 className="text-xl font-bold text-[#334f52] mb-3">保持联系</h2>
            <p className="text-sm text-[#7b888e] mb-6">
              如果你对我的项目感兴趣，或者想交流技术，欢迎关注我的 GitHub。
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
