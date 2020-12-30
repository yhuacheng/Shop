<template>
	<div>
		<el-carousel :height="bannerHeight+'px'" trigger="click" v-if="bannerData.length>0">
			<el-carousel-item v-for="item in bannerData" :key="item.Id">
				<a :href="item.Link" target="_blank"><img class="banner-img" ref="bannerHeight" @load="bannerLoad" :src="$IMGURL+item.Image"></a>
			</el-carousel-item>
		</el-carousel>

		<el-row class="step-box">
			<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
				<div class="item">
					<div class="title">
						<div><img src="../assets/image/process_1.png"></div>
						<div>AUDIT >>></div>
					</div>
					<div class="text">Click the 'Review Request' button and Waiting for audit</div>
				</div>
			</el-col>
			<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
				<div class="item">
					<div class="title">
						<div><img src="../assets/image/process_2.png"></div>
						<div>CONFIRMATION >>></div>
					</div>
					<div class="text">Get seller confirmation and buy on Amazon within 7 days</div>
				</div>
			</el-col>
			<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
				<div class="item">
					<div class="title">
						<div><img src="../assets/image/process_3.png"></div>
						<div>APPROVED >>></div>
					</div>
					<div class="text">Fill in Amazon order info and approved by the system</div>
				</div>
			</el-col>
			<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
				<div class="item">
					<div class="title">
						<div><img src="../assets/image/process_4.png"></div>
						<div>CASHBACK</div>
					</div>
					<div class="text">Get the refund to your PayPal account</div>
				</div>
			</el-col>
		</el-row>

		<el-row :gutter="40">

			<el-col :xs="24" :md="18">

				<!-- 限免商品 -->
				<div class="hot-productBox" v-if="timefreebiesData.length>0">
					<el-divider content-position="left" class="x-line">Free For A Limited Time Products</el-divider>
					<el-carousel trigger="click" type="card" indicator-position="none" height="210px" class="timefree">
						<el-carousel-item v-for="item in timefreebiesData" :key="item.Id">
							<el-row class="timefree-item">
								<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
									<el-card class="product-card" shadow="hover" @click.native="viewDetails(item.Id)">
										<el-badge :value="item.Grade">
											<div class="scale-img">
												<el-image class="product-img" :src="$IMGURL+item.ProductUrl" fit="contain"></el-image>
											</div>
										</el-badge>
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
												<el-button type="warning" size="mini" class="w100" plain>Need +{{item.Integral}} points to redeem</el-button>
											</div>
											<div v-if="item.DiscountsTypeId=='4'">
												<el-button type="warning" size="mini" class="w100" plain>Earn {{item.Commission}} commission</el-button>
											</div>
										</div>
									</el-card>
								</el-col>
							</el-row>
						</el-carousel-item>
					</el-carousel>
				</div>

				<!-- 折扣商品 -->
				<div v-if="discountData.length>0">
					<el-divider content-position="left" class="x-line">Discount Products</el-divider>
					<el-row :gutter="30">
						<el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4" v-for="item in discountData" :key="item.Id">
							<el-card class="product-card" shadow="hover" @click.native="viewDetails(item.Id)">
								<el-badge :value="item.Grade">
									<div class="scale-img">
										<el-image class="product-img" :src="$IMGURL+item.ProductUrl" fit="contain"></el-image>
									</div>
								</el-badge>
								<div class="product-title">{{item.ProductName}}</div>
								<div class="product-line"></div>
								<div class="product-card-con">
									<div class="infor">
										<div><span class="info">stock:</span><span class="fz18 orange">{{item.Number}}</span></div>
										<div>
											<el-tag type="danger" size="mini">{{item.Discount-100}}%</el-tag>
										</div>
									</div>
									<div class="product-price">
										<div class="fz16 now-price">{{item.Currency}}{{item.PresentPrice}}</div>
										<div class="fz14 text-line-x info old-price">{{item.Currency}}{{item.Price}}</div>
									</div>
								</div>
							</el-card>
						</el-col>
					</el-row>
				</div>

				<!-- 赠品商品 -->
				<div v-if="freebiesData.length>0">
					<el-divider content-position="left" class="x-line">Freebies Products</el-divider>
					<el-row :gutter="30">
						<el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4" v-for="item in freebiesData" :key="item.Id">
							<el-card class="product-card" shadow="hover" @click.native="viewDetails(item.Id)">
								<el-badge :value="item.Grade">
									<div class="scale-img">
										<el-image class="product-img" :src="$IMGURL+item.ProductUrl" fit="contain"></el-image>
									</div>
								</el-badge>
								<div class="product-title">{{item.ProductName}}</div>
								<div class="product-line"></div>
								<div class="product-card-con">
									<div class="infor">
										<div><span class="info">stock:</span><span class="fz18 orange">{{item.Number}}</span></div>
										<div>
											<el-tag type="danger" size="mini">{{item.Discount-100}}%</el-tag>
										</div>
									</div>
									<div class="product-price">
										<div class="fz16 now-price">{{item.Currency}}{{item.PresentPrice}}</div>
										<div class="fz14 text-line-x info old-price">{{item.Currency}}{{item.Price}}</div>
									</div>
								</div>
							</el-card>
						</el-col>
					</el-row>
				</div>

				<!-- 积分商品 -->
				<div v-if="pointsData.length>0">
					<el-divider content-position="left" class="x-line">Points For Products</el-divider>
					<el-row :gutter="30">
						<el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4" v-for="item in pointsData" :key="item.Id">
							<el-card class="product-card" shadow="hover" @click.native="viewDetails(item.Id)">
								<el-badge :value="item.Grade">
									<div class="scale-img">
										<el-image class="product-img" :src="$IMGURL+item.ProductUrl" fit="contain"></el-image>
									</div>
								</el-badge>
								<div class="product-title">{{item.ProductName}}</div>
								<div class="product-line"></div>
								<div class="product-card-con">
									<div class="infor">
										<div><span class="info">stock:</span><span class="fz18 orange">{{item.Number}}</span></div>
										<div>
											<el-tag type="danger" size="mini">{{item.Discount-100}}%</el-tag>
										</div>
									</div>
									<div class="product-price">
										<div class="fz16 now-price">{{item.Currency}}{{item.PresentPrice}}</div>
										<div class="fz14 text-line-x info old-price">{{item.Currency}}{{item.Price}}</div>
									</div>
								</div>
							</el-card>
						</el-col>
					</el-row>
				</div>

				<!-- 佣金商品 -->
				<div v-if="commissionData.length>0">
					<el-divider content-position="left" class="x-line">Earn Commission Products</el-divider>
					<el-row :gutter="30">
						<el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4" v-for="item in commissionData" :key="item.Id">
							<el-card class="product-card" shadow="hover" @click.native="viewDetails(item.Id)">
								<el-badge :value="item.Grade">
									<div class="scale-img">
										<el-image class="product-img" :src="$IMGURL+item.ProductUrl" fit="contain"></el-image>
									</div>
								</el-badge>
								<div class="product-title">{{item.ProductName}}</div>
								<div class="product-line"></div>
								<div class="product-card-con">
									<div class="infor">
										<div><span class="info">stock:</span><span class="fz18 orange">{{item.Number}}</span></div>
										<div>
											<el-tag type="danger" size="mini">{{item.Discount-100}}%</el-tag>
										</div>
									</div>
									<div class="product-price">
										<div class="fz16 now-price">{{item.Currency}}{{item.PresentPrice}}</div>
										<div class="fz14 text-line-x info old-price">{{item.Currency}}{{item.Price}}</div>
									</div>
								</div>
							</el-card>
						</el-col>
					</el-row>
				</div>

			</el-col>

			<el-col :xs="24" :md="6">
				<HotProduct></HotProduct>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import HotProduct from '@/components/HotProduct.vue'

	import {
		bannerList,
		productList
	} from '@/api/api'

	export default {
		name: 'home',
		data() {
			return {
				bannerHeight: '',
				bannerData: [],
				productData: [],
				discountData: [],
				freebiesData: [],
				pointsData: [],
				commissionData: [],
				timefreebiesData: []
			}
		},
		components: {
			HotProduct
		},
		created() {
			this.getBannerData()
			this.getProductData()
		},
		mounted() {
			// 处理banner图片高度自适应问题
			let _this = this
			_this.bannerLoad()
			window.addEventListener('resize', () => {
				_this.bannerHeight = document.body.clientWidth * 1 / 4
			}, false)
		},
		methods: {
			// 处理banner图片高度自适应问题
			bannerLoad() {
				this.$nextTick(() => {
					this.bannerHeight = document.body.clientWidth * 1 / 4
				})
			},

			//获取banner
			getBannerData() {
				let _this = this
				let cId = localStorage.getItem('cId')
				let params = {
					CountryId: cId
				}
				bannerList(params).then(res => {
					_this.bannerData = res.result
					_this.bannerLoad()
				}).catch((e) => {})
			},

			// 获取商品列表数据
			getProductData() {
				let _this = this
				let cId = localStorage.getItem('cId')
				let params = {
					countryId: cId,
					DiscountsTypeId: 0,
					productTypeId: 0,
					TradeName: '',
					pageIndex: 1,
					pageSize: 100000000
				}
				productList(params).then(res => {
					let data = res.result.Entity
					_this.productData = data
					let discountData = data.filter(item => item.DiscountsTypeId == "1")
					let freebiesData = data.filter(item => item.DiscountsTypeId == "2")
					let pointsData = data.filter(item => item.DiscountsTypeId == "3")
					let commissionData = data.filter(item => item.DiscountsTypeId == "4")
					let timefreebiesData = data.filter(item => item.Free == "1")
					_this.discountData = discountData.slice(0, 30)
					_this.freebiesData = freebiesData.slice(0, 30)
					_this.pointsData = pointsData.slice(0, 30)
					_this.commissionData = commissionData.slice(0, 30)
					_this.timefreebiesData = timefreebiesData
				}).catch((e) => {})
			},

			//查看商品详情
			viewDetails(id) {
				this.$router.push({
					path: '/detail',
					query: {
						id: id
					}
				})
			}

		}
	}
</script>
