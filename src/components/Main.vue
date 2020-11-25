<template>
	<el-container>
		<el-header>
			<!-- pc菜单 -->
			<el-menu class="hidden-xs-only" :default-active="onRoutes" background-color="#E6A23C" text-color="#ffffff"
			 active-text-color="#ffff00" mode="horizontal" unique-opened router>
				<el-menu-item style="border: none;">
					<img class="logImg" src="../assets/image/logo.png" />
				</el-menu-item>
				<el-menu-item index="/home">HOME</el-menu-item>
				<el-menu-item index="/product/discount">DISCOUNT</el-menu-item>
				<el-menu-item index="/product/freebies">FREEBIES</el-menu-item>
				<el-menu-item index="/product/points">POINTS FOR</el-menu-item>
				<el-menu-item index="/product/commission">EARN COMMISSION</el-menu-item>
				<el-menu-item index="/order">ORDER</el-menu-item>
				<el-menu-item index="/faq">FAQ</el-menu-item>
				<span class="pc-search">
					<el-input placeholder="Search All Products" v-model="search" class="search-input">
						<el-button slot="append" icon="el-icon-search" @click="productSearch"></el-button>
					</el-input>
				</span>
				<el-dropdown class="f-r" @command="handleCommand">
					<el-button class="country-btn">
						<img class="country-img" :src="countryImg">
						<span> {{countryName}}</span>
						<i class="el-icon-arrow-down el-icon--right"></i>
					</el-button>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item style="margin: 5px 0" v-for="item in countryData" :command="item.Id+','+item.CounteyShorthand">
							<img class="country-img" :src="item.icon"> {{item.CounteyShorthand}}
						</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
				<el-menu-item v-if="!userId" index="/login" class="f-r">LogIn / SignUp</el-menu-item>
				<el-submenu v-if="userId" index="0" class="f-r">
					<template slot="title"><i class="el-icon-s-custom user-icon"></i>{{userName}}</template>
					<el-menu-item index="/userInfo">User Profile</el-menu-item>
					<el-menu-item index="0" @click="loginOut">Login Out</el-menu-item>
				</el-submenu>
			</el-menu>
			<!-- 移动端菜单 -->
			<el-menu class="hidden-sm-and-up" :default-active="onRoutes" background-color="#E6A23C" text-color="#ffffff"
			 active-text-color="#ffff00" unique-opened router @select="mobilMenuShow=!mobilMenuShow">
				<el-menu-item style="display: flex; justify-content:space-between;">
					<div><img class="logImg" src="../assets/image/logo.png" /></div>
					<el-dropdown class="f-r" @command="handleCommand">
						<el-button class="country-btn">
							<img class="country-img" :src="countryImg">
							<span> {{countryName}}</span>
							<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item style="margin: 5px 0" v-for="item in countryData" :command="item.Id+','+item.CounteyShorthand">
								<img class="country-img" :src="item.icon"> {{item.CounteyShorthand}}
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<div><i class="el-icon-postcard fff" style="font-size: 30px;"></i></div>
				</el-menu-item>
				<transition name="el-zoom-in-top">
					<div v-if="mobilMenuShow">
						<el-menu-item index="/home">HOME</el-menu-item>
						<el-menu-item index="/product/discount">DISCOUNT</el-menu-item>
						<el-menu-item index="/product/freebies">FREEBIES</el-menu-item>
						<el-menu-item index="/product/points">POINTS FOR</el-menu-item>
						<el-menu-item index="/product/commission">EARN COMMISSION</el-menu-item>
						<el-menu-item index="/order">ORDER</el-menu-item>
						<el-menu-item index="/faq">FAQ</el-menu-item>
						<el-menu-item v-if="!userId" index="/login">LogIn / SignUp</el-menu-item>
						<el-submenu v-if="userId" index="0">
							<template slot="title"><i class="el-icon-s-custom"></i>{{userName}}</template>
							<el-menu-item index="/userInfo">User Profile</el-menu-item>
							<el-menu-item index="0" @click="loginOut">Login Out</el-menu-item>
						</el-submenu>
						<div class="mb-search">
							<el-input placeholder="Search All Products" v-model="search">
								<el-button slot="append" icon="el-icon-search" @click="productSearch"></el-button>
							</el-input>
						</div>
					</div>
				</transition>
			</el-menu>
		</el-header>

		<el-container>
			<el-main>
				<router-view :key="$route.fullPath"></router-view>
			</el-main>
		</el-container>

		<div class="contact-box">
			<div class="mr15"><img class="icon-img" src="../assets/image/f-share-facebook.png" /></div>
			<div class="mr15"><img class="icon-img" src="../assets/image/f-share-twitter.png" /></div>
			<div class="mr30"><a href="mailto:123456@qq.com"><img class="icon-img" src="../assets/image/f-share-email.png" /></a></div>
			<div>
				<el-popover placement="top-start" width="200" trigger="hover">
					<div class="popover-content" v-html="contact"></div>
					<el-button round slot="reference">Contact us</el-button>
				</el-popover>
			</div>
		</div>

		<el-footer>2020-2030 © Copyright By Amz-Buy</el-footer>

	</el-container>

</template>

<script>
	import {
		countryList,
		contactList
	} from '@/api/api'

	export default {
		name: 'Main',
		data() {
			return {
				mobilMenuShow: false,
				userId: sessionStorage.getItem('userId'),
				userName: sessionStorage.getItem('userName'),
				countryName: localStorage.getItem('cName'),
				countryImg: require('@/assets/image/' + localStorage.getItem('cName') + '.png'),
				countryData: [],
				search: '',
				contact: '',
			}
		},

		computed: {
			onRoutes() {
				return this.$route.path
			}
		},

		created() {
			this.getCountryData()
			this.getContactData()
		},

		methods: {
			//搜索商品
			productSearch() {
				this.$router.push({
					path: '/product/all',
					query: {
						keywords: this.search
					}
				})
				this.search = ''
			},

			//获取联系方式
			getContactData() {
				let _this = this
				let cId = localStorage.getItem('cId')
				let params = {
					CountryId: cId
				}
				contactList(params).then(res => {
					_this.contact = res.result.Contact
				}).catch((e) => {})
			},

			//退出
			loginOut() {
				sessionStorage.clear()
				this.$router.push('/home')
				window.location.reload()
			},

			// 获取国家数据
			getCountryData() {
				let _this = this
				let params = {}
				countryList(params).then(res => {
					_this.countryData = res.result
					//附加上国家图片
					for (let x in _this.countryData) {
						_this.countryData[x].icon = require('@/assets/image/' + _this.countryData[x].CounteyShorthand + '.png')
					}
				}).catch((e) => {})
			},

			// 切换国家
			handleCommand(command) {
				let info = command.split(",")
				let cId = info[0]
				let cName = info[1]
				localStorage.setItem('cId', cId)
				localStorage.setItem('cName', cName)

				this.$router.push('/home')
				window.location.reload()
			}
		}
	}
</script>
