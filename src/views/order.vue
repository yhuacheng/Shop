<template>
	<div class="order-box">
		<div class="search-box">
			<el-form :model="searchForm" label-width="80px">
				<el-row>
					<el-col :xs='24' :md="8">
						<el-form-item label="订单号">
							<el-input v-model="searchForm.name" placeholder="Please enter the order number" class="w90"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs='24' :md="8">
						<el-form-item label="状态">
							<el-select v-model="searchForm.state" placeholder="Please select order status" class="w90">
								<el-option value="1" label="未完成"></el-option>
								<el-option value="2" label="已完成"></el-option>
								<el-option value="3" label="全部"></el-option>
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
			<el-table border :data="tableData" @selection-change="selsChange" v-loading="listLoading" style="width: 100%" id="tableData"
			 ref='tableData'>
				<el-table-column type="selection" align="center"></el-table-column>
				<el-table-column type="index" label="#" align="center"></el-table-column>
				<el-table-column prop="OrderNo" label="订单号" align="center"></el-table-column>
				<el-table-column prop="ProductUrl" label="商品图" align="center">
					<template slot-scope="scope">
						<img style="width: 40px;height: 40px;" v-if="scope.row.ProductUrl" :src="$IMGURL+scope.row.ProductUrl" />
					</template>
				</el-table-column>
				<el-table-column prop="ProductName" label="商品名称" align="center" :show-overflow-tooltip='true'></el-table-column>
				<el-table-column prop="Price" label="购买价格" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.Price}} {{scope.row.Currency}}</span> <span v-if="scope.row.Integral">+ {{scope.row.Integral}}
							Points</span>
					</template>
				</el-table-column>
				<el-table-column prop="Commission" label="佣金" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.Commission}} {{scope.row.Currency}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="AddTime" label="下单时间" align="center"></el-table-column>
				<el-table-column prop="AmzOrderNo" label="亚马逊单号" align="center"></el-table-column>
				<el-table-column prop="Comment" label="亚马逊评价" align="center" :show-overflow-tooltip='true'></el-table-column>
				<el-table-column prop="ProductUrl" label="评价截图" align="center">
					<template slot-scope="scope">
						<img style="width: 40px;height: 40px;" v-if="scope.row.ProductUrl" :src="$IMGURL+scope.row.ProductUrl" />
					</template>
				</el-table-column>
				<el-table-column prop="State" label="状态" align="center">
					<template slot-scope="scope">
						<!-- <el-tag size="small" type="info" v-if="scope.row.State==0">待填写亚马逊单号</el-tag>
						<el-tag size="small" type="warning" v-if="scope.row.State==1">待审核亚马逊单号</el-tag>
						<el-tag size="small" type="warning" v-if="scope.row.State==2">待填写亚马逊评价</el-tag>
						<el-tag size="small" type="warning" v-if="scope.row.State==3">待返款</el-tag>
						<el-tag size="small" type="success" v-if="scope.row.State==4">完成</el-tag>
						<el-tag size="small" type="danger" v-if="scope.row.State==9">已取消</el-tag> -->
						<el-tag size="small" type="info">待填写亚马逊单号</el-tag>
						<el-tag size="small" type="warning">待审核亚马逊单号</el-tag>
						<el-tag size="small" type="warning">待填写亚马逊评价</el-tag>
						<el-tag size="small" type="warning">待返款</el-tag>
						<el-tag size="small" type="success">完成</el-tag>
						<el-tag size="small" type="danger">已取消</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template v-slot="scope">
						<el-button size="small" type="primary" @click.stop="handleEdit(scope.$index, scope.row)">填写亚马逊单号</el-button>
						<el-button size="small" type="primary" @click.stop="handleEdit(scope.$index, scope.row)">填写亚马逊评价</el-button>
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
		orderList
	} from '@/api/api'

	export default {
		name: 'order',
		data() {
			return {
				pageIndex: 1,
				pageSize: 10,
				total: 0,
				listLoading: false,
				btnLoading: false,
				tableData: [{
					"OrderNo": "001",
					"ProductUrl": "/upload/3badae208c6c4b8488dd2ee8a6d45d19.jpg",
					"ProductName": "游戏手柄",
					"Price": 120.00,
					"Integral": "30",
					"Commission": 20.00,
					"Currency": "$",
					"AddTime": "2020-12-12 12:12:12",
					"AmzOrderNo": 458652412,
					"Comment": "哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈",
					"State": 999
				}],
				selsData: [],
				selectId: '',
				searchForm: {
					name: '',
					type: '0'
				}
			}
		},
		created() {
			// this.getOrderData()
		},
		methods: {
			// 获取订单列表数据
			getOrderData() {
				let _this = this
				let params = {
					Name: _this.searchForm.name,
					Buyer: '',
					pageIndex: _this.pageIndex,
					pageSize: _this.pageSize,
				}
				orderList(params).then(res => {
					_this.orderData = res.result.Entity
					_this.total = Number(res.result.TotalCount)
				}).catch((e) => {})
			},

			//查询
			searchData() {
				let _this = this
				_this.pageIndex = 1
				_this.getOrderData()
			},

			//重置
			resetSearch() {
				let _this = this
				_this.pageIndex = 1
				_this.searchForm = {
						name: '',
						type: '0',
					},
					_this.getOrderData()
			},

			//选中数据
			selsChange(selsData) {
				this.selsData = selsData
			},

			//翻页
			handleSizeChange(val) {
				let _this = this
				_this.pageSize = val
				_this.getOrderData()
			},

			//跳转
			handleCurrentChange(val) {
				let _this = this
				_this.pageIndex = val
				_this.getOrderData()
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
