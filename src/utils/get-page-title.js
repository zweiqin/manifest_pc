import defaultSettings from '@/settings'

const title = defaultSettings.title || 'demo——商户后台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
