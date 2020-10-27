<template>
	<div>
		<div class="search-box">
			<el-form :model="searchForm" label-width="80px">
				<el-row>
					<el-col :xs='24' :md="8">
						<el-form-item label="Name">
							<el-input v-model="searchForm.name" placeholder="Please enter the product name" class="w90"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs='24' :md="8">
						<el-form-item label="Category">
							<el-select v-model="searchForm.type" placeholder="Please enter product category" class="w90">
								<el-option value="0" label="All category"></el-option>
								<el-option v-for="item in typeData" :key="item.Id" :label="item.EnglishName" :value="item.Id"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs='24' :md="8">
						<el-form-item style="text-align: left;">
							<el-button @click="searchData" icon="el-icon-search">Search</el-button>
							<el-button @click="resetSearch" icon="el-icon-refresh">Reset</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div class="productBox">
			<el-row :gutter="30">
				<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="3" v-for="item in productData" :key="item.Id">
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
			<el-row v-if="total>48" class="mt30 turn-page">
				<el-col :span="24">
					<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex"
					 :page-size="48" layout="total, prev, pager, next, jumper" :total="total">
					</el-pagination>
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
				pageIndex: 1,
				pageSize: 48,
				total: 0,
				productData: [],
				typeData: [],
				searchForm: {
					name: '',
					type: '0'
				}
			}
		},
		created() {
			this.getProductData()
			this.getTypeData()
		},
		methods: {
			// 获取商品列表数据
			getProductData() {
				let _this = this
				let cId = localStorage.getItem('cId')
				let type = _this.$route.params.type
				let typev = 1
				if (type == 'discount') {
					typev = 1
				}
				if (type == 'freebies') {
					typev = 2
				}
				if (type == 'points') {
					typev = 3
				}
				if (type == 'commission') {
					typev = 4
				}
				let params = {
					CountryId: cId,
					DiscountsTypeId: typev,
					TradeName: _this.searchForm.name,
					ProductTypeId: _this.searchForm.type,
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

			//重置
			resetSearch() {
				let _this = this
				_this.pageIndex = 1
				_this.searchForm = {
						name: '',
						type: '0',
					},
					_this.getProductData()
			},

			//翻页
			handleSizeChange(val) {
				let _this = this
				_this.pageSize = val
				_this.getProductData()
			},

			//跳转
			handleCurrentChange(val) {
				let _this = this
				_this.pageIndex = val
				_this.getProductData()
			},

			// 获取商品类别
			getTypeData() {
				let _this = this
				let params = {}
				typeList(params).then(res => {
					_this.typeData = res.result
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
