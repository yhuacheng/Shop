<template>
	<div class="productView-box">
		<el-row :gutter="60">
			<el-col :xs="24" :sm="10">
				<img class="productImage" :src="$IMGURL+productInfo.image" />
				<ul class="product-imgs">
					<li v-for="item in productInfo.allImage" @click="changeImg(item)"><img class="productImage" :src="$IMGURL+item" /></li>
				</ul>
			</el-col>
			<el-col :xs="24" :sm="14">
				<div class="productViewTitle">{{productInfo.name}}</div>
				<el-row :gutter="30">
					<el-col :xs="24" :sm="14">
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
							<el-button v-if="!userId" type="warning" round class="w100 mt20" @click="goToLogin">Login to request this review</el-button>
							<el-button v-if="userId" type="warning" round class="w100 mt20">Review Request</el-button>
						</div>
					</el-col>
					<el-col :xs="24" :sm="10">
						<div class="step-con">
							<div class="item title">For this products, follow the steps as below</div>
							<div class="item"><i class="el-icon-document-checked"></i> Click the ‘Review Request’button and Waiting for
								audit</div>
							<div class="item"><i class="el-icon-shopping-cart-2"></i> Get seller confirmation and buy on Amazon within 7
								days</div>
							<div class="item"><i class="el-icon-circle-check"></i> Fill in Amazon order info and approved by the system</div>
							<div class="item"><i class="el-icon-bank-card"></i> Get the refund to your PayPal account</div>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<div v-if="contact" class="contact" v-html="contact"></div>
					</el-col>
				</el-row>
			</el-col>
			<el-col :xs="24" :sm="24">
				<div class="productViewDis" v-html="productInfo.description"></div>
			</el-col>
		</el-row>

		<el-row :gutter="30">
			<el-divider v-if="productDataOther.length>0" content-position="left" class="x-line">You May Also Like</el-divider>
			<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-for="item in productDataOther" :key="item.Id">
				<el-card class="product-card" shadow="hover" @click.native="viewDetails(item.Id)">
					<div class="scale-img">
						<img class="product-img" :src="$IMGURL+item.ProductUrl">
					</div>
					<div class="product-line"></div>
					<div class="product-card-con">
						<div class="product-title">{{item.ProductName}}</div>
						<div class="product-price">
							<div class="fz14 text-line-x info">{{item.Currency}}{{item.Price}}</div>
							<el-tag type="danger" size="mini">{{item.Discount-100}}%</el-tag>
							<div class="warning fz16">{{item.Currency}}{{item.PresentPrice}}</div>
						</div>
						<div class="product-bottom">
							<div>
								<span class="info">stock:</span>
								<span class="fz18 success">{{item.Number}}</span>
							</div>
							<div>
								<el-button type="text" class="button">View details</el-button>
							</div>
						</div>
						<div v-if="item.DiscountsTypeId=='1'">
							<el-button type="warning" size="mini" class="w100" plain>Discount</el-button>
						</div>
						<div v-if="item.DiscountsTypeId=='2'">
							<el-button type="warning" size="mini" class="w100" plain>Freebies</el-button>
						</div>
						<div v-if="item.DiscountsTypeId=='3'">
							<el-button type="warning" size="mini" class="w100" plain>Earn {{item.Integral}} Points</el-button>
						</div>
						<div v-if="item.DiscountsTypeId=='4'">
							<el-button type="warning" size="mini" class="w100" plain>Earn {{item.Commission}} Commission</el-button>
						</div>
					</div>
				</el-card>
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
		name: 'detail',
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
				contact: '',
				productDataOther: []
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
				_this.otherProductData()
			},

			// 切换图片
			changeImg(img) {
				let _this = this
				_this.productInfo.image = img
			},

			//你可能喜欢的其他商品
			otherProductData() {
				let _this = this
				let id = _this.$route.query.id
				let type = _this.productInfo.disType
				let data = _this.productData
				let dataOther = []
				for (let x in data) {
					if (data[x].DiscountsTypeId == type && data[x].Id != id)
						dataOther.push(data[x])
				}
				_this.productDataOther = dataOther.slice(0, 11)
			},

			//跳转商品详情
			viewDetails(id) {
				this.$router.push({
					path: '/detail',
					query: {
						id: id
					}
				})
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
