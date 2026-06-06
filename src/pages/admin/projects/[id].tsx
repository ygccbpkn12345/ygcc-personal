import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'

const API_BASE = '/api'

export default function ProjectEditor() {
  const router = useRouter()
  const { id } = router.query
  const isNew = id === 'new'

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    techStack: '',
    screenshots: '',
    githubUrl: '',
    demoUrl: '',
    featured: false,
  })
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.replace('/admin/login'); return }
    if (!isNew && id) {
      fetchProject(token, id as string)
    } else if (isNew) {
      setLoading(false)
    }
  }, [id])

  const fetchProject = async (token: string, projectId: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/projects?id=${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) { logout(); return }
      const data = await res.json()
      if (!res.ok) { setError(data.error || '获取失败'); return }
      setForm({
        name: data.name,
        slug: data.slug,
        description: data.description,
        techStack: data.techStack || '',
        screenshots: data.screenshots || '',
        githubUrl: data.githubUrl || '',
        demoUrl: data.demoUrl || '',
        featured: data.featured,
      })
    } catch {
      setError('网络错误')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const token = localStorage.getItem('token')!
    const url = isNew ? `${API_BASE}/admin/projects` : `${API_BASE}/admin/projects?id=${id}`
    const method = isNew ? 'POST' : 'PUT'

    try {
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
      router.push('/admin/projects')
    } catch {
      setError('网络错误')
    } finally {
      setSaving(false)
    }
  }

  const handleNameChange = (name: string) => {
    setForm({ ...form, name })
    if (isNew) {
      const slug = name
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff]+/g, '-')
        .replace(/^-|-$/g, '')
      setForm((prev) => ({ ...prev, slug }))
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
      <Head><title>{isNew ? '新建项目' : '编辑项目'} - 后台</title></Head>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/projects" className="text-gray-500 hover:text-black transition">← 返回</Link>
              <h1 className="text-xl font-bold">{isNew ? '新建项目' : '编辑项目'}</h1>
            </div>
            <button onClick={logout} className="text-sm text-red-500 hover:text-red-600 transition">退出登录</button>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-8">
          {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">项目名称</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">URL 标识</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none font-mono text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">项目描述</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">技术栈（逗号分隔）</label>
                <input
                  type="text"
                  value={form.techStack}
                  onChange={(e) => setForm({ ...form, techStack: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  placeholder="React, Next.js, Tailwind CSS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">截图路径（逗号分隔）</label>
                <input
                  type="text"
                  value={form.screenshots}
                  onChange={(e) => setForm({ ...form, screenshots: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">GitHub 地址</label>
                  <input
                    type="text"
                    value={form.githubUrl}
                    onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">在线演示地址</label>
                  <input
                    type="text"
                    value={form.demoUrl}
                    onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <span className="text-sm text-gray-700">设为精选项目</span>
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <Link href="/admin/projects" className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">取消</Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
              >
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  )
}
