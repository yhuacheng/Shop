<template>
	<div class="loading-box">
		<img src="../assets/image/loading.gif">
	</div>
</template>

<script>
	import {
		countryList,
		address
	} from '@/api/api'

	export default {
		name: 'Loading',
		data() {
			return {
				countryData: []
			}
		},

		created() {
			this.getCountryData()
		},

		methods: {
			// 获取国家数据
			getCountryData() {
				let _this = this
				let params = {}
				countryList(params).then(res => {
					_this.countryData = res.result
					_this.getLocalCountry()
				}).catch((e) => {})
			},

			// 获取当前国家
			getLocalCountry() {
				let _this = this
				address().then(res => {
					let cName = res.json.address.split(" ")[0]
					if (cName) {
						let arr = _this.countryData.map(item => item.CountryName)
						let flg = arr.indexOf(cName)
						if (flg > 0) {
							let countryData = _this.countryData
							for (let x in countryData) {
								if (cName == countryData[x].CountryName) {
									localStorage.setItem('cId', countryData[x].Id)
									localStorage.setItem('cName', countryData[x].CounteyShorthand)
									_this.goHome()
								}
							}
						} else {
							_this.setDefaultCountry()
						}
					} else {
						_this.setDefaultCountry()
					}
				}).catch((e) => {
					_this.setDefaultCountry()
				})
			},

			//设置默认国家(国家列表第一个国家为默认)
			setDefaultCountry() {
				let id = this.countryData[0].Id
				let name = this.countryData[0].CounteyShorthand
				localStorage.setItem('cId', id)
				localStorage.setItem('cName', name)
				this.goHome()
			},

			//跳转前往首页（跳转设置一点延迟，避免loading动画一闪而过）
			goHome() {
				let _this = this
				setTimeout(() => {
					_this.$router.push('/home')
				}, 500)
			}

		}
	}
</script>

<style>
	.loading-box {
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #FFF;
	}
</style>
