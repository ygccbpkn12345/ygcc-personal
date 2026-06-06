import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Project {
  id: number
  name: string
  slug: string
  description: string
  techStack: string | null
  githubUrl: string | null
  featured: boolean
  createdAt: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 animate-fade-in">
            <p className="text-sm text-[#7b888e] font-mono mb-2">Projects</p>
            <h1 className="text-3xl font-bold text-[#334f52] mb-3">我的项目</h1>
            <p className="text-[#7b888e] leading-relaxed">
              展示我参与和开发的项目作品，涵盖全栈开发、数据可视化等领域。
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-6 animate-pulse">
                  <div className="flex justify-between mb-3">
                    <div className="h-6 w-40 bg-[#334f52]/5 rounded" />
                    <div className="h-4 w-12 bg-[#334f52]/5 rounded" />
                  </div>
                  <div className="h-4 w-full bg-[#334f52]/5 rounded mb-2" />
                  <div className="h-4 w-2/3 bg-[#334f52]/5 rounded mb-4" />
                  <div className="flex gap-2">
                    <div className="h-5 w-16 bg-[#334f52]/5 rounded" />
                    <div className="h-5 w-20 bg-[#334f52]/5 rounded" />
                    <div className="h-5 w-14 bg-[#334f52]/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-[#7b888e] text-lg mb-2">暂无项目</p>
              <p className="text-[#7b888e]/60 text-sm">还没有添加任何项目作品</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project, i) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="glass-card p-6 block group"
                  style={{ animationDelay: `${0.15 + i * 0.08}s` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-lg font-semibold text-[#334f52] group-hover:text-[#35bfab] transition-colors">
                          {project.name}
                        </h2>
                        {project.featured && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#35bfab]/10 text-[#35bfab] border border-[#35bfab]/20 font-medium">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#7b888e] leading-relaxed max-w-2xl">{project.description}</p>
                    </div>
                    <span className="text-xs text-[#7b888e]/50 font-mono whitespace-nowrap shrink-0">
                      {new Date(project.createdAt).getFullYear()}
                    </span>
                  </div>

                  {project.techStack && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.techStack.split(',').map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-[#334f52]/5 text-[#7b888e] font-mono"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs">
                    {project.githubUrl && project.githubUrl !== '#' && (
                      <span className="text-[#7b888e] hover:text-[#35bfab] transition-colors inline-flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub
                      </span>
                    )}
                    <span className="text-[#7b888e] hover:text-[#35bfab] transition-colors inline-flex items-center gap-1">
                      查看详情
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
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
