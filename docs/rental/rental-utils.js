// 计算租赁天数
export const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// 计算游戏状态
export const getGameStatus = (game) => {
  if (!game.history || game.history.length === 0) {
    return 'available'
  }
  
  // 找最后一条未归还的记录
  for (let i = game.history.length - 1; i >= 0; i--) {
    const record = game.history[i]
    if (!record.returned) {
      // 如果有预计归还日期，检查是否超时
      if (record.returnDate) {
        const expectedReturn = new Date(record.returnDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        expectedReturn.setHours(0, 0, 0, 0)
        
        if (today > expectedReturn) {
          return 'overdue'
        }
      }
      return 'rented'
    }
  }
  
  return 'available'
}

// 计算总收入
export const getTotalIncome = (game) => {
  return game.history.reduce((sum, record) => sum + record.income, 0)
}

// 计算净利润
export const getNetProfit = (game) => {
  return getTotalIncome(game) - game.cost
}

// 计算回本进度
export const getRecoveryRate = (game) => {
  const total = getTotalIncome(game)
  return Math.min((total / game.cost) * 100, 100).toFixed(1)
}

// 计算游戏热度
export const calculatePopularity = (game) => {
  return game.popularity + (game.history?.length || 0) * 10
}

// 按热度排序游戏
export const sortGamesByPopularity = (games) => {
  return [...games].sort((a, b) => {
    const popularityA = calculatePopularity(a)
    const popularityB = calculatePopularity(b)
    return popularityB - popularityA
  })
}

// 计算总体统计数据
export const calculateOverallStats = (games) => {
  const totalCost = games.reduce((sum, game) => sum + game.cost, 0)
  const totalIncome = games.reduce((sum, game) => sum + getTotalIncome(game), 0)
  const totalProfit = totalIncome - totalCost
  const recoveryRate = totalCost > 0 ? (totalIncome / totalCost * 100).toFixed(1) : 0
  
  // 统计游戏数量
  const totalGames = games.length
  const rentedGames = games.filter(game => getGameStatus(game) === 'rented').length
  const overdueGames = games.filter(game => getGameStatus(game) === 'overdue').length
  const availableGames = games.filter(game => getGameStatus(game) === 'available').length
  
  // 统计租赁次数
  const totalRentals = games.reduce((sum, game) => sum + (game.history?.length || 0), 0)
  
  // 已回本游戏数量
  const recoveredGames = games.filter(game => getTotalIncome(game) >= game.cost).length
  
  return {
    totalCost,
    totalIncome,
    totalProfit,
    recoveryRate,
    totalGames,
    rentedGames,
    overdueGames,
    availableGames,
    totalRentals,
    recoveredGames
  }
}
