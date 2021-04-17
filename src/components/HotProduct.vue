<template>
	<div class="productBox" v-if="productData.length>0">
		<div class="hidden-sm-and-up" style="height: 30px;"></div>
		<div class="line-box">
			<span class="title">Hot Products <i class="el-icon-d-arrow-right"></i></span>
		</div>
		<div class="hot-productBox">
			<el-row>
				<el-col :span="24" v-for="item in productData" :key="item.Id">
					<el-card class="product-card" shadow="hover" @click.native="viewDetails(item.Id)">
						<el-badge value="Hot">
							<div class="scale-img">
								<el-image class="product-img" :src="$IMGURL+item.ProductUrl" fit="contain"></el-image>
							</div>
						</el-badge>
						<div class="product-con">
							<div class="product-title">{{item.ProductName}}</div>
							<div class="product-price">
								<span class="text-line-x old-price">{{item.Currency}}{{item.Price}}</span>
								<el-tag type="info" size="mini">{{item.Discount-100}}%</el-tag>
								<span class="now-price">{{item.Currency}}{{item.PresentPrice}}</span>
							</div>
							<div class="product-bottom">
								<div>
									<span class="success">{{item.TName}}</span>
								</div>
								<div class="like-box">
									<i class="el-icon-star-on warning"></i>
									<el-badge :value="item.LikeNumber"></el-badge>
								</div>
							</div>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</div>
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
					productData.forEach(item => {
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
