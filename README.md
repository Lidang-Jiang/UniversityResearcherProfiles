# University Researcher Profiles - Frontend

[🇨🇳 中文版本](./README-zh.md) | 🇺🇸 English

![Vue](https://img.shields.io/badge/Vue-2.7.14-4FC08D?style=flat-square&logo=vue.js)
![Element UI](https://img.shields.io/badge/Element_UI-2.15.13-409EFF?style=flat-square&logo=element)
![Vite](https://img.shields.io/badge/Vite-4.4.9-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## 📖 Project Overview

A modern university researcher profile display system frontend, designed to showcase academic researchers' personal information, research projects, publications, and news. Built with Vue 2.7 and Element UI, featuring internationalization support and responsive design.

## ✨ Key Features

### 🎯 Core Functionality
- **Personal Profile Display** - Comprehensive researcher information presentation
- **Research Projects Showcase** - Interactive project gallery with detailed descriptions
- **Academic Publications** - Organized publication lists with search and filtering
- **News & Updates** - Dynamic news feed with multimedia content
- **Multi-language Support** - Seamless Chinese/English language switching

### 🚀 Technical Highlights
- **Modern Vue 2.7** - Latest Vue 2 with Composition API support
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Performance Optimized** - Vite-powered fast development and building
- **Accessibility Ready** - WCAG compliant interface design
- **SEO Friendly** - Optimized meta tags and structured data

## 🛠 Tech Stack

### Frontend Framework
- **Vue.js** `2.7.14` - Progressive JavaScript framework
- **Vue Router** `3.5.4` - Official router for Vue.js
- **Vue I18n** `8.28.2` - Internationalization plugin

### UI & Styling
- **Element UI** `2.15.13` - Desktop-first component library
- **Sass** `1.66.1` - CSS preprocessor
- **Sanitize.css** `13.0.0` - CSS normalization

### Enhanced Components
- **Vue Awesome Swiper** `4.1.0` - Touch slider component
- **Vue Seamless Scroll** `1.1.23` - Seamless scrolling text
- **QRCode** `1.5.3` - QR code generation
- **FontAwesome** `6.7.2` - Icon library

### Development Tools
- **Vite** `4.4.9` - Next generation frontend tooling
- **ESLint** `8.47.0` - Code linting and formatting
- **Prettier** `2.7.1` - Code formatter
- **Husky** `8.0.3` - Git hooks management

## 📂 Project Structure

```
src/
├── api/                    # API interface definitions
│   ├── news.js            # News API
│   ├── personal.js        # Personal profile API
│   ├── projects.js        # Projects API
│   └── publications.js    # Publications API
├── assets/                 # Static assets
│   ├── icons/             # SVG icons
│   ├── images/            # Images and media
│   └── styles/            # Global styles
├── components/            # Reusable components
│   ├── layout/            # Layout components
│   ├── BaseDialog.vue     # Modal dialog component
│   ├── Pagination.vue     # Pagination component
│   └── SvgIcon/          # SVG icon component
├── locales/              # Internationalization
│   ├── en-US.js          # English translations
│   ├── zh-CN.js          # Chinese translations
│   └── index.js          # I18n configuration
├── router/               # Route configuration
├── store/                # State management
├── utils/                # Utility functions
└── views/                # Page components
    ├── home/             # Homepage
    ├── news/             # News pages
    ├── projects/         # Projects pages
    └── publications/     # Publications pages
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** >= 14.19
- **npm** >= 6.14.0

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd UniversityResearcherProfiles
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   ```
   http://localhost:8220
   ```

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev:prod         # Start dev server with production mode

# Building
npm run build:dev        # Build for development
npm run build:prod       # Build for production

# Code Quality
npm run lint             # Run ESLint
npm run prettier         # Format code with Prettier
```

## 🌐 Internationalization

The application supports multiple languages through Vue I18n:

### Supported Languages
- **Chinese (Simplified)** - 简体中文
- **English** - English

### Language Structure
```javascript
// locales/en-US.js
export default {
  nav: {
    home: 'Home',
    projects: 'Research Projects',
    publications: 'Publications',
    news: 'News'
  },
  profile: {
    title: 'Personal Profile',
    education: 'Education',
    experience: 'Experience'
  }
  // ... more translations
}
```

### Adding New Languages
1. Create new locale file in `src/locales/`
2. Import and register in `src/locales/index.js`
3. Add language switcher option in components

## 📱 Responsive Design

The application is optimized for multiple screen sizes:

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

### Key Responsive Features
- Adaptive navigation menu
- Flexible grid layouts
- Touch-friendly interactions
- Optimized image loading

## 🎨 Theming & Customization

### Element UI Theme Customization
```scss
// src/assets/styles/element-variables.scss
$--color-primary: #409EFF;
$--font-size-base: 14px;
// ... custom variables
```

### Custom Utility Classes
```scss
// src/assets/styles/utility.scss
.text-center { text-align: center; }
.mb-20 { margin-bottom: 20px; }
// ... utility classes
```

## 🚀 Deployment

### Production Build
```bash
npm run build:prod
```

### Build Output
```
dist/
├── css/                # Compiled CSS files
├── js/                 # Compiled JavaScript files
├── static/             # Static assets
└── index.html          # Main HTML file
```

### Deployment Options
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: CloudFlare, AWS CloudFront
- **Server**: Nginx, Apache

### Nginx Configuration Example
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

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Add JSDoc comments for functions

### Git Hooks
Pre-commit hooks automatically run:
- ESLint checking
- Prettier formatting
- Commit message validation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Vue.js Guide](https://vuejs.org/guide/)
- [Element UI Docs](https://element.eleme.io/#/en-US)
- [Vite Documentation](https://vitejs.dev/)

### Issues & Questions
- Create an issue for bug reports
- Use discussions for questions
- Check existing issues before creating new ones

### Contact
- **Email**: [your-email@university.edu]
- **Project Repository**: [repository-url]

---

**Built with ❤️ for the academic community**