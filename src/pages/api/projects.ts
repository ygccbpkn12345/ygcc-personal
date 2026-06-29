import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { id } = req.query
    if (id) {
      const project = await prisma.project.findUnique({ where: { slug: String(id) } })
      if (!project) return res.status(404).json({ error: '项目不存在' })
      return res.status(200).json(project)
    }
    const projects = await prisma.project.findMany({
      where: { hidden: false },
      orderBy: { createdAt: 'desc' },
    })
    return res.status(200).json(projects)
  } catch {
    return res.status(500).json({ error: '获取项目失败' })
  }
}
