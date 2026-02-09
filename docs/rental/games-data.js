// 游戏租赁数据
export const rentalGames = [
	{
		id: 1,
		title: '漫威蜘蛛侠2',
		titleEn: 'Marvel\'s Spider-Man 2',
		cover: '/gameover/蜘蛛侠2-v.jpg',
		platform: 'PS5',
		version: '港版 中英文合版',
		cost: 195,
		rentalPrice: 20,
		deposit: 220,
		note: '光盘无划痕，盒子完好',
		popularity: 0,
		history: [
			{ date: '2025-12-8', renter: 'HelloAlita', income: 20, returned: true, returnDate: '2025-12-19' },
		]
	},
	{
		id: 2,
		title: '对马岛之魂',
		titleEn: 'Ghost of Tsushima',
		cover: '/gameover/对马岛之魂-v.jpg',
		platform: 'PS5',
		version: '中文版',
		cost: 180,
		rentalPrice: 20,
		deposit: 220,
		note: '外壳内部有裂痕，盘无损',
		popularity: 0,
		history: [
			{ date: '2026-01-06', renter: '向西0', income: 18, returned: true, returnDate: '2026-02-07' },
		]
	},
	{
		id: 3,
		title: '荒野大镖客: 救赎2',
		titleEn: 'Red Dead Redemption 2',
		cover: '/gameover/荒野大镖客2-v.jpg',
		platform: 'PS4',
		version: '美版 中文',
		cost: 120,
		rentalPrice: 20,
		deposit: 220,
		note: '光盘无划痕，盒子完好',
		popularity: 0,
		history: [
			{ date: '2026-02-07', renter: '向西0', income: 18, returned: false, returnDate: '2026-03-11' },
		]
	},
	{
		id: 4,
		title: '双影奇境',
		titleEn: 'Split Fiction',
		cover: '/gameover/双影奇境-v.jpg',
		platform: 'PS5',
		version: '港版 中文',
		cost: 250,
		rentalPrice: 30,
		deposit: 250,
		note: '光盘无划痕，盒子完好',
		popularity: 0,
		history: [
			{ date: '2026-01-13', renter: '帅的想整容i', income: 20, returned: true, returnDate: '2026-02-07' },
			{ date: '2026-02-07', renter: 'niko', income: 30, returned: false, returnDate: '2026-03-11' },
		]
	},
]
