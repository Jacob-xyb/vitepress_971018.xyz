// 游戏租赁数据
export const rentalGames = [
  {
    id: 1,
    title: '漫威蜘蛛侠2',
    titleEn: 'Marvel\'s Spider-Man 2',
    cover: '/gameover/蜘蛛侠2-v.jpg',
    platform: 'PS5',
    cost: 195,
    rentalPrice: 20,
    deposit: 220,
    note: '光盘无划痕，盒子完好',
    popularity: 0,
    history: [
      { date: '2025-12-8', renter: 'HelloAlita', income: 50, returned: true, returnDate: '2025-01-19' },
    ]
  },
  {
    id: 2,
    title: '真三国无双起源',
    titleEn: 'Dynasty Warriors: Origins',
    cover: '/gameover/真三国无双起源-v.jpg',
    platform: 'PS5',
    cost: 350,
    rentalPrice: 60,
    deposit: 150,
    note: '全新未拆封',
    popularity: 0,
    history: [
      { date: '2025-01-20', renter: '赵六', income: 60, returned: true, returnDate: '2025-01-30' },
      { date: '2026-02-05', renter: '王五', income: 60, returned: false, returnDate: '2026-02-12' },
    ]
  },
]
