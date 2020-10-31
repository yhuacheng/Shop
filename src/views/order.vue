<template>
	<div class="order-box">
		<div class="search-box">
			<el-form :model="searchForm" label-width="80px">
				<el-row>
					<el-col :xs='24' :md="8">
						<el-form-item label="Number">
							<el-input v-model="searchForm.No" placeholder="Please enter the Amazon order number" class="w90"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs='24' :md="8">
						<el-form-item label="Status">
							<el-select v-model="searchForm.state" placeholder="Please select order status" class="w90">
								<el-option value="0" label="All"></el-option>
								<el-option value="-1" label="Waiting to fill in the Amazon order number"></el-option>
								<el-option value="1" label="Waiting for review of Amazon order number"></el-option>
								<el-option value="2" label="Waiting to fill in the Amazon order review"></el-option>
								<el-option value="3" label="Waiting for rebate"></el-option>
								<el-option value="4" label="Finished"></el-option>
								<el-option value="5" label="Fail"></el-option>
								<el-option value="-2" label="Cancelled"></el-option>
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
				<el-table-column type="index" label="#" align="center"></el-table-column>
				<el-table-column prop="ProductUrl" label="Product Image" align="center">
					<template slot-scope="scope">
						<img style="width: 40px;height: 40px;" v-if="scope.row.ProductUrl" :src="$IMGURL+scope.row.ProductUrl"
						 @click.stop="showImage($IMGURL+scope.row.CommontImage)" />
					</template>
				</el-table-column>
				<el-table-column prop="ProductName" label="Product Name" align="center" :show-overflow-tooltip='true'></el-table-column>
				<el-table-column prop="Price" label="Price" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.PresentPrice}} {{scope.row.Currency}}</span>
						<span v-if="scope.row.Integral>0">+{{scope.row.Integral}} Points</span>
					</template>
				</el-table-column>
				<el-table-column prop="Commission" label="Commission" align="center">
					<template slot-scope="scope">
						<span>{{scope.row.Commission}} {{scope.row.Currency}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="AddTime" label="Order Time" align="center"></el-table-column>
				<el-table-column prop="AmazonNumber" label="Amazon Number" align="center"></el-table-column>
				<el-table-column prop="CommontLink" label="Review link" align="center" :show-overflow-tooltip='true'></el-table-column>
				<el-table-column prop="CommontImage" label="Review Image" align="center">
					<template slot-scope="scope">
						<img style="width: 40px;height: 40px;" v-if="scope.row.CommontImage" :src="scope.row.CommontImage" @click.stop="showImage(scope.row.CommontImage)" />
					</template>
				</el-table-column>
				<el-table-column prop="State" label="Order Status" align="center" width="280">
					<template slot-scope="scope">
						<el-tag size="small" type="info" v-if="scope.row.State==-1">Waiting to fill in the Amazon order number</el-tag>
						<el-tag size="small" type="warning" v-if="scope.row.State==1">Waiting for review of Amazon order number</el-tag>
						<el-tag size="small" type="warning" v-if="scope.row.State==2">Waiting to fill in the Amazon order review</el-tag>
						<el-tag size="small" type="warning" v-if="scope.row.State==3">Waiting for rebate</el-tag>
						<el-tag size="small" type="success" v-if="scope.row.State==4">Finished</el-tag>
						<el-tag size="small" type="danger" v-if="scope.row.State==5">Fail</el-tag>
						<el-tag size="small" type="danger" v-if="scope.row.State==-2">Cancelled</el-tag>
						<div class="danger" v-if="scope.row.state==5 && scope.row.Remark">{{Remark}}</div>
					</template>
				</el-table-column>
				<el-table-column label="Function Button" align="center" width="260">
					<template v-slot="scope">
						<el-button size="small" type="primary" v-if="scope.row.State==-1" @click="handleBuy(scope.$index, scope.row)">Fill
							in the Amazon order number</el-button>
						<el-button size="small" type="warning" v-if="scope.row.State==2" @click="handleReview(scope.$index, scope.row)">Fill
							in the Amazon order review</el-button>
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

		<!-- 购买信息弹窗 -->
		<el-dialog :title="buyModalTitle" :visible.sync="buyModal" :close-on-click-modal="false" :before-close="closeBuyModal"
		 width="80%">
			<el-form :model="infoForm" ref="infoForm" class="warning" size="small">
				<el-form-item label="Product Name：">
					<span>{{infoForm.productName}}</span>
				</el-form-item>
				<el-form-item label="Shop Name：">
					<span>{{infoForm.shopName}}</span>
				</el-form-item>
				<el-form-item label="Product Asin：">
					<span>{{infoForm.asin}}</span>
				</el-form-item>
				<el-form-item label="Product KeyWord：">
					<span>{{infoForm.keyWord}}</span>
				</el-form-item>
				<el-form-item label="Product Brand：">
					<span>{{infoForm.brand}}</span>
				</el-form-item>
				<el-form-item label="Product location：">
					<span>{{infoForm.place}}</span>
				</el-form-item>
			</el-form>
			<el-form :model="buyForm" :rules="buyRules" ref="buyForm">
				<el-form-item label="Amazon order number：" prop="orderNo">
					<el-input v-model="buyForm.orderNo"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeBuyModal">Close</el-button>
				<el-button type="warning" @click="buySubmit" :loading="btnLoading">Submit</el-button>
			</div>
		</el-dialog>

		<!-- 评论信息弹窗 -->
		<el-dialog :title="reviewModalTitle" :visible.sync="reviewModal" :close-on-click-modal="false" :before-close="closeReviewModal"
		 width="80%">
			<el-form :model="infoForm" ref="infoForm" class="warning" size="mini">
				<el-form-item label="Product Name：">
					<span>{{infoForm.productName}}</span>
				</el-form-item>
				<el-form-item label="Shop Name：">
					<span>{{infoForm.shopName}}</span>
				</el-form-item>
				<el-form-item label="Product Asin：">
					<span>{{infoForm.asin}}</span>
				</el-form-item>
				<el-form-item label="Product KeyWord：">
					<span>{{infoForm.keyWord}}</span>
				</el-form-item>
				<el-form-item label="Product Brand：">
					<span>{{infoForm.brand}}</span>
				</el-form-item>
				<el-form-item label="Product location：">
					<span>{{infoForm.place}}</span>
				</el-form-item>
				<el-form-item label="Amazon order number：">
					<span>{{infoForm.orderNo}}</span>
				</el-form-item>
			</el-form>
			<el-form :model="reviewForm" :rules="reviewRules" ref="reviewForm">
				<el-form-item label="Amazon order review link：" prop="link">
					<el-input v-model="reviewForm.link"></el-input>
				</el-form-item>
				<el-form-item label="Amazon order review screenshot：" prop="img">
					<el-upload name="Image" action="/api/Order/GetProductPictures" :on-success="handleAvatarSuccess" :on-error="handleError"
					 :before-upload="beforeAvatarUpload" :on-remove="handleRemove" :file-list="fileList" list-type="picture" accept="image/jpeg,image/jpg,image/png,image/gif"
					 :limit='1'>
						<el-button size="mini" type="warning">Click upload</el-button>
						<span class="info ml10">Only jpg/png/gif can be uploaded, and each one can't exceed 5M</span>
					</el-upload>
					<el-input v-model="reviewForm.img"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeReviewModal">Close</el-button>
				<el-button type="warning" @click="reviewSubmit" :loading="btnLoading">Submit</el-button>
			</div>
		</el-dialog>

		<!-- 图片大图预览 -->
		<el-dialog title="Show big picture" :visible.sync="ViewImageModal" width="70%">
			<div class="txt-c">
				<img :src='ViewImageUrl' />
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import {
		orderList,
		orderAdd,
		reviewAdd,
		productList
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
				tableData: [],
				selsData: [],
				selectId: '',
				searchForm: {
					No: '',
					state: '0'
				},
				productData: [],
				infoForm: {
					productId: '',
					productName: '',
					shopName: '',
					asin: '',
					keyWord: '',
					brand: '',
					place: '',
					type: '',
					orderNo: ''
				},
				btnLoading: false,
				buyModal: false,
				buyModalTitle: '',
				buyForm: {
					orderNo: ''
				},
				buyRules: {
					orderNo: {
						required: true,
						message: 'Please enter amazon order number',
						trigger: 'blur'
					}
				},
				reviewModal: false,
				reviewModalTitle: '',
				reviewForm: {
					link: '',
					img: '',
					imgList: [] //如果是多图，传参时调用这个参数
				},
				fileList: [],
				reviewRules: {
					link: {
						required: true,
						message: 'Please enter amazon order review link',
						trigger: 'blur'
					},
					img: {
						required: true,
						message: 'Please upload amazon order review screenshot',
						trigger: 'change'
					}
				},
				ViewImageModal: false,
				ViewImageUrl: ''
			}
		},
		created() {
			this.getOrderData()
			this.getProductData()
		},
		methods: {
			// 获取订单列表数据
			getOrderData() {
				let _this = this
				_this.listLoading = true
				let params = {
					UserId: sessionStorage.getItem('userId'),
					AmazonNumber: _this.searchForm.No,
					State: _this.searchForm.state,
					pageIndex: _this.pageIndex,
					pageSize: _this.pageSize,
				}
				orderList(params).then(res => {
					_this.listLoading = false
					_this.tableData = res.result.Entity
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
						No: '',
						state: '0',
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

			//查看大图
			showImage(url) {
				let _this = this
				_this.ViewImageModal = true
				_this.ViewImageUrl = url
			},

			// 获取商品列表数据
			getProductData() {
				let _this = this
				let cId = localStorage.getItem('cId')
				let params = {
					countryId: cId,
					productTypeId: 0,
					DiscountsTypeId: 0,
					TradeName: '',
					pageIndex: 1,
					pageSize: 100000000
				}
				productList(params).then(res => {
					_this.productData = res.result.Entity
				}).catch((e) => {})
			},

			//展示购买窗口
			handleBuy(index, row) {
				let _this = this
				_this.buyModal = true
				_this.buyModalTitle = 'Fill in the Amazon order number'
				_this.selectId = row.Id
				let id = row.ProductManageId
				let data = _this.productData
				for (let x in data) {
					if (data[x].Id == id) {
						_this.infoForm.productId = data[x].Id
						_this.infoForm.productName = data[x].ProductName
						_this.infoForm.shopName = data[x].Shop
						_this.infoForm.keyWord = data[x].KeyWord
						_this.infoForm.asin = data[x].ASIN
						_this.infoForm.brand = data[x].Brand
						_this.infoForm.place = data[x].Place
						_this.infoForm.type = data[x].Type
					}
				}
			},

			// 购买填写单号提交
			buySubmit() {
				let _this = this
				_this.$refs.buyForm.validate((valid) => {
					if (valid) {
						_this.btnLoading = true
						let params = {
							UserId: sessionStorage.getItem('userId'),
							ProductManageId: _this.infoForm.productId,
							AmazonNumber: _this.buyForm.orderNo,
							Id: _this.selectId
						}
						orderAdd(params).then(res => {
							_this.btnLoading = false
							_this.closeBuyModal()
							_this.getOrderData()
						}).catch((e) => {
							_this.btnLoading = false
						})
					}
				})
			},

			//关闭购买窗口
			closeBuyModal() {
				let _this = this
				_this.buyModal = false
				_this.$refs['buyForm'].resetFields()
				_this.buyForm.orderNo = ''
			},

			//展示评价窗口
			handleReview(index, row) {
				let _this = this
				_this.reviewModal = true
				_this.reviewModalTitle = 'Fill in the Amazon order review'
				_this.selectId = row.Id
				let id = row.ProductManageId
				let data = _this.productData
				for (let x in data) {
					if (data[x].Id == id) {
						_this.infoForm.productId = data[x].Id
						_this.infoForm.productName = data[x].ProductName
						_this.infoForm.shopName = data[x].Shop
						_this.infoForm.keyWord = data[x].KeyWord
						_this.infoForm.asin = data[x].ASIN
						_this.infoForm.brand = data[x].Brand
						_this.infoForm.place = data[x].Place
						_this.infoForm.type = data[x].Type
					}
				}
				_this.infoForm.orderNo = row.AmazonNumber
			},

			// 评价提交
			reviewSubmit() {
				let _this = this
				_this.$refs.reviewForm.validate((valid) => {
					if (valid) {
						_this.btnLoading = true
						let params = {
							UserId: sessionStorage.getItem('userId'),
							Id: _this.selectId,
							Link: _this.reviewForm.link,
							Image: _this.reviewForm.img
						}
						reviewAdd(params).then(res => {
							_this.btnLoading = false
							_this.closeReviewModal()
							_this.getOrderData()
						}).catch((e) => {
							_this.btnLoading = false
						})
					}
				})
			},

			//关闭评价窗口
			closeReviewModal() {
				let _this = this
				_this.reviewModal = false
				_this.$refs['reviewForm'].resetFields()
				_this.reviewForm.link = ''
				_this.reviewForm.img = ''
				_this.reviewForm.imgList = []
			},

			// 图片上传
			handleAvatarSuccess(res, file) {
				if (res.IsSuccess) {
					this.reviewForm.img += res.pric
					this.reviewForm.imgList.push(res.pric)
					this.$message.success('Upload successfully！')
				} else {
					this.$message.error('Upload failed，Please try again later！')
				}
			},
			handleError(res) {
				this.$message.error('Upload failed，Please try again later！')
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isPNG = file.type === 'image/png';
				const isGIF = file.type === 'image/gif';
				const isLt5M = file.size / 1024 / 1024 < 5;
				if (!isJPG && !isPNG && !isGIF) {
					this.$message.error('Only jpg/png/gif can be uploaded！');
				} else if (!isLt5M) {
					this.$message.error("Image can't exceed 5M！");
				}
				return (isJPG || isPNG || isGIF) && isLt5M;
			},
			handleRemove(file, fileList) {
				let removeFile = file.response.pric
				let img = this.reviewForm.img.replace(removeFile, '')
				this.reviewForm.img = img
				let imgList = this.reviewForm.imgList.filter(item => item != removeFile)
				this.reviewForm.imgList = imgList
			}

		}
	}
</script>
