## 📦 使用

$ pnpm

$ pnpm run start:dev

## 🔨 构建

$ pnpm run pm2:prod(生产)

## 部署
$ npm i -g vercel

1.vercel login （githup登录） , deploy名称：elder-true-lord-production

2.pnpm run build

3.vercel --prod （按照步骤进行）

- 停止
pm2 stop elder-true-lord
- 删除
pm2 delete elder-true-lord

## 🖥 配置

查看 nestjs
<https://docs.nestjs.com/>

## ⌨️ 环境要求

- node >= 18
- npm 源地址：<https://registry.npmjs.org/>

## 🧰 技术概览

- 开发语言：JavaScript
- 开发框架：NestJs

部署线上域名地址：<https://elder-true-lord-production.vercel.app/>


线上查看实时日志的方法，换成最新部署的地址
vercel logs https://elder-true-lord-production-h7rxpe8wg-elder-true-lords-projects.vercel.app --since=now