/**
 * 头像缓存服务 - 提供内存缓存和持久化存储功能
 * 在实际项目中，该组件解决了20+页面切换时头像闪烁问题
 */

// 内存缓存 - 提供最快的访问速度
const memoryCache = new Map()

// 缓存有效期（24小时，单位毫秒）
const CACHE_EXPIRY = 24 * 60 * 60 * 1000

// localStorage键名前缀
const STORAGE_PREFIX = 'avatar_cache_'

/**
 * 获取缓存的头像Blob URL
 * @param {string} avatarName - 头像文件名
 * @returns {string|null} 缓存的Blob URL或null（未缓存）
 */
export function getCachedAvatar(avatarName) {
  if (!avatarName) return null

  // 步骤1: 检查内存缓存
  if (memoryCache.has(avatarName)) {
    const cacheItem = memoryCache.get(avatarName)
    // 检查是否过期
    if (Date.now() - cacheItem.timestamp < CACHE_EXPIRY) {
      console.log('[头像缓存] 命中内存缓存:', avatarName)
      return cacheItem.url
    } else {
      // 过期则清理缓存
      console.log('[头像缓存] 缓存已过期:', avatarName)
      clearCache(avatarName)
    }
  }

  // 步骤2: 检查localStorage缓存
  try {
    const storageKey = STORAGE_PREFIX + avatarName
    const storageData = localStorage.getItem(storageKey)

    if (storageData) {
      const parsedData = JSON.parse(storageData)

      // 检查localStorage中的缓存是否过期
      if (Date.now() - parsedData.timestamp < CACHE_EXPIRY) {
        console.log('[头像缓存] 命中localStorage缓存:', avatarName)

        // 从Base64还原Blob并创建URL
        const byteString = atob(parsedData.base64Data.split(',')[1])
        const mimeType = parsedData.base64Data.split(',')[0].split(':')[1].split(';')[0]
        const arrayBuffer = new ArrayBuffer(byteString.length)
        const uint8Array = new Uint8Array(arrayBuffer)

        for (let i = 0; i < byteString.length; i++) {
          uint8Array[i] = byteString.charCodeAt(i)
        }

        const blob = new Blob([arrayBuffer], { type: mimeType })
        const url = URL.createObjectURL(blob)

        // 更新内存缓存
        memoryCache.set(avatarName, {
          url,
          timestamp: Date.now(),
          blob,
        })

        return url
      } else {
        // 过期则清理localStorage
        localStorage.removeItem(storageKey)
      }
    }
  } catch (error) {
    console.error('[头像缓存] 读取localStorage失败:', error)
  }

  return null
}

/**
 * 缓存头像数据
 * @param {string} avatarName - 头像文件名
 * @param {Blob} blobData - 头像Blob数据
 * @returns {string} 创建的Blob URL
 */
export function cacheAvatar(avatarName, blobData) {
  if (!avatarName || !(blobData instanceof Blob)) {
    console.warn('[头像缓存] 无效的缓存参数')
    return null
  }

  // 步骤1: 为Blob创建URL
  const url = URL.createObjectURL(blobData)

  // 步骤2: 更新内存缓存
  memoryCache.set(avatarName, {
    url,
    blob: blobData,
    timestamp: Date.now(),
  })

  // 步骤3: 更新localStorage (异步处理，不阻塞主线程)
  setTimeout(() => {
    try {
      const reader = new FileReader()
      reader.onload = function () {
        const base64Data = reader.result
        const storageItem = {
          base64Data,
          timestamp: Date.now(),
        }

        localStorage.setItem(STORAGE_PREFIX + avatarName, JSON.stringify(storageItem))
        console.log('[头像缓存] 已保存到localStorage:', avatarName)
      }
      reader.readAsDataURL(blobData)
    } catch (error) {
      console.error('[头像缓存] 保存到localStorage失败:', error)
    }
  }, 0)

  console.log('[头像缓存] 已缓存新头像:', avatarName)
  return url
}

/**
 * 清理指定头像的缓存
 * @param {string} avatarName - 头像文件名
 */
export function clearCache(avatarName) {
  // 步骤1: 清理内存缓存
  if (memoryCache.has(avatarName)) {
    const cacheItem = memoryCache.get(avatarName)
    if (cacheItem.url) {
      URL.revokeObjectURL(cacheItem.url)
    }
    memoryCache.delete(avatarName)
  }

  // 步骤2: 清理localStorage缓存
  try {
    localStorage.removeItem(STORAGE_PREFIX + avatarName)
  } catch (error) {
    console.error('[头像缓存] 清理localStorage失败:', error)
  }
}

/**
 * 清理所有头像缓存
 */
export function clearAllCaches() {
  // 步骤1: 清理所有内存缓存
  memoryCache.forEach((cacheItem, key) => {
    if (cacheItem.url) {
      URL.revokeObjectURL(cacheItem.url)
    }
  })
  memoryCache.clear()

  // 步骤2: 清理所有localStorage缓存
  try {
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key))
  } catch (error) {
    console.error('[头像缓存] 清理所有localStorage失败:', error)
  }
}
