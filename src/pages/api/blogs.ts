import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { id } = req.query
    if (id) {
      const post = await prisma.blogPost.findUnique({ where: { slug: String(id) } })
      if (!post) return res.status(404).json({ error: '文章不存在' })
      return res.status(200).json(post)
    }
    const posts = await prisma.blogPost.findMany({
      where: { published: true, hidden: false },
      orderBy: { createdAt: 'desc' },
    })
    return res.status(200).json(posts)
  } catch {
    return res.status(500).json({ error: '获取文章失败' })
  }
}
