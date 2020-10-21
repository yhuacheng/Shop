<template>
	<div class="user-box">
		<div class="mt50">
			<el-form :model="userData" ref="userData" label-width="110px">
				<el-form-item label="Email：">
					<span>{{userData.Email}}</span>
				</el-form-item>
				<el-form-item label="First Name：">
					<span>{{userData.FirstName}}</span>
				</el-form-item>
				<el-form-item label="Last Name：">
					<span>{{userData.LastName}}</span>
				</el-form-item>
				<el-form-item label="Account level：">
					<span>{{userData.BuyerGrade}}</span>
				</el-form-item>
				<el-form-item label="integral：">
					<span>{{userData.BuyerScore}}</span>
				</el-form-item>
				<el-form-item label="PaypalAccount：">
					<span>{{userData.PaypalAccount}}</span>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script>
	import {
		userInfo,
	} from '@/api/api'
	export default {
		name: 'userInfo',
		data() {
			return {
				userData: {}
			}
		},
		created() {
			this.getUserData()
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
				}).catch((e) => {})
			}
		}
	}
</script>
