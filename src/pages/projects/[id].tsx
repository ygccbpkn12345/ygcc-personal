import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Project {
  id: number
  name: string
  slug: string
  description: string
  techStack: string | null
  githubUrl: string | null
  demoUrl: string | null
  featured: boolean
  createdAt: string
}

export default function ProjectDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/projects?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setProject(null)
        } else {
          setProject(data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-12 animate-pulse">
            <div className="h-4 w-20 bg-[#334f52]/5 rounded mb-8" />
            <div className="h-10 w-1/2 bg-[#334f52]/5 rounded mb-3" />
            <div className="h-5 w-3/4 bg-[#334f52]/5 rounded mb-8" />
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

  if (!project) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="glass-card p-12">
            <p className="text-4xl mb-4">🔍</p>
            <h1 className="text-xl font-bold text-[#334f52] mb-2">项目未找到</h1>
            <p className="text-sm text-[#7b888e] mb-6">该页面不存在或已被移除</p>
            <Link href="/projects" className="btn-primary text-sm">
              ← 返回项目列表
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const techStackList = project.techStack ? project.techStack.split(',').map((s) => s.trim()) : []

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#35bfab]/5 via-transparent to-[#1fc9e7]/5 pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #35bfab 0%, transparent 70%)' }}
        />

        <div className="relative max-w-3xl mx-auto">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm text-[#7b888e] hover:text-[#35bfab] transition-colors mb-8"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回项目列表
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl md:text-4xl font-bold text-[#334f52]">{project.name}</h1>
            <span className="text-xs text-[#7b888e]/60 font-mono">
              {new Date(project.createdAt).getFullYear()}
            </span>
          </div>
          <p className="text-[#7b888e] text-lg leading-relaxed">{project.description}</p>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {/* 项目介绍 */}
            <div className="glass-card p-8">
              <h2 className="text-lg font-semibold text-[#334f52] mb-4">项目介绍</h2>
              <p className="text-sm text-[#7b888e] leading-relaxed">{project.description}</p>
            </div>

            {/* 技术栈 & 链接 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-[#334f52] mb-4 font-mono uppercase tracking-wider">
                  Tech Stack
                </h3>
                {techStackList.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {techStackList.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-[#334f52]/5 text-[#7b888e] font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#7b888e]/60">暂无技术栈信息</p>
                )}
              </div>

              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-[#334f52] mb-4 font-mono uppercase tracking-wider">
                  Info
                </h3>
                <div className="space-y-2 text-sm text-[#7b888e]">
                  <p>
                    <span className="text-[#334f52]/50">创建时间：</span>
                    {new Date(project.createdAt).toLocaleDateString('zh-CN')}
                  </p>
                  <p>
                    <span className="text-[#334f52]/50">状态：</span>
                    {project.featured ? '精选项目' : '普通项目'}
                  </p>
                </div>
              </div>
            </div>

            {/* 链接 */}
            <div className="flex items-center gap-4">
              {project.githubUrl && project.githubUrl !== '#' && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  查看源码
                </a>
              )}
              {project.demoUrl && project.demoUrl !== '#' && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-sm"
                >
                  在线演示
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
