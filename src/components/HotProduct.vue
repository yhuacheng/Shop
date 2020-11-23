<template>
		<div class="productBox hot-productBox">
			<el-divider v-if="productData.length>0" class="x-line">Hot Products</el-divider>
			<el-row :gutter="30">
				<el-col :span="24" v-for="item in productData" :key="item.Id">
					<el-card class="product-card" shadow="hover" @click.native="viewDetails(item.Id)">
						<el-badge :value="item.Grade">
							<div class="scale-img">
								<img class="product-img" :src="$IMGURL+item.ProductUrl">
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
								<el-button type="warning" size="mini" class="w100" plain>Add {{item.Integral}} points to redeem</el-button>
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
				pageIndex: 1,
				pageSize: 8,
				total: 0,
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
					pageIndex: _this.pageIndex,
					pageSize: _this.pageSize
				}
				productList(params).then(res => {
					_this.productData = res.result.Entity
					_this.total = Number(res.result.TotalCount)
				}).catch((e) => {})
			},

			//查询
			searchData() {
				let _this = this
				_this.pageIndex = 1
				_this.getProductData()
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
