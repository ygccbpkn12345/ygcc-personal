import { useState, useEffect } from 'react'

interface LifePost {
  id: number
  content: string
  images: string | null
  createdAt: string
}

export default function LifePage() {
  const [posts, setPosts] = useState<LifePost[]>([])
  const [loading, setLoading] = useState(true)

  const emojiList = ['🏔️', '💻', '📚', '☕', '🏋️', '📸', '🍜', '🎯', '🎤', '🐱', '✈️', '🎵', '🌱', '🎮', '🎨', '🚀']

  useEffect(() => {
    fetch('/api/life')
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
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 animate-fade-in">
            <p className="text-sm text-[#7b888e] font-mono mb-2">Life</p>
            <h1 className="text-3xl font-bold text-[#334f52] mb-3">生活记录</h1>
            <p className="text-[#7b888e] leading-relaxed">
              记录生活中的美好瞬间，分享日常的点滴乐趣。
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="glass-card aspect-square animate-pulse flex items-center justify-center">
                  <div className="w-10 h-10 bg-[#334f52]/5 rounded-full" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <p className="text-[#7b888e] text-lg mb-2">暂无记录</p>
              <p className="text-[#7b888e]/60 text-sm">还没有发布任何生活记录</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {posts.map((post, i) => (
                <div
                  key={post.id}
                  className="glass-card aspect-square flex flex-col items-center justify-center gap-3 cursor-pointer group p-4"
                  style={{ animationDelay: `${0.05 + i * 0.04}s` }}
                >
                  <span className="text-4xl transition-transform duration-300 group-hover:scale-125">
                    {emojiList[i % emojiList.length]}
                  </span>
                  <div className="text-center">
                    <p className="text-sm text-[#334f52] group-hover:text-[#35bfab] transition-colors line-clamp-2">
                      {post.content}
                    </p>
                    <p className="text-[10px] text-[#7b888e]/40 mt-1.5">
                      {new Date(post.createdAt).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
