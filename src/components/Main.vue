<template>
	<el-container>
		<el-header>
			<!-- pc菜单 -->
			<el-menu class="hidden-xs-only" :default-active="onRoutes" background-color="#FFF" text-color="#444"
				active-text-color="#FF6A28" mode="horizontal" unique-opened router>
				<el-menu-item index="/home" style="border: none;">
					<img class="logImg" src="../assets/image/logo.png" />
				</el-menu-item>
				<!--
				<el-menu-item index="/product/discount">DISCOUNT</el-menu-item>
				<el-menu-item index="/product/freebies">FREEBIES</el-menu-item>
				<el-menu-item index="/product/points">POINTS FOR</el-menu-item>
				<el-menu-item index="/product/commission">EARN COMMISSION</el-menu-item>
				-->
				<el-menu-item index="/product/all">PRODUCTS</el-menu-item>
				<el-menu-item index="/order">ORDER</el-menu-item>
				<el-menu-item index="/faq">FAQ</el-menu-item>
				<span class="pc-search">
					<el-input placeholder="Search Products" v-model="search" class="search-input">
						<el-select v-model="select" slot="prepend" class="search-select">
							<el-option label="All" value="all"></el-option>
							<el-option label="Discount" value="discount"></el-option>
							<el-option label="Freebies" value="freebies"></el-option>
							<el-option label="Points" value="points"></el-option>
							<el-option label="Commission" value="commission"></el-option>
						</el-select>
						<el-button slot="append" icon="el-icon-search" @click="productSearch"></el-button>
					</el-input>
				</span>
				<span v-if="notice" @click="MessageModal=true">
					<el-badge value="1" class="item message" type="danger">
						<i class="el-icon-message"></i>
					</el-badge>
				</span>
				<el-dropdown class="f-r" @command="handleCommand">
					<el-button class="country-btn">
						<img class="country-img" :src="countryImg">
						<span> {{countryName}}</span>
						<i class="el-icon-arrow-down el-icon--right"></i>
					</el-button>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item style="margin: 5px 0" v-for="item in countryData"
							:command="item.Id+','+item.CounteyShorthand">
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
			<el-menu class="hidden-sm-and-up" :default-active="onRoutes" background-color="#FFF" text-color="#444"
				active-text-color="#FF6A28" unique-opened router @select="mobilMenuShow=!mobilMenuShow">
				<el-menu-item style="display: flex; justify-content:space-between;">
					<div><img class="logImg" src="../assets/image/logo.png" /></div>
					<div><i class="el-icon-postcard fff" style="font-size: 30px;"></i></div>
					<div v-if="notice" @click.stop="MessageModal=true">
						<el-badge value="1" class="item message mb-message" type="danger">
							<i class="el-icon-message"></i>
						</el-badge>
					</div>
				</el-menu-item>
				<transition name="el-zoom-in-top">
					<div v-if="mobilMenuShow">
						<el-menu-item index="/home">HOME</el-menu-item>
						<!--
						<el-menu-item index="/product/discount">DISCOUNT</el-menu-item>
						<el-menu-item index="/product/freebies">FREEBIES</el-menu-item>
						<el-menu-item index="/product/points">POINTS FOR</el-menu-item>
						<el-menu-item index="/product/commission">EARN COMMISSION</el-menu-item>
						-->
						<el-menu-item index="/product/all">PRODUCTS</el-menu-item>
						<el-menu-item index="/order">ORDER</el-menu-item>
						<el-menu-item index="/faq">FAQ</el-menu-item>
						<el-menu-item v-if="!userId" index="/login">LogIn / SignUp</el-menu-item>
						<el-submenu v-if="userId" index="0">
							<template slot="title"><i class="el-icon-s-custom"></i>{{userName}}</template>
							<el-menu-item index="/userInfo">User Profile</el-menu-item>
							<el-menu-item index="0" @click="loginOut">Login Out</el-menu-item>
						</el-submenu>

						<el-dropdown class="f-r" @command="handleCommand"
							style="position: absolute;bottom: 70px;right: 0px;">
							<el-button class="country-btn">
								<img class="country-img" :src="countryImg">
								<span> {{countryName}}</span>
								<i class="el-icon-arrow-down el-icon--right"></i>
							</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item style="margin: 5px 0" v-for="item in countryData"
									:command="item.Id+','+item.CounteyShorthand">
									<img class="country-img" :src="item.icon"> {{item.CounteyShorthand}}
								</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>

						<div class="mb-search">
							<el-input placeholder="Search Products" v-model="search">
								<el-select v-model="select" slot="prepend" class="search-select">
									<el-option label="All" value="all"></el-option>
									<el-option label="Discount" value="discount"></el-option>
									<el-option label="Freebies" value="freebies"></el-option>
									<el-option label="Points" value="points"></el-option>
									<el-option label="Commission" value="commission"></el-option>
								</el-select>
								<el-button slot="append" icon="el-icon-search" @click="productSearch"></el-button>
							</el-input>
						</div>
					</div>
				</transition>
			</el-menu>
		</el-header>
		<el-container>
			<el-main>
				<div class="main-container">
					<router-view :key="$route.fullPath"></router-view>
				</div>
				<div class="foot-container">
					<div class="contact-box">
						<div class="mr15"><a href="https://www.facebook.com/accpower" target="_blank"><img
									class="icon-img" src="../assets/image/f-share-facebook.png" /></a></div>
						<div class="mr15"><a href="https://twitter.com/Francesouth2" target="_blank"><img
									class="icon-img" src="../assets/image/f-share-twitter.png" /></a></div>
						<div class="mr30"><a href="mailto:robertwells4625@gmail.com"><img class="icon-img"
									src="../assets/image/f-share-email.png" /></a></div>
						<div>
							<el-popover placement="top-start" width="320" trigger="hover">
								<div class="popover-content" v-html="contact"></div>
								<el-button round slot="reference">Contact us</el-button>
							</el-popover>
						</div>
					</div>
					<el-footer>{{year}} © Copyright By Amz-Buy | robertwells4625@gmail.com</el-footer>
				</div>
			</el-main>
		</el-container>

		<!-- 公告信息弹窗 -->
		<el-dialog title="Message" :visible.sync="MessageModal" width="80%">
			<span v-html="notice"></span>
			<div slot="footer" class="dialog-footer">
				<el-button @click="MessageModal=false">I See</el-button>
			</div>
		</el-dialog>

	</el-container>

</template>

<script>
	import {
		countryList,
		contactList,
		noticeList
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
				select: 'all',
				contact: '',
				year: new Date().getFullYear(),
				MessageModal: false,
				notice: ''
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
			this.getNoticeData()
		},

		methods: {
			//搜索商品
			productSearch() {
				let _this = this
				let s = _this.select
				this.$router.push({
					path: '/product/' + s,
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
						_this.countryData[x].icon = require('@/assets/image/' + _this.countryData[x]
							.CounteyShorthand + '.png')
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
			},

			// 获取公告数据
			getNoticeData() {
				let _this = this
				let cId = localStorage.getItem('cId')
				let params = {
					CountryId: cId
				}
				noticeList(params).then(res => {
					_this.notice = res.result.Message
				}).catch((e) => {})
			}
		}
	}
</script>
