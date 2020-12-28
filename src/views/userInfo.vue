<template>
	<div class="user-box-out">
		<div class="user-box">
			<el-form :model="userData" ref="userData" :inline="true" label-width="90px">
				<el-row>
					<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="5">
						<el-form-item label="Email：">
							<span>{{userData.Email}}</span>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="5">
						<el-form-item label="Name：">
							<span>{{userData.LastName}}·{{userData.FirstName}}</span>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="3">
						<el-form-item label="level：">
							<span>{{userData.BuyerGrade}}</span>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="3">
						<el-form-item label="Points：">
							<span>{{userData.BuyerScore}}</span>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="8">
						<el-form-item label="ProfileUrl：">
							<el-link :underline="false" v-if="userData.ProfileUrl" :href="userData.ProfileUrl" target="_blank" type="primary">{{userData.ProfileUrl}}</el-link>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :xs="24">
						<el-form-item label="Paypal：">
							<span>{{userData.PaypalAccount}}</span>
							<el-popover placement="bottom" width="290" trigger="click">
								<el-table :data="paypalData" :show-header="false">
									<el-table-column width="290" property="HistoryPaypal" label="paypal" center></el-table-column>
								</el-table>
								<el-button class="ml10" slot="reference" type="primary" size="mini" plain>history paypal</el-button>
							</el-popover>
							<el-button class="ml10" type="warning" size="mini" plain @click="ppEdit">edit paypal</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>

		<!-- 推荐产品 -->
		<div v-if="productData.length>0">
			<el-divider content-position="left" class="x-line">You May Like</el-divider>
			<el-row :gutter="30" class="mt20">
				<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-for="item in productData" :key="item.Id">
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
			<div>
				<el-button type="warning" round class="f-r mt30" @click="getProductData">Change Next</el-button>
			</div>
		</div>

	</div>
</template>
<script>
	import {
		userInfo,
		productList,
		paypalEdit
	} from '@/api/api'
	export default {
		name: 'userInfo',
		data() {
			return {
				userData: {},
				productData: [],
				paypalData: []
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
					let pp = res.result.HistoryPaypal
					if (pp) {
						_this.paypalData = pp.split(',')
					}
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
			},

			//修改PP账号
			ppEdit() {
				let _this = this
				_this.$prompt('Please enter your new paypal account', 'Message', {
					confirmButtonText: 'Submit',
					cancelButtonText: 'cancel',
					inputPattern: /\S/,
					inputErrorMessage: 'Paypal is required'
				}).then(({
					value
				}) => {
					let params = {
						Id: sessionStorage.getItem('userId'),
						PaypalAccount: value
					}
					paypalEdit(params).then(res => {
						_this.getUserData()
					}).catch((e) => {})
				}).catch(() => {})
			}

		}
	}
</script>
