import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

const API_BASE = '/api'

interface Stats {
  stats: { blogCount: number; projectCount: number; lifeCount: number }
  recentBlogs: { id: number; title: string; published: boolean; updatedAt: string }[]
  recentProjects: { id: number; name: string; featured: boolean; updatedAt: string }[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/admin/login')
      return
    }
    fetchStats(token)
  }, [])

  const fetchStats = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.replace('/admin/login')
        return
      }
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || '获取数据失败')
        return
      }
      setStats(data)
    } catch {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
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
      <Head>
        <title>管理后台 - ygccbpkn</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        {/* 顶部导航 */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">管理后台</h1>
              <nav className="hidden sm:flex gap-1 ml-8">
                <Link
                  href="/admin"
                  className="px-4 py-1.5 bg-black text-white rounded-md text-sm font-medium"
                >
                  仪表盘
                </Link>
                <Link
                  href="/admin/blogs"
                  className="px-4 py-1.5 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium transition"
                >
                  博客管理
                </Link>
                <Link
                  href="/admin/projects"
                  className="px-4 py-1.5 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium transition"
                >
                  项目管理
                </Link>
                <Link
                  href="/admin/life"
                  className="px-4 py-1.5 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium transition"
                >
                  生活记录
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-black transition"
                target="_blank"
              >
                查看网站
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-600 transition"
              >
                退出登录
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {stats && (
            <>
              {/* 统计卡片 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.stats.blogCount}
                  </div>
                  <div className="text-gray-500 mt-1">博客文章</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.stats.projectCount}
                  </div>
                  <div className="text-gray-500 mt-1">项目作品</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="text-3xl font-bold text-gray-900">
                    {stats.stats.lifeCount}
                  </div>
                  <div className="text-gray-500 mt-1">生活记录</div>
                </div>
              </div>

              {/* 最近更新 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold mb-4">最近博客</h2>
                  {stats.recentBlogs.length === 0 ? (
                    <p className="text-gray-400 text-sm">暂无博客文章</p>
                  ) : (
                    <ul className="space-y-3">
                      {stats.recentBlogs.map((blog) => (
                        <li
                          key={blog.id}
                          className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                        >
                          <div>
                            <span className="text-sm font-medium">{blog.title}</span>
                            {!blog.published && (
                              <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">
                                草稿
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(blog.updatedAt).toLocaleDateString('zh-CN')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold mb-4">最近项目</h2>
                  {stats.recentProjects.length === 0 ? (
                    <p className="text-gray-400 text-sm">暂无项目</p>
                  ) : (
                    <ul className="space-y-3">
                      {stats.recentProjects.map((project) => (
                        <li
                          key={project.id}
                          className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                        >
                          <div>
                            <span className="text-sm font-medium">{project.name}</span>
                            {project.featured && (
                              <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                精选
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(project.updatedAt).toLocaleDateString('zh-CN')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  )
}
