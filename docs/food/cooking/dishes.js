// 菜品数据
export const dishesData = {
	categories: [
		{ id: 'homecooking', name: '家常菜', icon: '🍳' },
		// { id: 'vegetable', name: '蔬菜', icon: '🥬' },
		// { id: 'seafood', name: '海鲜', icon: '🦐' },
		// { id: 'soup', name: '汤羹', icon: '🍲' },
		// { id: 'staple', name: '主食', icon: '🍚' },
		// { id: 'dessert', name: '甜点', icon: '🍰' },
	],

	dishes: {
		homecooking: [
			{
				title: '四季',
				icon: '🍽️',
				dishes: [
					{ name: '番茄炒鸡蛋🍅🥚', desc: '经典家常菜', difficulty: '简单', time: '15分钟', link: '番茄炒鸡蛋' },
				]
			}
		],

		vegetable: [
			{
				title: '快手菜',
				icon: '⚡',
				dishes: [
					{ name: '蒜蓉西兰花', desc: '清淡健康', difficulty: '简单', time: '10分钟' },
					{ name: '番茄炒蛋', desc: '家常必备', difficulty: '简单', time: '15分钟' },
				]
			}
		],

		seafood: [
			{
				title: '海鲜料理',
				icon: '🐟',
				dishes: [
					{ name: '清蒸鲈鱼', desc: '鲜嫩美味', difficulty: '简单', time: '20分钟' },
				]
			}
		],

		soup: [
			{
				title: '滋补汤',
				icon: '🥣',
				dishes: [
					{ name: '番茄蛋花汤', desc: '简单快手', difficulty: '简单', time: '15分钟' },
				]
			}
		],

		staple: [
			{
				title: '主食',
				icon: '🍜',
				dishes: [
					{ name: '蛋炒饭', desc: '经典炒饭', difficulty: '简单', time: '10分钟' },
				]
			}
		],

		dessert: [
			{
				title: '甜品',
				icon: '🧁',
				dishes: [
					{ name: '双皮奶', desc: '广式甜品', difficulty: '中等', time: '30分钟' },
				]
			}
		]
	}
}
