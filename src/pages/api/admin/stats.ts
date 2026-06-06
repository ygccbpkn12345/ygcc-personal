import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { verifyToken } from '../../../../lib/auth'

async function authenticate(req: NextApiRequest) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return null
  const payload = verifyToken(authHeader.slice(7))
  return payload
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticate(req)
  if (!user) return res.status(401).json({ error: '未登录或登录已过期' })

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const [blogCount, projectCount, lifeCount] = await Promise.all([
      prisma.blogPost.count(),
      prisma.project.count(),
      prisma.lifePost.count(),
    ])

    const recentBlogs = await prisma.blogPost.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: { id: true, title: true, published: true, updatedAt: true },
    })

    const recentProjects = await prisma.project.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: { id: true, name: true, featured: true, updatedAt: true },
    })

    return res.status(200).json({
      stats: { blogCount, projectCount, lifeCount },
      recentBlogs,
      recentProjects,
    })
  } catch {
    return res.status(500).json({ error: '获取统计数据失败' })
  }
}
