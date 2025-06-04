# 高校科研人员个人信息展示系统 - 前台

🇨🇳 中文版本 | [🇺🇸 English](./README.md)

![Vue](https://img.shields.io/badge/Vue-2.7.14-4FC08D?style=flat-square&logo=vue.js)
![Element UI](https://img.shields.io/badge/Element_UI-2.15.13-409EFF?style=flat-square&logo=element)
![Vite](https://img.shields.io/badge/Vite-4.4.9-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 📖 项目介绍

一个现代化的高校科研人员个人信息展示系统前台，专为展示学术研究人员的个人信息、科研项目、学术发表和新闻动态而设计。基于Vue 2.7和Element UI构建，支持国际化和响应式设计。

## ✨ 核心特性

### 🎯 主要功能
- **个人资料展示** - 全面的研究人员信息呈现
- **科研项目展示** - 交互式项目展示库，包含详细描述
- **学术发表** - 有序的发表列表，支持搜索和筛选
- **新闻动态** - 动态新闻流，支持多媒体内容
- **多语言支持** - 中英文无缝切换

### 🚀 技术亮点
- **现代化Vue 2.7** - 最新Vue 2版本，支持Composition API
- **响应式设计** - 针对桌面、平板和移动设备优化
- **性能优化** - Vite驱动的快速开发和构建
- **可访问性就绪** - 符合WCAG标准的界面设计
- **SEO友好** - 优化的meta标签和结构化数据

## 🛠 技术栈

### 前端框架
- **Vue.js** `2.7.14` - 渐进式JavaScript框架
- **Vue Router** `3.5.4` - Vue.js官方路由
- **Vue I18n** `8.28.2` - 国际化插件

### UI与样式
- **Element UI** `2.15.13` - 桌面端组件库
- **Sass** `1.66.1` - CSS预处理器
- **Sanitize.css** `13.0.0` - CSS标准化

### 增强组件
- **Vue Awesome Swiper** `4.1.0` - 触摸滑动组件
- **Vue Seamless Scroll** `1.1.23` - 无缝滚动文本
- **QRCode** `1.5.3` - 二维码生成
- **FontAwesome** `6.7.2` - 图标库

### 开发工具
- **Vite** `4.4.9` - 下一代前端构建工具
- **ESLint** `8.47.0` - 代码检查和格式化
- **Prettier** `2.7.1` - 代码格式化器
- **Husky** `8.0.3` - Git钩子管理

## 📂 项目结构

```
src/
├── api/                    # API接口定义
│   ├── news.js            # 新闻API
│   ├── personal.js        # 个人资料API
│   ├── projects.js        # 项目API
│   └── publications.js    # 发表论文API
├── assets/                 # 静态资源
│   ├── icons/             # SVG图标
│   ├── images/            # 图片和媒体文件
│   └── styles/            # 全局样式
├── components/            # 可复用组件
│   ├── layout/            # 布局组件
│   ├── BaseDialog.vue     # 模态对话框组件
│   ├── Pagination.vue     # 分页组件
│   └── SvgIcon/          # SVG图标组件
├── locales/              # 国际化
│   ├── en-US.js          # 英文翻译
│   ├── zh-CN.js          # 中文翻译
│   └── index.js          # 国际化配置
├── router/               # 路由配置
├── store/                # 状态管理
├── utils/                # 工具函数
└── views/                # 页面组件
    ├── home/             # 首页
    ├── news/             # 新闻页面
    ├── projects/         # 项目页面
    └── publications/     # 发表论文页面
```

## 🚀 快速开始

### 环境要求
- **Node.js** >= 14.19
- **npm** >= 6.14.0

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone <repository-url>
   cd UniversityResearcherProfiles
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **访问应用**
   ```
   http://localhost:8220
   ```

### 可用脚本

```bash
# 开发
npm run dev              # 启动开发服务器
npm run dev:prod         # 以生产模式启动开发服务器

# 构建
npm run build:dev        # 开发环境构建
npm run build:prod       # 生产环境构建

# 代码质量
npm run lint             # 运行ESLint
npm run prettier         # 使用Prettier格式化代码
```

## 🌐 国际化

应用通过Vue I18n支持多语言：

### 支持的语言
- **简体中文** - 简体中文
- **英语** - English

### 语言结构
```javascript
// locales/zh-CN.js
export default {
  nav: {
    home: '首页',
    projects: '科研项目',
    publications: '学术发表',
    news: '新闻动态'
  },
  profile: {
    title: '个人资料',
    education: '教育背景',
    experience: '工作经历'
  }
  // ... 更多翻译
}
```

### 添加新语言
1. 在`src/locales/`中创建新的语言文件
2. 在`src/locales/index.js`中导入并注册
3. 在组件中添加语言切换选项

## 📱 响应式设计

应用针对多种屏幕尺寸进行了优化：

- **桌面端**: 1200px及以上
- **平板端**: 768px - 1199px
- **移动端**: 768px以下

### 主要响应式特性
- 自适应导航菜单
- 灵活的网格布局
- 触摸友好的交互
- 优化的图片加载

## 🎨 主题与自定义

### Element UI主题自定义
```scss
// src/assets/styles/element-variables.scss
$--color-primary: #409EFF;
$--font-size-base: 14px;
// ... 自定义变量
```

### 自定义工具类
```scss
// src/assets/styles/utility.scss
.text-center { text-align: center; }
.mb-20 { margin-bottom: 20px; }
// ... 工具类
```

## 🚀 部署

### 生产构建
```bash
npm run build:prod
```

### 构建输出
```
dist/
├── css/                # 编译后的CSS文件
├── js/                 # 编译后的JavaScript文件
├── static/             # 静态资源
└── index.html          # 主HTML文件
```

### 部署选项
- **静态托管**: Netlify, Vercel, GitHub Pages
- **CDN**: CloudFlare, AWS CloudFront
- **服务器**: Nginx, Apache

### Nginx配置示例
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🤝 参与贡献

### 开发工作流
1. Fork仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开Pull Request

### 代码规范
- 遵循ESLint配置
- 使用Prettier进行代码格式化
- 编写有意义的提交信息
- 为函数添加JSDoc注释

### Git钩子
预提交钩子自动运行：
- ESLint检查
- Prettier格式化
- 提交信息验证

## 📄 许可证

本项目基于MIT许可证 - 查看[LICENSE](LICENSE)文件了解详情。

## 🆘 支持

### 文档
- [Vue.js指南](https://cn.vuejs.org/guide/)
- [Element UI文档](https://element.eleme.cn/#/zh-CN)
- [Vite文档](https://cn.vitejs.dev/)

### 问题与疑问
- 创建issue报告bug
- 使用discussions提问
- 创建新issue前请检查现有问题

### 联系方式
- **邮箱**: [your-email@university.edu]
- **项目仓库**: [repository-url]

---

**用❤️为学术社区构建**