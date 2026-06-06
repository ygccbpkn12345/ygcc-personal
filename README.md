# 个人网站项目

这是一个使用 Next.js + MySQL 开发的全栈个人网站项目。

## 功能模块

- 博客系统
- 项目展示
- 生活记录（时间线/相册）
- 后台管理

## 技术栈

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Prisma + MySQL
- JWT 认证

## 项目结构

```
d:/桌面/个人作品集网站/
├── src/
│   ├── app/          # Next.js App Router
│   ├── components/    # React 组件
│   ├── lib/          # 工具函数
│   └── types/        # TypeScript 类型
├── prisma/           # 数据库 schema
├── public/           # 静态资源
└── uploads/          # 上传文件
```

## 开发进度

- [x] 项目初始化
- [x] 基础文件创建
- [ ] 依赖安装（需要运行 `npm install`）
- [ ] 数据库配置
- [ ] 布局组件开发
- [ ] 首页开发
- [ ] 博客模块
- [ ] 项目展示模块
- [ ] 生活记录模块
- [ ] 后台管理

## 开始开发

1. 复制 `.env.example` 为 `.env` 并配置数据库连接
2. 运行 `npm install` 安装依赖
3. 运行 `npx prisma db push` 创建数据库
4. 运行 `npm run dev` 启动开发服务器
