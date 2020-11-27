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
						<div class="productViewCon">
							<div class="productView">
								<span>Level:</span>
								<span class="danger">{{productInfo.level}}</span>
							</div>
							<div class="productView">
								<span>Stock:</span>
								<span class="success">{{productInfo.num}}</span>
							</div>
							<div class="productView">
								<span>Price :</span>
								<span class="text-line-x info">{{productInfo.price}}{{productInfo.currency}}</span>
								<el-tag type="danger" size="medium">{{productInfo.discount-100}}%</el-tag>
								<span class="warning">{{productInfo.nowPrice}}{{productInfo.currency}}</span>
								<span v-if="productInfo.disType=='3'" class="warning">+ {{productInfo.integral}} Points</span>
							</div>
							<div class="productView">
								<span v-if="productInfo.disType=='4'" class="warning">You will get {{productInfo.commission}} commission</span>
							</div>
						</div>
						<div class="productView">
							<el-alert v-if="tip" :title="tipTxt" type="error" show-icon :closable="false"></el-alert>
							<el-button v-if="!userId" :disabled="disLogin" type="warning" round class="w100 mt20" @click="goToLogin">
								Login to request this review</el-button>
							<el-button v-if="userId" :disabled="disBuy" type="warning" round class="w100 mt10" :loading="btnLoading" @click="checkBuy">
								Review Request</el-button>
						</div>
					</el-col>
					<el-col :xs="24" :sm="10">
						<div class="step-con">
							<div class="item title">For this products, follow the steps as below</div>
							<div class="item">
								<div><img src="../assets/image/process_1.png"></div>
								<div>Click the ‘Review Request’button and Waiting foraudit</div>
							</div>
							<div class="item">
								<div><img src="../assets/image/process_2.png"></div>
								<div>Get seller confirmation and buy on Amazon within 7 days</div>
							</div>
							<div class="item">
								<div><img src="../assets/image/process_3.png"></div>
								<div>Fill in Amazon order info and approved by the system</div>
							</div>
							<div class="item">
								<div><img src="../assets/image/process_4.png"></div>
								<div>Get the refund to your PayPal account</div>
							</div>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<div class="contact">
							<div class="w100" v-if="contact" v-html="contact"></div>
						</div>
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
							<el-button type="warning" size="mini" class="w100" plain>Add {{item.Integral}} points to redeem</el-button>
						</div>
						<div v-if="item.DiscountsTypeId=='4'">
							<el-button type="warning" size="mini" class="w100" plain>Earn {{item.Commission}} Commission</el-button>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>

		<!-- 购买信息弹窗 -->
		<el-dialog :title="buyModalTitle" :visible.sync="buyModal" :close-on-click-modal="false" :showClose="false" width="90%">
			<el-form :model="buyForm" :rules="rules" ref="buyForm" class="warning">
				<el-form-item label="Product Name：">
					<span>{{buyForm.productName}}</span>
				</el-form-item>
				<el-form-item label="Shop Name：">
					<span>{{buyForm.shopName}}</span>
				</el-form-item>
				<el-form-item label="Product Asin：">
					<span>{{buyForm.asin}}</span>
				</el-form-item>
				<el-form-item label="Product KeyWord：">
					<span>{{buyForm.keyWord}}</span>
				</el-form-item>
				<el-form-item label="Product Brand：">
					<span>{{buyForm.brand}}</span>
				</el-form-item>
				<el-form-item label="Product location：">
					<span>{{buyForm.place}}</span>
				</el-form-item>
				<el-form-item label="Amazon order number：" prop="orderNo">
					<el-input v-model="buyForm.orderNo"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="fillInLater" :loading="btnLoading">Fill in later</el-button>
				<el-button type="warning" @click="buySubmit" :loading="btnLoading">Submit</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		productList,
		contactList,
		userInfo,
		checkBuyRule,
		orderAdd
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
					allImage: [],
					level: ''
				},
				tip: false,
				tipTxt: '',
				disLogin: true,
				disBuy: true,
				buyModal: false,
				buyModalTitle: '',
				buyForm: {
					productName: '',
					shopName: '',
					asin: '',
					keyWord: '',
					brand: '',
					place: '',
					type: '',
					orderNo: ''
				},
				rules: {
					orderNo: {
						required: true,
						message: 'Please enter Amazon order number',
						trigger: 'blur'
					}
				},
				btnLoading: false,
				contact: '',
				productDataOther: [],
				orderId: ''
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
						_this.productInfo.level = data[x].Grade
						if (data[x].ProductUrl) {
							_this.productInfo.image = data[x].ProductUrl
						}
						if (data[x].Subgraph) {
							let all = data[x].ProductUrl + ',' + data[x].Subgraph
							let arr = all.split(",")
							_this.productInfo.allImage = arr
						}

						_this.buyForm.productName = data[x].ProductName
						_this.buyForm.shopName = data[x].Shop
						_this.buyForm.keyWord = data[x].KeyWord
						_this.buyForm.asin = data[x].ASIN
						_this.buyForm.brand = data[x].Brand
						_this.buyForm.place = data[x].Place
						_this.buyForm.type = data[x].Type
					}
				}
				_this.checkStock()
				_this.otherProductData()
			},

			// 切换图片
			changeImg(img) {
				let _this = this
				_this.productInfo.image = img
			},

			//判断是否还有库存
			checkStock() {
				let _this = this
				let stock = _this.productInfo.num
				if (stock <= 0) {
					_this.disLogin = true
					_this.tip = true
					_this.tipTxt = 'This product is sold out, so you cannot purchase this product'
				} else {
					_this.disLogin = false
					_this.tip = false
					_this.tipTxt = ''
					_this.checkLevel()
				}
			},

			//判断账号等级是否高于商品等级(越小等级越高 A>B>C>D>E>F>G)
			checkLevel() {
				let _this = this
				let uId = _this.userId
				if (uId) {
					let params = {
						Id: _this.userId
					}
					userInfo(params).then(res => {
						let productLevel = _this.productInfo.level
						let userLevel = res.result.BuyerGrade
						_this.tip = userLevel
						if (userLevel <= productLevel) {
							_this.disBuy = false
							_this.tip = false
						} else {
							_this.disBuy = true
							_this.tip = true
							_this.tipTxt = 'Your account level is ' + userLevel + ', so you cannot purchase this product'
						}
					}).catch((e) => {})
				}
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
			},

			//购买前检测是否满足购买规则
			checkBuy() {
				let _this = this
				_this.btnLoading = true
				let params = {
					UserId: sessionStorage.getItem('userId'),
					ProductManageId: _this.$route.query.id,
					Shop: _this.buyForm.shopName,
					ASIN: _this.buyForm.asin,
					Type: _this.buyForm.type
				}
				checkBuyRule(params).then(res => {
					_this.addOrder()
				}).catch((e) => {
					_this.btnLoading = false
				})
			},

			//生成订单
			addOrder() {
				let _this = this
				let params = {
					UserId: sessionStorage.getItem('userId'),
					ProductManageId: _this.$route.query.id,
					AmazonNumber: '',
					Id: 0
				}
				orderAdd(params).then(res => {
					_this.btnLoading = false
					_this.orderId = res.code
					_this.showBuy()
				}).catch((e) => {
					_this.btnLoading = false
				})
			},

			//展示购买信息窗口
			showBuy() {
				let _this = this
				_this.buyModalTitle = 'Purchase information of this product'
				_this.buyModal = true
			},

			//稍后填写订单信息
			fillInLater() {
				let _this = this
				_this.closeModal()
				_this.productDetails()
				_this.$router.push('/order')
			},

			// 购买填写单号提交
			buySubmit() {
				let _this = this
				_this.$refs.buyForm.validate((valid) => {
					if (valid) {
						_this.btnLoading = true
						let params = {
							UserId: sessionStorage.getItem('userId'),
							ProductManageId: _this.$route.query.id,
							AmazonNumber: _this.buyForm.orderNo,
							Id: _this.orderId
						}
						orderAdd(params).then(res => {
							_this.btnLoading = false
							_this.closeModal()
							_this.getProductData()
						}).catch((e) => {
							_this.btnLoading = false
						})
					}
				})
			},

			//关闭购买窗口
			closeModal() {
				let _this = this
				_this.buyModal = false
				_this.$refs['buyForm'].resetFields()
				_this.buyForm.orderNo = ''
			}

		}
	}
</script>
