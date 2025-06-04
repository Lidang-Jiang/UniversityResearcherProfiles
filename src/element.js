import Vue from 'vue'
import {
  Skeleton,
  Card,
  SkeletonItem,
  Pagination,
  Dialog,
  Menu,
  Submenu,
  MenuItem,
  Input,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Loading,
  MessageBox,
  Message,
  Popover,
  Carousel,
  CarouselItem,
  Backtop,
  Divider,
  Icon,
  Image,
  Breadcrumb,
  BreadcrumbItem,
  Select,
  Option,
  DatePicker,
  Tag,
  InfiniteScroll,
  Col,
  Row,
  Progress,
  Collapse,
  CollapseItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Radio,
  RadioGroup,
  RadioButton,
  InputNumber,
  Link,
  Upload,
  Empty,
  Autocomplete,
  Timeline,
} from 'element-ui'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import ElementLocale from 'element-ui/lib/locale'

// 引入国际化工具函数
import { t, useLangStore } from '@/locales/index'

Vue.use(Col)
Vue.use(Progress)
Vue.use(Row)
Vue.use(Tag)
Vue.use(DatePicker)
Vue.use(Select)
Vue.use(Radio)
Vue.use(RadioButton)
Vue.use(RadioGroup)
Vue.use(InputNumber)
Vue.use(Option)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Image)
Vue.use(Icon)
Vue.use(Divider)
Vue.use(Backtop)
Vue.use(Popover)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Loading.directive)
Vue.use(Link)
Vue.use(Upload)
Vue.use(Empty)
Vue.use(Autocomplete)
Vue.use(Timeline)
Vue.use(Skeleton)
Vue.use(Card)
Vue.use(SkeletonItem)
Vue.directive(InfiniteScroll.name, InfiniteScroll)

Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
Vue.prototype.$loading = Loading.service
Vue.prototype.$ELEMENT = {
  size: window.devicePixelRatio > 1 ? 'small' : '',
  zIndex: 2000,
}
/**
 * 设置Element UI国际化配置
 * 通过自定义i18n方法桥接Element UI的国际化系统
 */
const setupElementI18n = () => {
  const langStore = useLangStore()
  const currentLang = langStore?.currentLang || 'zh-CN'

  // 构建映射对象 - 确保Element UI组件能访问到正确的语言包
  const messages = {
    'en-US': enLocale,
    'zh-CN': zhLocale,
  }

  // 配置Element UI的国际化系统
  ElementLocale.i18n((key, value) => {
    // 1. 首先尝试通过自定义t函数获取翻译
    const translation = t(key, { silent: true })

    // 2. 如果t函数已成功处理(不等于原key)，则处理插值
    if (translation !== key) {
      // 处理插值参数(如{total})
      return processTemplate(translation, value)
    }

    // 3. 尝试从Element内置语言包获取
    let elTranslation = key
    const langMessages = messages[currentLang] || messages['zh-CN']
    const keyPath = key.split('.')
    let result = langMessages

    // 循环查找翻译键
    for (const k of keyPath) {
      if (result && result[k] !== undefined) {
        result = result[k]
      } else {
        result = undefined
        break
      }
    }

    if (result !== undefined) {
      elTranslation = result
      // 对Element内置翻译也进行插值处理
      return processTemplate(elTranslation, value)
    }

    return key
  })

  console.log('Element UI i18n setup completed with language:', currentLang)
}

/**
 * 处理模板字符串中的插值变量
 * @param {string} template - 带占位符的模板字符串
 * @param {Object} data - 要插入的数据对象
 * @returns {string} 替换后的字符串
 */
function processTemplate(template, data) {
  if (!template || !data) return template

  // 支持{name}格式的插值占位符
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match
  })
}

// 导出setupElementI18n函数
export { setupElementI18n }
