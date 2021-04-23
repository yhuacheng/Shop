<template>
	<div class="productView-box">
		<el-row :gutter="60">
			<el-col :xs="24" :sm="10">
				<el-image class="productImage big-img" :src="$IMGURL+productInfo.image" fit="contain"></el-image>
				<ul class="product-imgs">
					<li v-for="item in productInfo.allImage" @click="changeImg(item)">
						<el-image class="productImage small-img" :src="$IMGURL+item" fit="contain"></el-image>
					</li>
				</ul>
			</el-col>
			<el-col :xs="24" :sm="14">
				<div class="productViewTitle">{{productInfo.name}}</div>
				<div class="info view-tag">
					<span><i class="el-icon-price-tag"></i> {{productInfo.typeName}}</span>
					<span class="product-card" style="margin-top: 0;" @click="clickLike">
						<span class="like-box">
							<i class="el-icon-thumb fz16" style="position: relative;top: 0px;"></i>
							<span v-if="likeState==1">Click to unlike it </span>
							<span v-if="likeState==-1">Click to like it </span>
							<i v-if="likeState==1" class="el-icon-star-on warning"></i>
							<i v-if="likeState==-1" class="el-icon-star-on info"></i>
							<el-badge :value="productInfo.likeNum"></el-badge>
						</span>
					</span>
				</div>
				<el-row :gutter="80">
					<el-col :xs="24" :sm="12">
						<div class="productViewCon">
							<div class="productView">
								<span>Level:</span>
								<span class="danger">{{productInfo.level}}</span>
							</div>
							<div>
								<div class="productView">
									<span>Stock:</span>
									<span class="success">{{productInfo.num}}</span>
								</div>
								<div class="productView">
									<span class="text-line-x info">{{productInfo.currency}}{{productInfo.price}}</span>
									<el-tag type="danger" size="small">{{productInfo.discount-100}}%</el-tag>
									<span	class="deteil-now-price">{{productInfo.currency}}{{productInfo.nowPrice}}</span>
									<span v-if="productInfo.disType=='3'" class="warning">+ {{productInfo.integral}}
										Points</span>
								</div>
							</div>
							<div class="productView">
								<span v-if="productInfo.disType=='4'" class="warning">You will get
									{{productInfo.commission}} commission</span>
							</div>
						</div>
						<div class="productViewCon" v-if="colorData.length>0 || sizeData.length>0">
							<el-form label-width="50px" size="small" class="mt10">
								<el-form-item label="Color:" v-if="colorData.length>0">
									<el-radio-group v-model="color" size="mini" @change="selectColor">
										<el-radio border v-for="(item,index) in colorData" :label="item.id">
											{{item.name}}
										</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="Size:" v-if="sizeData.length>0">
									<el-radio-group v-model="size" size="mini">
										<el-radio border v-for="(item,index) in sizeData" :label="item.id">{{item.name}}
										</el-radio>
									</el-radio-group>
								</el-form-item>
							</el-form>
						</div>
						<div class="productView">
							<el-alert v-if="tip" :title="tipTxt" type="error" show-icon :closable="false"></el-alert>
							<el-button v-if="!userId" :disabled="disLogin" type="warning" class="w100 mt20"
								@click="goToLogin">
								Login to request this review</el-button>
							<el-button v-if="userId" :disabled="disBuy" type="warning" class="w100 mt10"
								:loading="btnLoading" @click="checkBuy">
								Review Request</el-button>
						</div>
						<el-alert v-if="productInfo.remark && productInfo.remark!='null'" :title="productInfo.remark"
							type="warning" show-icon :closable="false">
						</el-alert>
						<div class="contact-icon">
							<div><a href="https://www.facebook.com/accpower" target="_blank"><img class="icon-img"
										src="../assets/image/f-share-facebook.png" /></a></div>
							<div><a href="https://twitter.com/Francesouth2" target="_blank"><img class="icon-img"
										src="../assets/image/f-share-twitter.png" /></a></div>
							<div><a href="mailto:robertwells4625@gmail.com"><img class="icon-img"
										src="../assets/image/f-share-email.png" /></a></div>
						</div>
					</el-col>
					<el-col :xs="24" :sm="12">
						<div class="step-con">
							<div class="item title">For this products, follow the steps as below</div>
							<div class="item">
								<div><img src="../assets/image/process_1.png"></div>
								<div>Click the 'Review Request' button and View information</div>
							</div>
							<div class="item">
								<div><img src="../assets/image/process_2.png"></div>
								<div>Buy on Amazon after obtaining product information</div>
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

		<el-row :gutter="30" class="mt30">
			<div class="line-box" v-if="productDataOther.length>0">
				<span class="title">You May Also Like <i class="el-icon-d-arrow-right"></i></span>
			</div>
			<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-for="item in productDataOther" :key="item.Id">
				<el-card class="product-card" shadow="hover" @click.native="viewDetails(item.Id)"
					@mouseenter.native="active=item.Id" @mouseleave.native="active=null">
					<el-badge :value="item.Grade">
						<div class="scale-img">
							<el-image class="product-img" :src="$IMGURL+item.ProductUrl" fit="contain"></el-image>
						</div>
					</el-badge>
					<div class="product-con">
						<div class="product-title">{{item.ProductName}}</div>
						<div class="price">
							<span class="old-price text-line-x">{{item.Currency}}{{item.Price}}</span>
							<span class="now-price">{{item.Currency}}{{item.PresentPrice}}</span>
						</div>
						<div class="apply-box">
							<div class="apply-btn" v-show="active==item.Id">Apply Now</div>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>

		<!-- 购买信息弹窗 -->
		<el-dialog :title="buyModalTitle" :visible.sync="buyModal" :close-on-click-modal="false" :showClose="false"
			width="90%">
			<el-form :model="buyForm" :rules="rules" ref="buyForm" class="warning">
				<el-form-item label="Product Name：">
					<span>{{buyForm.productName}}</span>
				</el-form-item>
				<el-form-item label="Shop Name：">
					<span>{{buyForm.shopName}}</span>
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
			<div v-if="contact">
				<p class="warning">If you encounter problems, you can contact us through the following ways：</p>
				<div class="w100" v-html="contact"></div>
			</div>
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
		formatList,
		contactList,
		userInfo,
		checkBuyRule,
		orderAdd,
		countryList,
		likeOrDislike,
		likeState
	} from '@/api/api'

	export default {
		name: 'detail',
		data() {
			return {
				active: null,
				userId: sessionStorage.getItem('userId'),
				productData: [],
				formatData: [],
				colorData: [],
				sizeData: [],
				productInfo: {
					id: '',
					likeNum: 0,
					remark: '',
					name: '',
					typeName: '',
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
					level: '',
					formatId: 0
				},
				rate: '',
				tip: false,
				tipTxt: '',
				points: '',
				newPrice: '',
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
				orderId: '',
				color: '',
				size: '',
				likeState: -1, //（1点赞 -1未点赞）
				likeId: '' //点赞表Id
			}
		},
		computed: {
			//获取库存原价折扣现价
			pData: function() {
				let _this = this
				let data = _this.formatData
				let colorData = _this.colorData
				let sizeData = _this.sizeData
				let colorId = _this.color
				let sizeId = _this.size
				let newData = ''
				//如果只有颜色没有尺码
				if (colorData.length > 0 && sizeData.length == 0) {
					newData = data.filter(item => item.ProductColorId == colorId)
				}
				//如果只有尺码没有颜色
				if (sizeData.length > 0 && colorData.length == 0) {
					newData = data.filter(item => item.ProductSizeId == sizeId)
				}
				//如果有颜色有尺码
				if (colorData.length > 0 && sizeData.length > 0) {
					newData = data.filter(item => item.ProductColorId == colorId && item.ProductSizeId == sizeId)
				}
				return newData
			}
		},
		created() {
			this.getProductData()
			this.getFormatData()
			this.getContactData()
			this.getRate()
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
						_this.productInfo.id = data[x].Id
						_this.productInfo.likeNum = data[x].LikeNumber
						_this.productInfo.remark = data[x].Remarks
						_this.productInfo.name = data[x].ProductName
						_this.productInfo.typeName = data[x].EnglishName
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
				_this.getLikeState()
			},

			// 获取商品规格信息
			getFormatData() {
				let _this = this
				let id = _this.$route.query.id
				let params = {
					ProductManageId: id
				}
				formatList(params).then(res => {
					let data = res.result
					_this.formatData = data
					//获取颜色数据，尺码数据
					let color = []
					let size = []
					for (let x in data) {
						color.push({
							id: data[x].ProductColorId,
							name: data[x].Color,
							img: data[x].Picture
						})
						size.push({
							id: data[x].ProductSizeId,
							name: data[x].Size
						})
					}
					//颜色去重
					let colorArr = color.filter((x, index, self) => {
						let colorids = []
						color.forEach((item, i) => {
							colorids.push(item.id)
						})
						return colorids.indexOf(x.id) === index
					})
					_this.colorData = colorArr
					//尺码去重
					let sizeArr = size.filter((x, index, self) => {
						let sizeids = []
						size.forEach((item, i) => {
							sizeids.push(item.id)
						})
						return sizeids.indexOf(x.id) === index
					})
					_this.sizeData = sizeArr

				}).catch((e) => {})
			},

			//如果有规格替换商品的库存原价折扣现价
			pInfo() {
				let _this = this
				if (_this.pData.length > 0) {
					_this.productInfo.num = _this.pData[0].SizeColorNumber
					_this.productInfo.price = _this.pData[0].SizeColorPrice
					_this.productInfo.discount = _this.pData[0].SizeColorDiscount
					_this.productInfo.nowPrice = _this.pData[0].SizeColorPresentPrice
					_this.productInfo.formatId = _this.pData[0].Id
					_this.buyForm.asin = _this.pData[0].SizeColorASIN
					_this.checkStock()
				}
			},

			//选择颜色
			selectColor() {
				let _this = this
				_this.size = ''
				let colorData = _this.colorData
				let id = _this.color
				//获取图片地址
				let url = ''
				for (let x in colorData) {
					if (id == colorData[x].id) {
						url = colorData[x].img
					}
				}
				if (url) {
					let urlArr = url.split(',')
					_this.productInfo.allImage = url.split(',')
					_this.productInfo.image = urlArr[0]
				}
				//获取该颜色下的尺码
				let sizeArry = []
				let data = _this.formatData
				for (let y in data) {
					if (id == data[y].ProductColorId) {
						sizeArry.push({
							id: data[y].ProductSizeId,
							name: data[y].Size
						})
					}
				}
				_this.sizeData = sizeArry
				_this.pInfo()
			},

			//选择尺码
			selectSize() {
				let _this = this
				let sizeData = _this.sizeData
				let id = _this.size
				//获取该尺码下的颜色
				let colorArry = []
				let data = _this.formatData
				for (let z in data) {
					if (id == data[z].ProductSizeId) {
						colorArry.push({
							id: data[z].ProductColorId,
							name: data[z].Color,
							img: data[z].Picture
						})
					} else {
						colorArry.push({
							id: data[z].ProductColorId,
							name: data[z].Color,
							img: data[z].Picture
						})
					}
				}
				_this.colorData = colorArry
				_this.pInfo()
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
					_this.disBuy = true
					_this.tip = true
					_this.tipTxt = 'This product is sold out, so you cannot purchase this product'
				} else {
					_this.disLogin = false
					_this.disBuy = false
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
						_this.points = res.result.BuyerScore
						_this.tip = userLevel
						if (userLevel > productLevel) {
							_this.disBuy = true
							_this.tip = true
							_this.tipTxt = 'Your account level is ' + userLevel +
								', so you cannot purchase this product'
						} else {
							_this.disBuy = false
							_this.tip = false
							_this.tipTxt = ''
							_this.checkPoints()
						}
					}).catch((e) => {})
				}
			},

			//判断会员积分是否足够，积分不够的部分根据汇率用钱抵扣
			checkPoints() {
				let _this = this
				let integral = _this.productInfo.integral //商品所需积分
				let points = _this.points //会员剩余积分
				let rate = _this.rate //货币汇率
				let req = integral - points //积分差值
				//如果会员剩余积分不够
				if (req > 0) {
					//差值积分转换为当前的币种金额（1积分=1RMB）
					let cha = req / rate
					//差值金额附加到商品价格上
					let newPrice = (Number(_this.productInfo.nowPrice) + Number(cha)).toFixed(2)
					_this.newPrice = newPrice
					_this.tip = true
					_this.tipTxt = "You only have " + points + " points now，if you want this product，you will use " +
						newPrice + _this
						.productInfo.currency + " + " + points + " ponits to buy，are you sure？"
				} else {
					_this.tip = false
					_this.tipTxt = ''
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
				if (dataOther.length <= 6) {
					_this.productDataOther = dataOther
				} else {
					//如果商品大于6个则随机取出6个不重复的商品
					let result = [];
					for (let i = 0; i < 6; i++) {
						let ran = Math.floor(Math.random() * (dataOther.length - i));
						result.push(dataOther[ran]);
						dataOther[ran] = dataOther[dataOther.length - i - 1];
					}
					_this.productDataOther = result
				}
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

			// 获取国家汇率数据
			getRate() {
				let _this = this
				let cId = localStorage.getItem('cId')
				let params = {}
				countryList(params).then(res => {
					let data = res.result
					for (let x in data) {
						if (data[x].Id == cId) {
							_this.rate = data[x].Rate
						}
					}
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
				if (_this.colorData.length > 0 && !_this.color) {
					this.$message.error('please choose a color')
					return false
				}
				if (_this.sizeData.length > 0 && !_this.size) {
					this.$message.error('please choose a size')
					return false;
				}
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
				let price = _this.productInfo.nowPrice
				let points = _this.productInfo.integral
				if (_this.newPrice) {
					price = _this.newPrice
					points = _this.points
				}
				let params = {
					UserId: sessionStorage.getItem('userId'),
					ProductManageId: _this.$route.query.id,
					AmazonNumber: '',
					Id: 0,
					Price: price,
					Points: points,
					ProductManageSizeColorId: _this.productInfo.formatId
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
				_this.$router.push('/order')
			},

			// 填写单号提交
			buySubmit() {
				let _this = this
				_this.$refs.buyForm.validate((valid) => {
					if (valid) {
						_this.btnLoading = true
						let price = _this.productInfo.nowPrice
						let points = _this.productInfo.integral
						if (_this.newPrice) {
							price = _this.newPrice
							points = _this.points
						}
						let params = {
							UserId: sessionStorage.getItem('userId'),
							ProductManageId: _this.$route.query.id,
							AmazonNumber: _this.buyForm.orderNo,
							Id: _this.orderId,
							Price: price,
							Points: points,
							ProductManageSizeColorId: _this.productInfo.formatId
						}
						orderAdd(params).then(res => {
							_this.btnLoading = false
							_this.closeModal()
							_this.$router.push('/order')
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
			},

			//个人点赞情况
			getLikeState() {
				let _this = this
				let userId = sessionStorage.getItem('userId')
				let params = {
					ProductMangeId: _this.productInfo.id,
					BuyerId: userId ? userId : 0
				}
				likeState(params).then(res => {
					_this.likeState = res.result.State ? res.result.State : -1
					_this.likeId = res.result.Id
				}).catch((e) => {})
			},

			//点赞
			clickLike() {
				let _this = this
				let userId = sessionStorage.getItem('userId')
				if (!userId) {
					_this.goToLogin()
				} else {
					let v = ''
					let id = ''
					if (_this.likeState == 1) {
						v = -1
						id = _this.likeId
					} else {
						v = 1
						id = _this.productInfo.id
					}
					let params = {
						Type: v,
						BuyerId: userId,
						Id: id
					}
					likeOrDislike(params).then(res => {
						_this.getProductData()
						_this.getLikeState()
					}).catch((e) => {})
				}
			}

		}
	}
</script>
