import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { verifyToken } from '../../../../lib/auth'
import { lifePostSchema } from '../../../../lib/validate'

async function authenticate(req: NextApiRequest) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return null
  const payload = verifyToken(authHeader.slice(7))
  return payload
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await authenticate(req)
  if (!user) return res.status(401).json({ error: '未登录或登录已过期' })

  switch (req.method) {
    case 'GET':
      return handleGet(req, res)
    case 'POST':
      return handleCreate(req, res)
    case 'PUT':
      return handleUpdate(req, res)
    case 'DELETE':
      return handleDelete(req, res)
    default:
      return res.status(405).json({ error: 'Method not allowed' })
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    if (id && id !== 'all') {
      const post = await prisma.lifePost.findUnique({ where: { id: Number(id) } })
      if (!post) return res.status(404).json({ error: '记录不存在' })
      return res.status(200).json(post)
    }
    const posts = await prisma.lifePost.findMany({ orderBy: { createdAt: 'desc' } })
    return res.status(200).json(posts)
  } catch {
    return res.status(500).json({ error: '获取生活记录失败' })
  }
}

async function handleCreate(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = lifePostSchema.parse(req.body)
    const post = await prisma.lifePost.create({ data })
    return res.status(201).json(post)
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ error: error.errors[0].message })
    return res.status(500).json({ error: '创建生活记录失败' })
  }
}

async function handleUpdate(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: '缺少记录ID' })
    const data = lifePostSchema.partial().parse(req.body)
    const post = await prisma.lifePost.update({ where: { id: Number(id) }, data })
    return res.status(200).json(post)
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ error: error.errors[0].message })
    if (error.code === 'P2025') return res.status(404).json({ error: '记录不存在' })
    return res.status(500).json({ error: '更新生活记录失败' })
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: '缺少记录ID' })
    await prisma.lifePost.delete({ where: { id: Number(id) } })
    return res.status(200).json({ message: '删除成功' })
  } catch (error: any) {
    if (error.code === 'P2025') return res.status(404).json({ error: '记录不存在' })
    return res.status(500).json({ error: '删除生活记录失败' })
  }
}
