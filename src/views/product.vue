<template>
	<div>
		<el-row :gutter="30">
			<el-col :xs="24" :md="18">
				<div class="search-box">
					<el-form :model="searchForm" label-width="80px">
						<el-row>
							<el-col :xs='24' :md="6">
								<el-form-item label="Type">
									<el-select v-model="searchForm.pType" placeholder="Please select product type"
										class="w90">
										<el-option label="All" value="all"></el-option>
										<el-option label="Discount" value="discount"></el-option>
										<el-option label="Freebies" value="freebies"></el-option>
										<el-option label="Points" value="points"></el-option>
										<el-option label="Commission" value="commission"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xs='24' :md="6">
								<el-form-item label="Name">
									<el-input v-model="searchForm.name" placeholder="Please enter the product name"
										class="w90"></el-input>
								</el-form-item>
							</el-col>
							<el-col :xs='24' :md="6">
								<el-form-item label="Category">
									<el-select v-model="searchForm.type" placeholder="Please select product category"
										class="w90">
										<el-option value="0" label="All category"></el-option>
										<el-option v-for="item in typeData" :key="item.Id" :label="item.EnglishName"
											:value="item.Id"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xs='24' :md="6">
								<el-form-item>
									<el-button @click="searchData" icon="el-icon-search">Search</el-button>
									<el-button @click="resetSearch" icon="el-icon-refresh">Reset</el-button>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<div class="productBox">
					<el-row :gutter="30">
						<el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4" v-for="item in productData" :key="item.Id">
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
						</el-col>
					</el-row>
					<el-row v-if="total>30" class="mt30 turn-page">
						<el-col :span="24">
							<el-pagination background @size-change="handleSizeChange"
								@current-change="handleCurrentChange" :current-page="pageIndex" :page-size="48"
								layout="total, prev, pager, next, jumper" :total="total">
							</el-pagination>
						</el-col>
					</el-row>
				</div>
			</el-col>

			<el-col :xs="24" :md="6" class="product-list">
				<HotProduct></HotProduct>
			</el-col>

		</el-row>

	</div>
</template>

<script>
	import HotProduct from '@/components/HotProduct.vue'

	import {
		productList,
		typeList
	} from '@/api/api'

	export default {
		name: 'product',
		data() {
			return {
				pageIndex: 1,
				pageSize: 30,
				total: 0,
				productData: [],
				typeData: [],
				searchForm: {
					pType: this.$route.params.type,
					name: this.$route.query.keywords,
					type: '0'
				},
				active: null
			}
		},
		components: {
			HotProduct
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
				let type = _this.searchForm.pType
				let typev = ''
				if (type == 'all') {
					typev = 0
				}
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
				let sName = _this.searchForm.name
				if (sName == undefined) {
					sName = ''
				}
				let params = {
					CountryId: cId,
					DiscountsTypeId: typev,
					TradeName: sName,
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
						pType: 'all',
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
