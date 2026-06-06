import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { verifyToken } from '../../../../lib/auth'
import { projectSchema } from '../../../../lib/validate'

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
      const project = await prisma.project.findUnique({ where: { id: Number(id) } })
      if (!project) return res.status(404).json({ error: '项目不存在' })
      return res.status(200).json(project)
    }
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } })
    return res.status(200).json(projects)
  } catch {
    return res.status(500).json({ error: '获取项目失败' })
  }
}

async function handleCreate(req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = projectSchema.parse(req.body)
    const project = await prisma.project.create({ data })
    return res.status(201).json(project)
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ error: error.errors[0].message })
    if (error.code === 'P2002') return res.status(400).json({ error: '该标识已被使用' })
    return res.status(500).json({ error: '创建项目失败' })
  }
}

async function handleUpdate(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: '缺少项目ID' })
    const data = projectSchema.partial().parse(req.body)
    const project = await prisma.project.update({ where: { id: Number(id) }, data })
    return res.status(200).json(project)
  } catch (error: any) {
    if (error.name === 'ZodError') return res.status(400).json({ error: error.errors[0].message })
    if (error.code === 'P2025') return res.status(404).json({ error: '项目不存在' })
    return res.status(500).json({ error: '更新项目失败' })
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query
    if (!id) return res.status(400).json({ error: '缺少项目ID' })
    await prisma.project.delete({ where: { id: Number(id) } })
    return res.status(200).json({ message: '删除成功' })
  } catch (error: any) {
    if (error.code === 'P2025') return res.status(404).json({ error: '项目不存在' })
    return res.status(500).json({ error: '删除项目失败' })
  }
}
