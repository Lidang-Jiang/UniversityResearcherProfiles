import { useColumnStore } from '@/store'

export default {
  inserted(el, binding) {
    const { value, modifiers } = binding
    const store = useColumnStore()
    const checkContentType = modifiers.type
    const hasPermission = store.columnList.some((nav) => {
      if (checkContentType) {
        return nav.contentMaintenance === value
      }
      return nav.id === value || nav.columnManageListVOS.some((c) => c.id === value)
    })
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  },
}
