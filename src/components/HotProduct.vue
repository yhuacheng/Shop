<template>
	<div class="productBox hot-productBox">
		<el-divider v-if="productData.length>0" class="x-line">Hot Products</el-divider>
		<el-row :gutter="30">
			<el-col :span="24" v-for="item in productData" :key="item.Id">
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
	</div>
</template>

<script>
	import {
		productList,
		typeList
	} from '@/api/api'

	export default {
		name: 'product',
		data() {
			return {
				productData: []
			}
		},
		created() {
			this.getProductData()
		},
		methods: {
			// 获取商品列表数据
			getProductData() {
				let _this = this
				let cId = localStorage.getItem('cId')
				let params = {
					CountryId: cId,
					DiscountsTypeId: 0,
					TradeName: '',
					ProductTypeId: 0,
					pageIndex: 1,
					pageSize: 100000000
				}
				productList(params).then(res => {
					let productData = res.result.Entity
					let hotProduct = productData.filter(item => item.Hot == 1)
					_this.productData = hotProduct
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
