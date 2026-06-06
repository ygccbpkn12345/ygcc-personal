import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const posts = await prisma.lifePost.findMany({ orderBy: { createdAt: 'desc' } })
    return res.status(200).json(posts)
  } catch {
    return res.status(500).json({ error: '获取生活记录失败' })
  }
}
