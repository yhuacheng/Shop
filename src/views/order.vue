<template>
	<div class="order-box">
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
		<div class="mt30">
			<el-table border :data="tableData" @selection-change="selsChange" @row-click="rowClick" v-loading="listLoading"
			 style="width: 100%" id="tableData" ref='tableData'>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column type="index" label="#" align="center"></el-table-column>
				<el-table-column prop="ProductName" label="订单号" align="center" :show-overflow-tooltip='true'></el-table-column>
				<el-table-column prop="picture" label="商品图" align="center">
					<template slot-scope="scope">
						<img style="width: 40px;height: 40px;" v-if="scope.row.ProductUrl" :src="scope.row.ProductUrl" @click.stop="showImage(scope.row.ProductUrl)" />
					</template>
				</el-table-column>
				<el-table-column prop="PresentPrice" label="购买价格" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.Price}} {{scope.row.Currency}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="AddTime" label="下单时间" align="center"></el-table-column>
				<el-table-column prop="AddTime" label="亚马逊单号" align="center"></el-table-column>
				<el-table-column prop="AddTime" label="亚马逊评价" align="center"></el-table-column>
				<el-table-column prop="State" label="状态" align="center">
					<template slot-scope="scope">
						<el-tag size="small" type="danger" v-if="scope.row.State===-1">未上架</el-tag>
						<el-tag size="small" type="success" v-if="scope.row.State===1">已上架</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" width="100">
					<template v-slot="scope">
						<el-button size="small" type="primary" @click.stop="handleEdit(scope.$index, scope.row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-row v-if="total>10" class="mt30 turn-page">
				<el-col :span="24">
					<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex"
					 :page-size="10" layout="total, prev, pager, next, jumper" :total="total">
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
		name: 'order',
		data() {
			return {
				pageIndex: 1,
				pageSize: 10,
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
					path: '/details',
					query: {
						id: id
					}
				})
			}

		}
	}
</script>
