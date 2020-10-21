<template>
	<div class="productView-box">
		<el-row :gutter="100">
			<el-col :xs="24" :sm="10">
				<img class="productImage" :src="$IMGURL+productInfo.image" />
				<ul class="product-imgs">
					<li v-for="item in productInfo.allImage" @click="changeImg(item)"><img class="productImage" :src="$IMGURL+item" /></li>
				</ul>
			</el-col>
			<el-col :xs="24" :sm="14">
				<div class="productViewTitle">{{productInfo.name}}</div>
				<div style="border: 1px dashed #DDDDDD;padding: 15px;margin: 15px 0;">
					<div class="productView">
						<span>stock:</span>
						<span class="success">{{productInfo.num}}</span>
					</div>
					<div class="productView">
						<span>Price:</span>
						<span class="text-line-x info">{{productInfo.price}}{{productInfo.currency}}</span>
						<el-tag type="danger" size="medium">{{productInfo.discount-100}}%</el-tag>
						<span class="warning">{{productInfo.nowPrice}}{{productInfo.currency}}</span>
					</div>
					<div class="productView">
						<span>You can get:</span>
						<span v-if="productInfo.disType=='1'" class="warning">Discount</span>
						<span v-if="productInfo.disType=='2'" class="warning">Freebies</span>
						<span v-if="productInfo.disType=='3'" class="warning">Earn {{productInfo.integral}} Points</span>
						<span v-if="productInfo.disType=='4'" class="warning">Earn {{productInfo.commission}} Commission</span>
					</div>
				</div>
				<div class="productView">
					<el-button v-if="!userId" type="warning" round class="w100" @click="goToLogin">You must log in to purchase</el-button>
					<el-button v-if="userId" type="warning" round class="w100">Buy Now</el-button>
				</div>
				<div class="contact" v-html="contact"></div>
			</el-col>
			<el-col :xs="24" :sm="24">
				<div class="productViewDis" v-html="productInfo.description"></div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import {
		productList,
		contactList
	} from '@/api/api'

	export default {
		name: 'details',
		data() {
			return {
				userId: sessionStorage.getItem('userId'),
				productData: [],
				productInfo: {
					name: '',
					country: '',
					type: '',
					price: '',
					nowPrice: '',
					currency: '',
					discount: '',
					num: '',
					disType: '',
					integral: '',
					commission: '',
					description: '',
					image: '',
					allImage: []
				},
				contact: ''
			}
		},
		created() {
			this.getProductData()
			this.getContactData()
		},
		methods: {
			// 获取商品列表数据
			getProductData() {
				let _this = this
				let cId = localStorage.getItem('cId')
				let params = {
					countryId: cId,
					productTypeId: 0,
					DiscountsTypeId: 0,
					TradeName: '',
					pageIndex: 1,
					pageSize: 100000000
				}
				productList(params).then(res => {
					_this.productData = res.result.Entity
					_this.productDetails()
				}).catch((e) => {})
			},

			//查看商品详情
			productDetails() {
				let _this = this
				let id = _this.$route.query.id
				let data = _this.productData
				for (let x in data) {
					if (data[x].Id == id) {
						_this.productInfo.name = data[x].ProductName
						_this.productInfo.price = data[x].Price
						_this.productInfo.nowPrice = data[x].PresentPrice
						_this.productInfo.currency = data[x].Currency
						_this.productInfo.discount = data[x].Discount
						_this.productInfo.num = data[x].Number
						_this.productInfo.disType = data[x].DiscountsTypeId
						_this.productInfo.integral = data[x].Integral
						_this.productInfo.commission = data[x].Commission
						_this.productInfo.description = data[x].ProductDescribe
						if (data[x].ProductUrl) {
							_this.productInfo.image = data[x].ProductUrl
						}
						if (data[x].Subgraph) {
							let all = data[x].ProductUrl + ',' + data[x].Subgraph
							let arr = all.split(",")
							_this.productInfo.allImage = arr
						}
					}
				}
			},

			// 切换图片
			changeImg(img) {
				let _this = this
				_this.productInfo.image = img
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

			//前往登录页
			goToLogin() {
				this.$router.push({
					path: '/login'
				})
			}

		}
	}
</script>
