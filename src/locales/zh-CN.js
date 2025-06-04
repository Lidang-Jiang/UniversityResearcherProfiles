export default {
  // 导航栏文本
  nav: {
    home: '首页',
    publications: '出版物',
    projects: '项目',
    news: '新闻',
  },

  // 侧边栏文本
  sidebar: {
    authorInfo: {
      name: '贺革',
      bio: '四川大学化学工程学院 副研究员',
      location: '中国',
      email: '邮箱：hege@scu.edu.cn',
    },
    links: {
      email: '邮箱',
      github: 'GitHub',
      googleScholar: '谷歌学术',
    },
    nav: {
      researchArea: '研究领域',
      researchDesc: '计算机视觉、深度学习、医学图像分析',
      navigation: '导航',
      allPapers: '所有论文',
      journalPapers: '期刊论文',
      conferencePapers: '会议论文',
      allProjects: '所有项目',
      activeProjects: '进行中',
      completedProjects: '已完成',
    },
  },

  // 公共按钮文本
  common: {
    switchLang: '切换到英文',
  },
  // 新增领域分类翻译
  domainCategory: {
    all: '全部',
    materials: '材料研究',
    device: '单元设备',
    process: '过程系统',
  },
  // 新增出版物页面按钮文本
  publications: {
    downloadPDF: '下载PDF',
    viewDetail: '查看详情',
    detail: {
      reference: '引用信息:',
      publishDate: '发布日期:',
      titleUrl: '文章链接:',
      researchField: '研究领域:',
      summary: '摘要',
      downloadPDF: '下载论文PDF',
      back: '返回列表',
    },
  },
  el: {
    pagination: {
      goto: '前往',
      pagesize: '条/页',
      total: '共 {total} 条',
      pageClassifier: '页',
      prev: '上一页',
      next: '下一页',
    },
    select: {
      loading: '加载中',
      noMatch: '无匹配数据',
      noData: '无数据',
      placeholder: '请选择',
    },
    // 可以根据项目需要添加更多Element组件翻译
    table: {
      emptyText: '暂无数据',
      confirmFilter: '筛选',
      resetFilter: '重置',
      clearFilter: '全部',
    },
  },
  pagination: {
    total: '共',
    totalSuffix: '条',
    perPage: '条/页',
    jumpTo: '跳至',
    page: '页',
  },
  // 增加项目页面相关翻译
  projects: {
    filter: {
      projectType: '项目类型',
      allTypes: '全部类型',
    },
    types: {
      basic: '基础研究',
      commercial: '企业横向',
    },
  },
}
