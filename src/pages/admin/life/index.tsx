import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

const API_BASE = '/api'

interface LifePost {
  id: number
  content: string
  images: string | null
  hidden: boolean
  createdAt: string
}

export default function LifeAdmin() {
  const router = useRouter()
  const [posts, setPosts] = useState<LifePost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ content: '', images: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.replace('/admin/login'); return }
    fetchPosts(token)
  }, [])

  const fetchPosts = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/life`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const token = localStorage.getItem('token')!

    try {
      const url = editingId
        ? `${API_BASE}/admin/life?id=${editingId}`
        : `${API_BASE}/admin/life`
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || '保存失败'); return }

      if (editingId) {
        setPosts(posts.map((p) => (p.id === editingId ? data : p)))
      } else {
        setPosts([data, ...posts])
      }
      setShowForm(false)
      setEditingId(null)
      setForm({ content: '', images: '' })
    } catch {
      setError('网络错误')
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (post: LifePost) => {
    setEditingId(post.id)
    setForm({ content: post.content, images: post.images || '' })
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定删除这条记录吗？')) return
    const token = localStorage.getItem('token')!
    try {
      const res = await fetch(`${API_BASE}/admin/life?id=${id}`, {
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

  const toggleHidden = async (id: number, currentHidden: boolean) => {
    const token = localStorage.getItem('token')!
    try {
      const res = await fetch(`${API_BASE}/admin/life?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ hidden: !currentHidden }),
      })
      if (res.ok) {
        setPosts(
          posts.map((p) =>
            p.id === id ? { ...p, hidden: !currentHidden } : p
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
      <Head><title>生活记录 - 后台</title></Head>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">管理后台</h1>
              <nav className="hidden sm:flex gap-1 ml-8">
                <Link href="/admin" className="px-4 py-1.5 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium transition">仪表盘</Link>
                <Link href="/admin/blogs" className="px-4 py-1.5 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium transition">博客管理</Link>
                <Link href="/admin/projects" className="px-4 py-1.5 text-gray-600 hover:bg-gray-100 rounded-md text-sm font-medium transition">项目管理</Link>
                <Link href="/admin/life" className="px-4 py-1.5 bg-black text-white rounded-md text-sm font-medium">生活记录</Link>
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
            <h2 className="text-lg font-semibold">生活记录</h2>
            <button
              onClick={() => {
                setShowForm(!showForm)
                setEditingId(null)
                setForm({ content: '', images: '' })
              }}
              className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
            >
              {showForm ? '取消' : '+ 新建记录'}
            </button>
          </div>

          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">内容</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">图片路径（逗号分隔）</label>
                <input
                  type="text"
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {saving ? '保存中...' : editingId ? '更新' : '创建'}
                </button>
              </div>
            </form>
          )}

          {posts.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center text-gray-400 border border-gray-100">
              还没有生活记录
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">{post.content}</p>
                    {post.images && (
                      <p className="text-xs text-gray-400 mt-1">图片: {post.images}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(post.createdAt).toLocaleString('zh-CN')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleHidden(post.id, post.hidden)}
                      className={`text-xs px-2 py-1 rounded transition ${
                        post.hidden
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {post.hidden ? '已隐藏' : '隐藏'}
                    </button>
                    <button
                      onClick={() => startEdit(post)}
                      className="text-xs px-2 py-1 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-xs px-2 py-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}
