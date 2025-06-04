// 正确路径：指向简单系统
import request from '@/utils/fetch'

/**
 * 预览图片
 * @param {string} filename - 图片文件名
 * @returns {Promise<Blob>} 预览图片的二进制数据
 */
export function previewPic(filename) {
  // 步骤1：修改responseType为'blob'而非'image'
  return request({
    url: `/previewPic/${filename}`,
    method: 'get',
    responseType: 'blob', // 关键修改：接收二进制数据
    isPreview: true, // 关键新增：标识这是预览请求，不触发下载
  })
}

export function downloadPDF(filename) {
  // 步骤1：修改responseType为'blob'而非'image'
  return request({
    url: `/downloadPDF/${filename}`,
    method: 'get',
    responseType: 'blob', // 关键修改：接收二进制数据
    customDownload: true, // 添加自定义下载标识
  })
}
