import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

const API_BASE = '/api'

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
  updatedAt: string
}

export default function ProjectAdmin() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.replace('/admin/login'); return }
    fetchProjects(token)
  }, [])

  const fetchProjects = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) { logout(); return }
      const data = await res.json()
      if (!res.ok) { setError(data.error || '获取失败'); return }
      setProjects(data)
    } catch {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除这个项目吗？')) return
    const token = localStorage.getItem('token')!
    try {
      const res = await fetch(`${API_BASE}/admin/projects?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id))
      } else {
        const data = await res.json()
        alert(data.error || '删除失败')
      }
    } catch {
      alert('网络错误')
    }
  }

  const toggleFeatured = async (id: number, current: boolean) => {
    const token = localStorage.getItem('token')!
    try {
      const res = await fetch(`${API_BASE}/admin/projects?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ featured: !current }),
      })
      if (res.ok) {
        setProjects(projects.map((p) => (p.id === id ? { ...p, featured: !current } : p)))
      }
    } catch {
      alert('操作失败')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.replace('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent" />
      </div>
    )
  }

  return (
    <>
      <Head><title>项目管理 - 后台</title></Head>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">管理后台</h1>
              <nav className="hidden sm:flex gap-1 ml-8">
                <Link href="/admin" className="px-4 py-1.5 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium transition">仪表盘</Link>
                <Link href="/admin/blogs" className="px-4 py-1.5 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium transition">博客管理</Link>
                <Link href="/admin/projects" className="px-4 py-1.5 bg-black text-white rounded-md text-sm font-medium">项目管理</Link>
                <Link href="/admin/life" className="px-4 py-1.5 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium transition">生活记录</Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-gray-500 hover:text-black transition" target="_blank">查看网站</Link>
              <button onClick={logout} className="text-sm text-red-500 hover:text-red-600 transition">退出登录</button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">项目管理</h2>
            <Link href="/admin/projects/new" className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition">
              + 新建项目
            </Link>
          </div>

          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}

          {projects.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center text-gray-400 border border-gray-100">
              还没有项目，点击上方按钮创建
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">项目名称</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 hidden md:table-cell">技术栈</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 hidden md:table-cell">精选</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 hidden lg:table-cell">更新时间</th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-sm">{project.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{project.description}</div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {project.techStack?.split(',').map((tech) => (
                            <span key={tech} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <button
                          onClick={() => toggleFeatured(project.id, project.featured)}
                          className={`text-xs px-2 py-1 rounded-full font-medium transition ${
                            project.featured
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {project.featured ? '精选' : '普通'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 hidden lg:table-cell">
                        {new Date(project.updatedAt).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/projects/${project.id}`}
                            className="text-xs px-2 py-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition"
                          >
                            编辑
                          </Link>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="text-xs px-2 py-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
