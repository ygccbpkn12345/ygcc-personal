import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import { comparePassword, signToken } from '../../../../lib/auth'
import { loginSchema } from '../../../../lib/validate'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const data = loginSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { username: data.username } })

    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }

    const valid = await comparePassword(data.password, user.password)
    if (!valid) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }

    const token = signToken({ userId: user.id, username: user.username })

    return res.status(200).json({
      token,
      user: { id: user.id, username: user.username },
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message })
    }
    return res.status(500).json({ error: '登录失败' })
  }
}
