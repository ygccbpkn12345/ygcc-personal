import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('开始初始化数据库...')

  // 创建管理员用户
  const username = process.env.ADMIN_USERNAME || 'admin'
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await prisma.user.findUnique({ where: { username } })
  if (!existingUser) {
    await prisma.user.create({
      data: { username, password: hashedPassword },
    })
    console.log(`管理员用户已创建: ${username}`)
  } else {
    console.log(`管理员用户已存在: ${username}`)
  }

  // 创建示例博客
  const blogCount = await prisma.blogPost.count()
  if (blogCount === 0) {
    const blogs = [
      {
        title: 'Spring Boot 入门指南',
        slug: 'spring-boot-guide',
        content: `# Spring Boot 入门指南\n\nSpring Boot 是目前最流行的 Java 后端开发框架之一。\n\n## 快速开始\n\n\`\`\`bash\nmvn spring-boot:run\n\`\`\`\n\n## 核心特性\n\n- 自动配置\n- 内嵌服务器\n- Actuator 监控`,
        excerpt: 'Spring Boot 入门教程，带你快速上手 Java 后端开发',
        tags: 'Java, Spring Boot, 后端',
        published: true,
      },
      {
        title: 'React Hooks 最佳实践',
        slug: 'react-hooks-best-practices',
        content: `# React Hooks 最佳实践\n\nReact Hooks 让函数组件拥有了状态管理能力。\n\n## useState\n\n\`\`\`tsx\nconst [count, setCount] = useState(0)\n\`\`\`\n\n## useEffect\n\n处理副作用操作。`,
        excerpt: '深入学习 React Hooks 的使用技巧和最佳实践',
        tags: 'React, JavaScript, 前端',
        published: true,
      },
    ]
    for (const blog of blogs) {
      await prisma.blogPost.create({ data: blog })
    }
    console.log(`已创建 ${blogs.length} 篇示例博客`)
  }

  // 创建示例项目
  const projectCount = await prisma.project.count()
  if (projectCount === 0) {
    const projects = [
      {
        name: '苍穹外卖',
        slug: 'cangqiu-waimai',
        description: '一个完整的外卖平台系统，包含微信小程序端和 Spring Boot 后端，支持用户下单、商家管理、骑手配送等功能',
        techStack: 'Spring Boot, MyBatis, MySQL, Redis, 微信小程序',
        githubUrl: '#',
        featured: true,
      },
      {
        name: '个人作品集网站',
        slug: 'personal-website',
        description: '使用 Next.js + Tailwind CSS 构建的现代个人作品集网站',
        techStack: 'Next.js, React, TypeScript, Tailwind CSS',
        githubUrl: '#',
        featured: false,
      },
    ]
    for (const project of projects) {
      await prisma.project.create({ data: project })
    }
    console.log(`已创建 ${projects.length} 个示例项目`)
  }

  console.log('数据库初始化完成！')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
