<template>
	<div>
		<el-carousel :height="bannerHeight+'px'" trigger="click" v-if="bannerData.length>0">
			<el-carousel-item v-for="item in bannerData" :key="item.Id">
				<a :href="item.Link" target="_blank"><img class="banner-img" ref="bannerHeight" @load="bannerLoad"
						:src="$IMGURL+item.Image"></a>
			</el-carousel-item>
		</el-carousel>

		<el-row class="step-box hidden-sm-and-down">
			<el-col :xs="24" :sm="12" :md="4" :lg="4" :xl="4" :offset="1">
				<div class="item">
					<el-col :span="6">
						<i class="el-icon-edit-outline icon"></i>
					</el-col>
					<el-col :span="18">
						<div class="title">AUDIT</div>
						<p class="text">Click the 'Review Request' button and View information</p>
					</el-col>
				</div>
			</el-col>
			<el-col :xs="24" :sm="12" :md="2" :lg="2" :xl="2">
				<div class="icon-right">
					<i class="el-icon-d-arrow-right"></i>
				</div>
			</el-col>
			<el-col :xs="24" :sm="12" :md="4" :lg="4" :xl="4">
				<div class="item">
					<el-col :span="6">
						<i class="el-icon-shopping-cart-full icon"></i>
					</el-col>
					<el-col :span="18">
						<div class="title">CONFIRMATION</div>
						<p class="text">Buy on Amazon after obtaining product information</p>
					</el-col>
				</div>
			</el-col>
			<el-col :xs="24" :sm="12" :md="2" :lg="2" :xl="2">
				<div class="icon-right">
					<i class="el-icon-d-arrow-right"></i>
				</div>
			</el-col>
			<el-col :xs="24" :sm="12" :md="4" :lg="4" :xl="4">
				<div class="item">
					<el-col :span="6">
						<i class="el-icon-document-checked icon"></i>
					</el-col>
					<el-col :span="18">
						<div class="title">APPROVED</div>
						<p class="text">Fill in Amazon order info and approved by the system</p>
					</el-col>
				</div>
			</el-col>
			<el-col :xs="24" :sm="12" :md="2" :lg="2" :xl="2">
				<div class="icon-right">
					<i class="el-icon-d-arrow-right"></i>
				</div>
			</el-col>
			<el-col :xs="24" :sm="12" :md="4" :lg="4" :xl="4">
				<div class="item">
					<el-col :span="6">
						<i class="el-icon-bank-card icon"></i>
					</el-col>
					<el-col :span="18">
						<div class="title">CASHBACK</div>
						<p class="text">Get the refund to your PayPal account</p>
					</el-col>
				</div>
			</el-col>
		</el-row>

		<el-row :gutter="30">
			<el-col :xs="24">
				<!-- 限免商品 -->
				<div v-if="timefreebiesData.length>0" class="timefree hidden-sm-and-down">
					<div class="line-box">
						<span class="title">Free For A Limited Time Products <i
								class="el-icon-d-arrow-right"></i></span>
					</div>
					<swiper :options="swiperOption" class="myswiper">
						<swiper-slide v-for="item in timefreebiesData" :key="item.Id">
							<el-card class="product-card" shadow="hover" @click.native="viewDetails(item.Id)"
								@mouseenter.native="active=item.Id" @mouseleave.native="active=null">
								<el-badge :value="item.Grade">
									<div class="scale-img">
										<el-image class="product-img" :src="$IMGURL+item.ProductUrl" fit="contain">
										</el-image>
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
						</swiper-slide>
						<div class="swiper-pagination" slot="pagination"></div>
						<div class="swiper-button-prev" slot="button-prev"></div>
						<div class="swiper-button-next" slot="button-next"></div>
					</swiper>
				</div>
			</el-col>

			<el-col :xs="24" :md="19">
				<!-- 折扣商品 -->
				<div v-if="discountData.length>0">
					<div class="line-box">
						<span class="title">Discount Products <i class="el-icon-d-arrow-right"></i></span>
						<span class="link-more">
							<el-link :underline="false" v-if="discountData.length>=6"
								@click.stop="viewMore('discount')"> More >></el-link>
						</span>
					</div>
					<el-row :gutter="30">
						<el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4" v-for="item in discountData" :key="item.Id">
							<el-card class="product-card" shadow="hover" @click.native="viewDetails(item.Id)"
								@mouseenter.native="active1=item.Id" @mouseleave.native="active1=null">
								<el-badge :value="item.Grade">
									<div class="scale-img">
										<el-image class="product-img" :src="$IMGURL+item.ProductUrl" fit="contain">
										</el-image>
									</div>
								</el-badge>
								<div class="product-con">
									<div class="product-title">{{item.ProductName}}</div>
									<div class="price">
										<span class="old-price text-line-x">{{item.Currency}}{{item.Price}}</span>
										<span class="now-price">{{item.Currency}}{{item.PresentPrice}}</span>
									</div>
									<div class="apply-box">
										<div class="apply-btn" v-show="active1==item.Id">Apply Now</div>
									</div>
								</div>
							</el-card>
						</el-col>
					</el-row>
				</div>

				<!-- 赠品商品 -->
				<div v-if="freebiesData.length>0">
					<div class="line-box mt30">
						<span class="title">Freebies Products <i class="el-icon-d-arrow-right"></i></span>
						<span class="link-more">
							<el-link :underline="false" v-if="freebiesData.length>=6"
								@click.stop="viewMore('freebies')">More >></el-link>
						</span>
					</div>
					<el-row :gutter="30">
						<el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4" v-for="item in freebiesData" :key="item.Id">
							<el-card class="product-card" shadow="hover" @click.native="viewDetails(item.Id)"
								@mouseenter.native="active2=item.Id" @mouseleave.native="active2=null">
								<el-badge :value="item.Grade">
									<div class="scale-img">
										<el-image class="product-img" :src="$IMGURL+item.ProductUrl" fit="contain">
										</el-image>
									</div>
								</el-badge>
								<div class="product-con">
									<div class="product-title">{{item.ProductName}}</div>
									<div class="price">
										<span class="old-price text-line-x">{{item.Currency}}{{item.Price}}</span>
										<span class="now-price">{{item.Currency}}{{item.PresentPrice}}</span>
									</div>
									<div class="apply-box">
										<div class="apply-btn" v-show="active2==item.Id">Apply Now</div>
									</div>
								</div>
							</el-card>
						</el-col>
					</el-row>
				</div>

				<!-- 积分商品 -->
				<div v-if="pointsData.length>0">
					<div class="line-box mt30">
						<span class="title">Points Products <i class="el-icon-d-arrow-right"></i></span>
						<span class="link-more">
							<el-link :underline="false" v-if="pointsData.length>=6" @click.stop="viewMore('points')">
							</el-link>
						</span>
					</div>
					<el-row :gutter="30">
						<el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4" v-for="item in pointsData" :key="item.Id">
							<el-card class="product-card" shadow="hover" @click.native="viewDetails(item.Id)"
								@mouseenter.native="active3=item.Id" @mouseleave.native="active3=null">
								<el-badge :value="item.Grade">
									<div class="scale-img">
										<el-image class="product-img" :src="$IMGURL+item.ProductUrl" fit="contain">
										</el-image>
									</div>
								</el-badge>
								<div class="product-con">
									<div class="product-title">{{item.ProductName}}</div>
									<div class="price">
										<span class="old-price text-line-x">{{item.Currency}}{{item.Price}}</span>
										<span class="now-price">{{item.Currency}}{{item.PresentPrice}}</span>
									</div>
									<div class="apply-box">
										<div class="apply-btn" v-show="active3==item.Id">Apply Now</div>
									</div>
								</div>
							</el-card>
						</el-col>
					</el-row>
				</div>

				<!-- 佣金商品 -->
				<div v-if="commissionData.length>0">
					<div class="line-box mt30">
						<span class="title">Commission Products <i class="el-icon-d-arrow-right"></i></span>
						<span class="link-more">
							<el-link :underline="false" v-if="commissionData.length>=6"
								@click.stop="viewMore('commission')"></el-link>
						</span>
					</div>
					<el-row :gutter="30">
						<el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4" v-for="item in commissionData" :key="item.Id">
							<el-card class="product-card" shadow="hover" @click.native="viewDetails(item.Id)"
								@mouseenter.native="active4=item.Id" @mouseleave.native="active4=null">
								<el-badge :value="item.Grade">
									<div class="scale-img">
										<el-image class="product-img" :src="$IMGURL+item.ProductUrl" fit="contain">
										</el-image>
									</div>
								</el-badge>
								<div class="product-con">
									<div class="product-title">{{item.ProductName}}</div>
									<div class="price">
										<span class="old-price text-line-x">{{item.Currency}}{{item.Price}}</span>
										<span class="now-price">{{item.Currency}}{{item.PresentPrice}}</span>
									</div>
									<div class="apply-box">
										<div class="apply-btn" v-show="active4==item.Id">Apply Now</div>
									</div>
								</div>
							</el-card>
						</el-col>
					</el-row>
				</div>

			</el-col>

			<el-col :xs="24" :md="5">
				<HotProduct></HotProduct>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	// 引入轮播插件
	import {
		swiper,
		swiperSlide
	} from "vue-awesome-swiper";
	import "swiper/dist/css/swiper.css";

	import HotProduct from '@/components/HotProduct.vue'

	import {
		bannerList,
		productList
	} from '@/api/api'

	export default {
		name: 'home',
		data() {
			return {
				swiperOption: {
					slidesPerView: 6,
					spaceBetween: 40,
					loop: false,
					autoplay: {
						delay: 3000,
						stopOnLastSlide: false,
						disableOnInteraction: false
					},
					// 显示分页
					pagination: {
						el: ".swiper-pagination",
						clickable: true //允许分页点击跳转
					},
					// 设置点击箭头
					navigation: {
						nextEl: ".swiper-button-next",
						prevEl: ".swiper-button-prev"
					}
				},
				bannerHeight: '',
				bannerData: [],
				productData: [],
				discountData: [],
				freebiesData: [],
				pointsData: [],
				commissionData: [],
				timefreebiesData: [],
				active: null,
				active1: null,
				active2: null,
				active3: null,
				active4: null
			}
		},
		components: {
			swiper,
			swiperSlide,
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
					_this.discountData = discountData.slice(0, 6)
					_this.freebiesData = freebiesData.slice(0, 6)
					_this.pointsData = pointsData.slice(0, 6)
					_this.commissionData = commissionData.slice(0, 6)
					timefreebiesData.forEach(item => {
						if (item.DiscountsTypeId == '1') {
							item.TName = 'Discount'
						}
						if (item.DiscountsTypeId == '2') {
							item.TName = 'Freebies'
						}
						if (item.DiscountsTypeId == '3') {
							item.TName = 'Points'
						}
						if (item.DiscountsTypeId == '4') {
							item.TName = 'Commission'
						}
					})
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
			},

			//查看更多
			viewMore(s) {
				this.$router.push({
					path: '/product/' + s,
					query: {
						keywords: ''
					}
				})
			}

		}
	}
</script>
