// 锻炼计划数据
// 结构：
//   phases 数组，每个元素 = 一个训练阶段
//   - phase:        阶段名称（一级标题）
//   - description:  阶段说明
//   - startDate:    阶段起始日（仅信息展示）
//   - days:         训练日数组，顺序由你定，label 自由写
//     - label:  二级标题（如「周一」/「周末」/「Day 1」）
//     - note:  当日训练侧重（可选）
//     - items: 动作数组
//       - name:  动作名
//       - gif:   动作 GIF 路径（可空，空时显示首字占位）
//       - reps:  组数 × 次数

export const exercisePhases = [
	{
		phase: '拉伸动作',
		items: [
			{ name: '后三角肌拉伸', gif: '/exercise/后三角肌拉伸.gif', reps: '2 × 15s（单侧）' },
		]
	},
	{
		phase: '第一阶段',
		description: '五分化训练 · 全身激活',
		startDate: '2026-08-04',
		days: [
			{
				label: '周一',
				note: '上肢推 + 核心',
				items: [
					{ name: '俯卧撑', gif: '', reps: '4 × 12' },
					{
						name: '哑铃推举',
						gif: '',
						variants: [
							{ scene: '居家', reps: '4 × 15', weight: '5kg' },
							{ scene: '健身房', reps: '3 × 10', weight: '7.5kg' }
						]
					},
					{ name: '平板支撑', gif: '', reps: '3 × 1min' }
				]
			},
			{
				label: '周二',
				note: '背部训练',
				items: [
					{ name: '哑铃弯腰划船', gif: '/exercise/哑铃弯腰划船.gif', reps: '4 × 15', weight: '5kg' },
					{ name: '仰卧起坐', gif: '/exercise/仰卧起坐.gif', reps: '2 x 20' },
					{ name: '哑铃斜板划船', gif: '/exercise/哑铃斜板划船.gif', reps: '4 × 10（正握）', weight: '5kg' },
				]
			},
			{
				label: '周三',
				note: '肩部训练',
				items: [
					{ name: '哑铃单臂推肩', gif: '/exercise/哑铃单臂推肩.gif', reps: '2 x 10（单侧）', weight: '5kg'},
					{ name: '哑铃上举', gif: '/exercise/哑铃上举.gif', reps: '4 x 15', weight: '5kg'},
					{ name: 'V字卷腹', gif: '/exercise/反向卷腹.gif', reps: '4 x 20' },
					{ name: '左右勾拳', gif: '/exercise/左右勾拳.gif', reps: '2 x 15（单侧）' },
					{ name: '仰卧起坐', gif: '/exercise/仰卧起坐.gif', reps: '2 x 20' },
					{
						name: '蝴蝶机反向飞鸟',
						variants: [
							{ scene: '正常', gif: '/exercise/蝴蝶机反向飞鸟.gif', reps: '4 × 10', weight: '18kg' },
							{ scene: '平行', gif: '/exercise/蝴蝶机反向飞鸟(平行).gif', reps: '4 × 10', weight: '12kg' }
						]
					},
					{ name: '坐姿肩部推举', gif: '/exercise/坐姿肩部推举.gif', reps: '4 x 10', weight: '10kg' },
				]
			},
			{
				label: '周四',
				note: '上肢拉 + 核心',
				items: [
					{ name: 'V字卷腹', gif: '/exercise/反向卷腹.gif', reps: '4 x 20' },
				]
			},
			{
				label: '周五',
				note: '全身循环',
				items: [
					{ name: '俯卧撑', gif: '', reps: '3 × 15' },
					{ name: '深蹲', gif: '', reps: '3 × 20' },
					{ name: '波比跳', gif: '', reps: '3 × 8' }
				]
			}
		]
	}
	// 以后开新阶段就在这里追加一项：
	// { phase: '第二阶段', description: '...', startDate: '...', days: [...] }
]