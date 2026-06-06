import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(2, '用户名至少2个字符'),
  password: z.string().min(4, '密码至少4个字符'),
})

export const blogPostSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  slug: z.string().min(1, '标识不能为空'),
  content: z.string().min(1, '内容不能为空'),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  tags: z.string().optional(),
  published: z.boolean().default(false),
})

export const projectSchema = z.object({
  name: z.string().min(1, '项目名称不能为空'),
  slug: z.string().min(1, '标识不能为空'),
  description: z.string().min(1, '描述不能为空'),
  techStack: z.string().optional(),
  screenshots: z.string().optional(),
  githubUrl: z.string().optional(),
  demoUrl: z.string().optional(),
  featured: z.boolean().default(false),
})

export const lifePostSchema = z.object({
  content: z.string().min(1, '内容不能为空'),
  images: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type BlogPostInput = z.infer<typeof blogPostSchema>
export type ProjectInput = z.infer<typeof projectSchema>
export type LifePostInput = z.infer<typeof lifePostSchema>
