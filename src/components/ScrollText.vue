<template>
	<!-- 外框，固定宽度 -->
	<div id="wrap">
		<!-- 内部滚动框 -->
		<div id="box">
			<!-- 展示的文字 -->
			<div id="marquee" v-html="notice"></div>
			<!-- 文字副本，为了实现无缝滚动 -->
			<div id="copy"></div>
		</div>
		<!-- 为了获取text实际宽度 -->
		<div id="node" v-html="notice"></div>
	</div>
</template>
<script>
	export default {
		name: 'ScrollText',
		props: ['notice'], // 父组件传入数据
		data() {
			return {}
		},

		// 更新的时候运动
		updated: function() {
			this.move()
		},

		methods: {
			move() {
				// 获取文字text 的计算后宽度 （由于overflow的存在，直接获取不到，需要独立的node计算）
				let outWidth = document.getElementById('wrap').getBoundingClientRect().width
				let width = document.getElementById('node').getBoundingClientRect().width
				let box = document.getElementById('box')
				let copy = document.getElementById('copy')
				let distance = 0 // 位移距离
				//判断如果内容宽度>外框宽度则开始滚动
				if (width > outWidth) {
					copy.innerHTML = this.notice
					setInterval(function() {
						distance = distance - 1
						// 如果位移超过文字宽度，则回到起点
						if (-distance >= width) {
							distance = 50
						}
						box.style.transform = 'translateX(' + distance + 'px)'
					}, 20)
				}
			}
		}
	}
</script>

<style scoped>
	/*  限制外框宽度，隐藏多余的部分 */
	#wrap {
		overflow: hidden;
		margin: -10px 0 10px 0;
		line-height: 0.5;
	}

	/*  移动框宽度设置 */
	#box {
		width: 80000%;
	}

	/*  文字一行显示 */
	#box #marquee,
	#box #copy {
		float: left;
	}

	/*  设置前后间隔 */
	#marquee {
		margin: 0 50px 0 0;
	}

	/*  获取宽度的节点，隐藏掉 */
	#node {
		white-space: nowrap;
		position: absolute;
		z-index: -999999;
		top: -999999px;
	}
</style>
