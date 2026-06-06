import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

const API_BASE = '/api'

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string | null
  tags: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

export default function BlogAdmin() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.replace('/admin/login'); return }
    fetchPosts(token)
  }, [])

  const fetchPosts = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/blog`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) { logout(); return }
      const data = await res.json()
      if (!res.ok) { setError(data.error || '获取失败'); return }
      setPosts(data)
    } catch {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除这篇文章吗？')) return
    const token = localStorage.getItem('token')!
    try {
      const res = await fetch(`${API_BASE}/admin/blog?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== id))
      } else {
        const data = await res.json()
        alert(data.error || '删除失败')
      }
    } catch {
      alert('网络错误')
    }
  }

  const togglePublish = async (id: number, currentPublished: boolean) => {
    const token = localStorage.getItem('token')!
    try {
      const res = await fetch(`${API_BASE}/admin/blog?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ published: !currentPublished }),
      })
      if (res.ok) {
        setPosts(
          posts.map((p) =>
            p.id === id ? { ...p, published: !currentPublished } : p
          )
        )
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
      <Head><title>博客管理 - 后台</title></Head>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">管理后台</h1>
              <nav className="hidden sm:flex gap-1 ml-8">
                <Link href="/admin" className="px-4 py-1.5 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium transition">仪表盘</Link>
                <Link href="/admin/blogs" className="px-4 py-1.5 bg-black text-white rounded-md text-sm font-medium">博客管理</Link>
                <Link href="/admin/projects" className="px-4 py-1.5 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium transition">项目管理</Link>
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
            <h2 className="text-lg font-semibold">博客文章</h2>
            <Link
              href="/admin/blogs/new"
              className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
            >
              + 新建文章
            </Link>
          </div>

          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}

          {posts.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center text-gray-400 border border-gray-100">
              还没有博客文章，点击上方按钮创建
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">标题</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 hidden md:table-cell">标签</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 hidden md:table-cell">状态</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-gray-500 hidden lg:table-cell">更新时间</th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-sm">{post.title}</div>
                        <div className="text-xs text-gray-400 mt-0.5">/{post.slug}</div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {post.tags?.split(',').map((tag) => (
                            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <button
                          onClick={() => togglePublish(post.id, post.published)}
                          className={`text-xs px-2 py-1 rounded-full font-medium transition ${
                            post.published
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          }`}
                        >
                          {post.published ? '已发布' : '草稿'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400 hidden lg:table-cell">
                        {new Date(post.updatedAt).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/blogs/${post.id}`}
                            className="text-xs px-2 py-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition"
                          >
                            编辑
                          </Link>
                          <button
                            onClick={() => handleDelete(post.id)}
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
