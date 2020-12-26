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
								<el-option value="1" label="Waiting for review Amazon order number"></el-option>
								<el-option value="2" label="Waiting to fill in the Amazon order review"></el-option>
								<el-option value="3" label="Waiting for review Amazon order review"></el-option>
								<el-option value="4" label="Finished"></el-option>
								<el-option value="5" label="Amazon order number audit not passed"></el-option>
								<el-option value="6" label="Amazon order review audit not passed"></el-option>
								<el-option value="-2" label="Cancelled"></el-option>
								<el-option value="-3" label="Time out"></el-option>
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
				<el-table-column prop="ImgUrl" label="Image" align="center">
					<template slot-scope="scope">
						<img style="width: 40px;height: 40px;" v-if="scope.row.ImgUrl" :src="$IMGURL+scope.row.ImgUrl" @click.stop="showImage($IMGURL+scope.row.ImgUrl)" />
					</template>
				</el-table-column>
				<el-table-column prop="ProductName" label="Product Name" align="center" :show-overflow-tooltip='true'>
					<template slot-scope="scope">
						<span>{{scope.row.ProductName}}</span>
						<br>
						<span class="info fz12" v-if="scope.row.Color">{{scope.row.Color}}</span>
						<span class="info fz12 ml10" v-if="scope.row.Size">{{scope.row.Size}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="BuyTotal" label="Price" align="center" width="150">
					<template slot-scope="scope">
						<span>{{scope.row.BuyTotal}} {{scope.row.Currency}}</span>
						<span v-if="scope.row.Integral>0">+{{scope.row.Integral}} Points</span>
					</template>
				</el-table-column>
				<el-table-column prop="Commission" label="Commission" align="center">
					<template slot-scope="scope">
						<span>{{Number(scope.row.Commission)}} {{scope.row.Currency}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="AddTime" label="Order Time" align="center" width="150"></el-table-column>
				<el-table-column prop="AmazonNumber" label="Amazon Number" align="center" width="150"></el-table-column>
				<el-table-column prop="CommontLink" label="Review link" align="center" :show-overflow-tooltip='true'></el-table-column>
				<el-table-column prop="PJImage" label="Review Image" align="center" width="150">
					<template slot-scope="scope">
						<img style="width: 40px;height: 40px;margin-right: 2px;" v-for="item in scope.row.PJImage" v-if="item" :src="item"
						 @click.stop="showImage(item)" />
					</template>
				</el-table-column>
				<el-table-column prop="FKImage" label="Refund Image" align="center" width="150">
					<template slot-scope="scope">
						<img style="width: 40px;height: 40px;margin-right: 2px;" v-for="item in scope.row.FKImage" v-if="item" :src="$IMGURL+item"
						 @click.stop="showImage($IMGURL+item)" />
					</template>
				</el-table-column>

				<el-table-column prop="State" label="Order Status" align="center" width="300" :show-overflow-tooltip='true'>
					<template slot-scope="scope">
						<el-tag size="small" type="info" v-if="scope.row.State==-1">Waiting to fill in the Amazon order number</el-tag>
						<el-tag size="small" type="warning" v-if="scope.row.State==1">Waiting for review Amazon order number</el-tag>
						<el-tag size="small" type="warning" v-if="scope.row.State==2">Waiting to fill in the Amazon order review</el-tag>
						<el-tag size="small" type="warning" v-if="scope.row.State==3">Waiting for review Amazon order review</el-tag>
						<el-tag size="small" type="success" v-if="scope.row.State==4">Finished</el-tag>
						<el-tag size="small" type="danger" v-if="scope.row.State==5">Amazon order number audit not passed</el-tag>
						<el-tag size="small" type="danger" v-if="scope.row.State==6">Amazon order review audit not passed</el-tag>
						<el-tag size="small" type="danger" v-if="scope.row.State==-2">Cancelled</el-tag>
						<el-tag size="small" type="danger" v-if="scope.row.State==-3">Time out</el-tag>
						<br>
						<span class="danger" v-if="scope.row.Remark">Reason：{{scope.row.Remark}}</span>
					</template>
				</el-table-column>
				<el-table-column label="Function Button" align="center" width="260">
					<template v-slot="scope">
						<el-button size="small" type="primary" v-if="scope.row.State==-1" :disabled="scope.row.State==-1&&scope.row.Overtime<=0"
						 @click="handleBuy(scope.$index, scope.row)">Fill in the Amazon order number</el-button>
						<el-button size="small" type="primary" v-if="scope.row.State==1 || scope.row.State==5" @click="handleBuy(scope.$index, scope.row)">
							<span v-if="scope.row.State==1">Update the Amazon order number</span>
							<span v-if="scope.row.State==5">Fill in the Amazon order number again</span>
						</el-button>
						<el-button size="small" type="warning" v-if="scope.row.State==2 || scope.row.State==3 || scope.row.State==6"
						 @click="handleReview(scope.$index, scope.row)">
							<span v-if="scope.row.State==2">Fill in the Amazon order review</span>
							<span v-if="scope.row.State==3">Update the Amazon order review</span>
							<span v-if="scope.row.State==6">Fill in the Amazon order review again</span>
						</el-button>
						<br>
						<span class="danger" v-if="scope.row.Overtime>0 && scope.row.State==-1">{{scope.row.SYtime}}</span>
						<span class="info" v-if="scope.row.Overtime<=0 && scope.row.State==-1">Time out</span>
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
			<div v-if="contact">
				<p class="warning">If you encounter problems, you can contact us through the following ways：</p>
				<div class="w100" v-html="contact"></div>
			</div>
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
			<el-form :model="reviewForm" ref="reviewForm">
				<el-form-item label="Amazon order review link：" prop="link">
					<el-input v-model="reviewForm.link"></el-input>
				</el-form-item>

				<!-- 评价截图 图片文件与表单数据一起提交-->
				<el-form-item label="Amazon order review screenshot：" prop="picture">
					<span class="danger">( * Required )</span>
					<br>
					<el-upload action="" list-type="picture-card" multiple :limit="3" :file-list="fileListAdd" :on-remove="handleAddRemove"
					 :on-change="handleAddChange" :auto-upload="false" accept="image/jpeg,image/png,image/gif,image/bmp" :class="{'hide':hideUploadAdd}"
					 :disabled="disUpload">
						<i class="el-icon-plus"></i>
						<div class="el-upload__tip warning" slot="tip">Only upload jpg/png/gif/bmp pictures and cannot exceed 3 and each
							picture cannot be larger than 5M</div>
						<div class="el-upload__tip danger" slot="tip">If your comment is deleted, please comment on the seller and send
							me a screenshot of the comment and the screenshot of the comment seller to me</div>
					</el-upload>
					<div v-if="fileListData.length>0">
						<el-button type="danger" size="mini" @click='editImg'>Edit picture</el-button>
						<el-button type="warning" size="mini" @click='resetImg'>Reset picture</el-button>
					</div>
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
		productList,
		contactList
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
				formatId: '',
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
				price: '',
				points: '',
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
					link: ''
				},
				fileListAdd: [],
				hideUploadAdd: false,
				fileListData: [],
				disUpload: false,
				ViewImageModal: false,
				ViewImageUrl: '',
				timer: '',
				contact: ''
			}
		},
		destroyed() {
			clearInterval(this.timer)
		},
		created() {
			this.getOrderData()
			this.getProductData()
			this.getContactData()
		},
		methods: {
			// 订单剩余有效时间倒计时
			init() {
				this.timer = setInterval(() => {
					this.tableData.forEach((item, idx) => {
						item.Overtime = item.Overtime <= 0 ? 0 : item.Overtime - 1
						item.SYtime = this.formatSeconds(item.Overtime)
					})
					if (this.tableData.every(item => item.Overtime == 0)) {
						clearInterval(this.timer)
					}
				}, 1000)
			},

			// 剩余时间转换（秒转时分秒）
			formatSeconds(value) {
				let result = parseInt(value)
				let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
				let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
				let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
				let res = '';
				if (h !== '00') res += `${h}:`;
				if (m !== '00') res += `${m}:`;
				res += `${s}`;
				return res;
			},

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
					_this.tableData.forEach((item, idx) => {
						item.ImgUrl = item.Picture ? item.Picture.split(',')[0] : item.ProductUrl
						item.PJImage = item.CommontImage ? item.CommontImage.split(',') : []
						item.FKImage = item.BuyImage ? item.BuyImage.split(',') : []
					})
					_this.total = Number(res.result.TotalCount)
					//执行倒计时
					_this.init()
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
				_this.formatId = row.ProductManageSizeColorId
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
				_this.price = row.BuyTotal
				_this.points = row.Integral

				//再次填写时获取已存储的单号
				_this.buyForm.orderNo = row.AmazonNumber
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
							Id: _this.selectId,
							Price: _this.price,
							Points: _this.points,
							ProductManageSizeColorId: _this.formatId
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

				//再次填写时获取已存储的评价链接和评价截图
				_this.reviewForm.link = row.CommontLink
				//图片转换为 url:'xxx' 格式才能回显
				let img = ''
				if (row.CommontImage) {
					img = row.CommontImage
					let imgArr = img.split(',')
					let formatImgArr = []
					for (let x in imgArr) {
						let obj = new Object()
						obj.url = imgArr[x]
						formatImgArr.push(obj)
					}
					_this.fileListAdd = formatImgArr //赋值给图片上传控件回显数据
					_this.fileListData = formatImgArr //记录获取到的原始数据

					_this.disUpload = true //修改时默认先禁用图片上传功能
					_this.hideUploadAdd = true //隐藏图片上传控件
				}
			},

			// 评价提交
			reviewSubmit() {
				let _this = this
				_this.$refs.reviewForm.validate((valid) => {
					if (valid) {
						_this.btnLoading = true

						if (_this.fileListAdd.length > 0) {
							//创建formData 用formData形式传参
							let params = new FormData()
							params.append('UserId', sessionStorage.getItem('userId'))
							params.append('Id', _this.selectId)
							params.append('Link', _this.reviewForm.link)
							_this.fileListAdd.map(item => {
								params.append("image", item.raw);
							})

							reviewAdd(params).then(res => {
								_this.btnLoading = false
								_this.closeReviewModal()
								_this.getOrderData()
							}).catch((e) => {
								_this.btnLoading = false
							})
						} else {
							this.$message.error('The amazon order review screenshot is required')
							_this.btnLoading = false
						}
					}
				})
			},

			//关闭评价窗口
			closeReviewModal() {
				let _this = this
				_this.reviewModal = false
				_this.$refs['reviewForm'].resetFields()
				_this.reviewForm.link = ''
				_this.fileListAdd = []
				_this.hideUploadAdd = false
				_this.fileListData = []
				_this.disUpload = false
			},

			//编辑页面打开图片编辑功能
			editImg() {
				let _this = this
				_this.disUpload = false
				_this.fileListAdd = []
				_this.hideUploadAdd = false
			},

			//编辑页面重置图片的回显
			resetImg() {
				let _this = this
				_this.disUpload = true
				_this.fileListAdd = _this.fileListData
				_this.hideUploadAdd = true
			},

			// 评价截图上传
			handleAddChange(file, fileList) {
				let fileType = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase()
				const isJPG = fileType === 'jpg';
				const isJPEG = fileType === 'jpeg';
				const isPNG = fileType === 'png';
				const isGIF = fileType === 'gif';
				const isBMP = fileType === 'bmp';
				const isLt5M = file.size / 1024 / 1024 < 5;
				if (!isJPG && !isJPEG && !isPNG && !isGIF && !isBMP) {
					this.$message.error('Picture format must be jpg/jpeg/png/gif/bmp');
					fileList.splice(-1, 1);
				} else if (!isLt5M) {
					this.$message.error('Picture size cannot exceed 5MB');
					fileList.splice(-1, 1);
				} else {
					this.fileListAdd = fileList;
				}
				// 上传文件>=限制个数时隐藏上传组件
				if (fileList.length >= 3) {
					this.hideUploadAdd = true;
				}
			},
			// 移除文件
			handleAddRemove(file, fileList) {
				this.fileListAdd = fileList
				this.hideUploadAdd = false;
			},

			//获取联系方式
			getContactData() {
				let _this = this
				let cId = localStorage.getItem('cId')
				let params = {
					CountryId: cId
				}
				contactList(params).then(res => {
					_this.contact = res.result.Contact
				}).catch((e) => {})
			}

		}
	}
</script>
