import defaultSettings from '@/settings'

const title = defaultSettings.title || '货单管理系统——商户后台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
