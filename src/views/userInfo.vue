<template>
	<div class="user-box-out">
		<div class="user-box">
			<el-form :model="userData" ref="userData" :inline="true" label-width="130px">
				<el-form-item label="Email：">
					<span>{{userData.Email}}</span>
				</el-form-item>
				<el-form-item label="First Name：">
					<span>{{userData.FirstName}}</span>
				</el-form-item>
				<el-form-item label="Last Name：">
					<span>{{userData.LastName}}</span>
				</el-form-item>
				<el-form-item label="Account level：">
					<span>{{userData.BuyerGrade}}</span>
				</el-form-item>
				<el-form-item label="Points：">
					<span>{{userData.BuyerScore}}</span>
				</el-form-item>
				<el-form-item label="PaypalAccount：">
					<span>{{userData.PaypalAccount}}</span>
				</el-form-item>
				<el-form-item label="ProfileUrl：">
					<el-link :underline="false" v-if="userData.ProfileUrl" :href="userData.ProfileUrl" target="_blank" type="primary">{{userData.ProfileUrl}}</el-link>
				</el-form-item>
			</el-form>
		</div>
		<!-- 推荐产品 -->
		<div>
			<el-divider v-if="productData.length>0" content-position="center" class="x-line">You May Like</el-divider>
			<el-row :gutter="30" class="mt20">
				<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-for="item in productData" :key="item.Id">
					<el-card class="product-card" shadow="hover" @click.native="viewDetails(item.Id)">
						<el-badge :value="item.Grade">
							<div class="scale-img">
								<img class="product-img" :src="$IMGURL+item.ProductUrl">
							</div>
						</el-badge>
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
								<el-button type="warning" size="mini" class="w100" plain>Earn {{item.Commission}} commission</el-button>
							</div>
						</div>
					</el-card>
				</el-col>
			</el-row>
			<div><el-button type="warning" round class="f-r mt30" @click="getProductData">Change Next</el-button></div>
		</div>

	</div>
</template>
<script>
	import {
		userInfo,
		productList
	} from '@/api/api'
	export default {
		name: 'userInfo',
		data() {
			return {
				userData: {},
				productData: []
			}
		},
		created() {
			this.getUserData()
			this.getProductData()
		},
		methods: {
			// 获取用户数据
			getUserData() {
				let _this = this
				let params = {
					Id: sessionStorage.getItem('userId')
				}
				userInfo(params).then(res => {
					_this.userData = res.result
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
					let productData = res.result.Entity

					//随机取6个推荐商品
					let newProduct = _this.getRandomArrayElements(productData, 6)
					_this.productData = newProduct

				}).catch((e) => {})
			},

			//获取随机数方法
			getRandomArrayElements(arr, count) {
				var shuffled = arr.slice(0),
					i = arr.length,
					min = i - count,
					temp, index;
				while (i-- > min) {
					index = Math.floor((i + 1) * Math.random());
					temp = shuffled[index];
					shuffled[index] = shuffled[i];
					shuffled[i] = temp;
				}
				return shuffled.slice(min);
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
