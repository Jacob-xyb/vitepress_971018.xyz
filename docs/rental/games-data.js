// 游戏租赁数据
export const rentalGames = [
  {
    id: 1,
    title: '仁王3',
    titleEn: 'Nioh 3',
    cover: '/gameover/仁王3-v.jpg',
    platform: 'PS5',
    cost: 300,
    rentalPrice: 50,
    deposit: 100,
    history: [
      { date: '2025-01-15', renter: '张三', income: 50, returned: true, returnDate: '2025-01-22' },
      { date: '2025-01-25', renter: '李四', income: 50, returned: true, returnDate: '2025-01-30' },
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
    history: [
      { date: '2025-01-20', renter: '赵六', income: 60, returned: true, returnDate: '2025-01-30' },
      { date: '2026-02-05', renter: '王五', income: 60, returned: false, returnDate: '2026-02-12' },
    ]
  },
]
