// 状态配置
export const statusConfig = {
  available: { 
    label: '未出租', 
    color: '#10b981', 
    bgColor: 'rgba(16, 185, 129, 0.1)' 
  },
  rented: { 
    label: '出租中', 
    color: '#f59e0b', 
    bgColor: 'rgba(245, 158, 11, 0.1)' 
  },
  overdue: { 
    label: '已超时', 
    color: '#ef4444', 
    bgColor: 'rgba(239, 68, 68, 0.1)' 
  }
}

// 平台颜色配置
export const getPlatformColor = (platform) => {
  const platformLower = platform.toLowerCase()
  
  if (platformLower.startsWith('ps')) {
    return { bg: '#2563eb', text: '#ffffff' }
  } else if (platformLower.startsWith('ns')) {
    return { bg: '#dc2626', text: '#ffffff' }
  } else if (platformLower.startsWith('pc')) {
    return { bg: '#6b7280', text: '#ffffff' }
  }
  
  return { bg: '#6b7280', text: '#ffffff' }
}
