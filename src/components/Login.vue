<template>
	<div class="longin-box">
		<!-- 登录 -->
		<el-form v-show="doType==='login'" :model="loginForm" :rules="rules" ref="loginForm" class="login-container">
			<h1 class="title">Login <span class="small-title">Sign In to your buyer account</span></h1>
			<el-form-item prop="email">
				<el-input v-model="loginForm.email" auto-complete="off" prefix-icon="el-icon-user" placeholder="Email"></el-input>
			</el-form-item>
			<el-form-item prop="password">
				<el-input type="password" v-model="loginForm.password" auto-complete="off" prefix-icon="el-icon-lock" placeholder="Password"></el-input>
			</el-form-item>
			<div class="tixing">
				<span class="txt1">Forgot password？</span>
				<el-link type='primary' :underline="false" @click="doType='reset'" class="ml10">Retrieve Password</el-link>
			</div>
			<el-form-item>
				<el-button class="login-btn" type="warning" @click="loginIn" :loading="btnLoading">Login</el-button>
				<div class="tixing">
					<el-link type='primary' :underline="false" @click="$router.push({path:'/home'})" style="float: left;">Go home</el-link>
					<span class="txt1">Not a member？</span>
					<el-link type='primary' :underline="false" @click="doType='reg'" class="ml10">Register Now</el-link>
				</div>
			</el-form-item>
		</el-form>
		<!-- 注册 -->
		<el-form v-show="doType==='reg'" :model="regForm" :rules="rules2" ref="regForm" class="login-container" size="small"
		 style="padding: 0 35px;">
			<h1 class="title">Register <span class="small-title">Create your buyer account</span></h1>
			<el-form-item prop="firstName">
				<el-input v-model="regForm.firstName" auto-complete="off" placeholder="FirstName"></el-input>
			</el-form-item>
			<el-form-item prop="lastName">
				<el-input v-model="regForm.lastName" auto-complete="off" placeholder="LastName"></el-input>
			</el-form-item>
			<el-form-item prop="email">
				<el-input v-model="regForm.email" auto-complete="off" placeholder="Email"></el-input>
			</el-form-item>
			<el-form-item prop="emailCode">
				<el-input type="text" v-model="regForm.emailCode" auto-complete="off" placeholder="Email verification code" style="width:60%"></el-input>
				<el-button type="warning" :disabled="disabledClick" @click="handleEmailCode" style="float: right">{{btnTxt}}</el-button>
			</el-form-item>
			<el-form-item prop="password">
				<el-input type="password" v-model="regForm.password" auto-complete="off" placeholder="Password"></el-input>
			</el-form-item>
			<el-form-item prop="password2">
				<el-input type="password" v-model="regForm.password2" auto-complete="off" placeholder="Confirm Password"></el-input>
			</el-form-item>
			<p class="warning">Please fill in the following information carefully. Once filled in, it cannot be modified.</p>
			<el-form-item prop="ppAccount">
				<el-input v-model="regForm.ppAccount" auto-complete="off" placeholder="Your paypal account"></el-input>
			</el-form-item>
			<el-form-item prop="amzProfile">
				<el-input v-model="regForm.amzProfile" auto-complete="off" placeholder="Your amazon profile"></el-input>
			</el-form-item>
			<el-form-item prop='image' class="screenshot">
				<el-upload action=" " list-type="picture-card" multiple :limit="1" :file-list="fileListAdd" :on-remove="handleAddRemove"
				 :on-change="handleAddChange" :auto-upload="false" accept="image/jpeg,image/png,image/gif,image/bmp" :class="{'hide':hideUploadAdd}">
					<i class="el-icon-plus"></i>
					<div class="el-upload__tip warning" slot="tip">Please upload your amazon profile screenshot</div>
				</el-upload>
			</el-form-item>
			<el-form-item>
				<el-button class="login-btn" type="warning" @click="regSubmiut" :loading="btnLoading" style="margin-top: 0px;">Register</el-button>
				<div class="tixing">
					<el-link type='primary' :underline="false" @click="$router.push({path:'/home'})" style="float: left;">Go home</el-link>
					<span class="txt1">Already a member？</span>
					<el-link type='primary' :underline="false" @click="doType='login'" class="ml10">Log In</el-link>
				</div>
			</el-form-item>
		</el-form>
		<!-- 找回密码 -->
		<el-form v-show="doType==='reset'" :model="resetForm" :rules="rules3" ref="resetForm" class="login-container">
			<h1 class="title">Reset <span class="small-title">Reset your buyer account password</span></h1>
			<el-form-item prop="email">
				<el-input v-model="resetForm.email" auto-complete="off" placeholder="Email"></el-input>
			</el-form-item>
			<el-form-item prop="emailCode">
				<el-input type="text" v-model="resetForm.emailCode" auto-complete="off" placeholder="Verification code" style="width: 50%;"></el-input>
				<el-button type="warning" :disabled="disabledClick" @click="handleEmailCode" style="float: right">{{btnTxt}}</el-button>
			</el-form-item>
			<el-form-item prop="password">
				<el-input type="password" v-model="resetForm.password" auto-complete="off" placeholder="Password"></el-input>
			</el-form-item>
			<el-form-item prop="password2">
				<el-input type="password" v-model="resetForm.password2" auto-complete="off" placeholder="Confirm Password"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button class="login-btn" type="warning" @click="resetSubmiut" :loading="btnLoading">Reset</el-button>
				<div class="tixing">
					<el-link type='primary' :underline="false" @click="$router.push({path:'/home'})" style="float: left;">Go home</el-link>
					<span class="txt1">Know the password？</span>
					<el-link type='primary' :underline="false" @click="doType='login'" class="ml10">Log In</el-link>
				</div>
			</el-form-item>
		</el-form>

	</div>
</template>

<script>
	import {
		login,
		register,
		resetPassword,
		emailCode
	} from '@/api/api'
	export default {
		name: 'Login',
		data() {
			// 邮箱验证
			const validateEmail = (rule, value, callback) => {
				if (value === "") {
					callback(new Error("Please enter your email"));
					this.disabledClick = true
				} else {
					let reg = '/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/'
					if (!/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(value)) {
						callback(new Error("Please enter your vaild email"));
						this.disabledClick = true
					} else {
						callback()
						this.disabledClick = false
					}
				}
			}
			//密码验证（注册）
			const validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('Please enter your password'));
				} else {
					if (this.regForm.password2 !== '') {
						this.$refs.regForm.validateField('password2');
					}
					callback();
				}
			}
			// 二次密码验证（注册）
			const validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('Please enter your password again'));
				} else if (value !== this.regForm.password) {
					callback(new Error('The two passwords entered are inconsistent!'));
				} else {
					callback();
				}
			}
			//密码验证（找回密码）
			const validatePass_reset = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('Please enter your password'));
				} else {
					if (this.resetForm.password2 !== '') {
						this.$refs.resetForm.validateField('password2');
					}
					callback();
				}
			}
			// 二次密码验证（找回密码）
			const validatePass2_reset = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('Please enter your password again'));
				} else if (value !== this.resetForm.password) {
					callback(new Error('The two passwords entered are inconsistent!'));
				} else {
					callback();
				}
			}
			return {
				doType: 'login',
				btnLoading: false,
				loginForm: {
					email: '',
					password: ''
				},
				rules: {
					email: [{
						validator: validateEmail,
						trigger: "blur"
					}],
					password: [{
						required: true,
						message: 'Please enter your password',
						trigger: 'blur'
					}]
				},
				countryData: [],
				regForm: {
					firstName: '',
					lastName: '',
					email: '',
					emailCode: '',
					password: '',
					password2: '',
					ppAccount: '',
					amzProfile: ''
				},
				fileListAdd: [],
				hideUploadAdd: false,
				rules2: {
					firstName: {
						required: true,
						message: 'Please enter your firstName',
						trigger: 'blur'
					},
					lastName: {
						required: true,
						message: 'Please enter your lastName',
						trigger: 'blur'
					},
					email: [{
						validator: validateEmail,
						trigger: "change"
					}],
					emailCode: {
						required: true,
						message: 'Please enter the email verification code',
						trigger: 'blur'
					},
					password: [{
						validator: validatePass,
						trigger: 'blur'
					}],
					password2: [{
						validator: validatePass2,
						trigger: 'blur'
					}],
					ppAccount: {
						required: true,
						message: 'Please enter your paypal account',
						trigger: 'blur'
					}
				},
				resetForm: {
					email: '',
					emailCode: '',
					password: '',
					password2: '',
				},
				rules3: {
					email: [{
						validator: validateEmail,
						trigger: "change"
					}],
					emailCode: {
						required: true,
						message: 'Please enter the email verification code',
						trigger: 'blur'
					},
					password: [{
						validator: validatePass_reset,
						trigger: 'blur'
					}],
					password2: [{
						validator: validatePass2_reset,
						trigger: 'blur'
					}]
				},
				btnTxt: "Get email code",
				totalTime: 60,
				disabledClick: true, // 节流
				clockTimer: null, // 定时器
			}
		},
		created() {
			//回车键登录
			let _this = this
			document.onkeydown = function(e) {
				var key = window.event.keyCode
				if (key === 13) {
					_this.loginIn()
				}
			}
		},
		beforeDestroy() {
			//离开页面销毁回车键事件
			document.onkeydown = function(e) {
				var key = window.event.keyCode
				if (key === 13) {}
			}
		},
		methods: {
			// 登录
			loginIn() {
				let _this = this
				_this.$refs.loginForm.validate((valid) => {
					if (valid) {
						_this.btnLoading = true
						let params = {
							Email: _this.loginForm.email,
							Password: _this.loginForm.password
						}
						login(params).then(res => {
							sessionStorage.setItem('userId', res.Id)
							sessionStorage.setItem('userName', res.LastName)
							_this.btnLoading = false
							//获取要跳转的地址
							let url = sessionStorage.getItem('path')
							if (!url) {
								this.$router.push('/home')
							} else {
								this.$router.push(url)
							}
						}).catch((e) => {
							_this.btnLoading = false
						})
					}
				})
			},

			//注册
			regSubmiut() {
				let _this = this
				_this.$refs.regForm.validate((valid) => {
					if (valid) {
						_this.btnLoading = true

						//创建formData 用formData形式传参
						let params = new FormData()
						params.append('FirstName', _this.regForm.firstName)
						params.append('LastName', _this.regForm.lastName)
						params.append('Email', _this.regForm.email)
						params.append('Password', _this.regForm.password)
						params.append('Code', _this.regForm.emailCode)
						params.append('PaypalAccount', _this.regForm.ppAccount)
						params.append('ProfileUrl', _this.regForm.amzProfile)
						_this.fileListAdd.map(item => {
							params.append("image", item.raw)
						})
						//个人资料链接与个人资料截图必须至少填写一项
						if (!_this.regForm.amzProfile && _this.fileListAdd.length == 0) {
							this.$message.error('Fill in at least one of Amazon profile and Amazon profile screenshot')
							_this.btnLoading = false
						} else {
							register(params).then(res => {
								_this.btnLoading = false
								_this.doType = 'login'
							}).catch((e) => {
								_this.btnLoading = false
							})
						}
					}
				})
			},

			// 找回密码
			resetSubmiut() {
				let _this = this
				_this.$refs.resetForm.validate((valid) => {
					if (valid) {
						_this.btnLoading = true
						let params = {
							Email: _this.resetForm.email,
							Code: _this.resetForm.emailCode,
							Password: _this.resetForm.password
						}
						resetPassword(params).then(res => {
							_this.btnLoading = false
							_this.doType = 'login'
						}).catch((e) => {
							_this.btnLoading = false
						})
					}
				})
			},

			//点击获取邮箱验证码
			handleEmailCode() {
				let _this = this
				if (_this.disabledClick) return // 节流 防止频繁访问接口
				_this.getEmailCode()
				_this.disabledClick = true
				_this.btnTxt = _this.totalTime + 's Get again'
				_this.clockTimer = window.setInterval(() => {
					_this.totalTime--
					_this.btnTxt = _this.totalTime + 's Get again'
					if (_this.totalTime == 0) {
						window.clearInterval(_this.clockTimer)
						_this.btnTxt = 'Get email code'
						_this.totalTime = 60
						_this.disabledClick = false
					}
				}, 1000)
			},

			//获取邮箱验证码
			getEmailCode() {
				let _this = this
				let email = ''
				if (_this.doType === 'reg') {
					email = _this.regForm.email
				}
				if (_this.doType == 'reset') {
					email = _this.resetForm.email
				}
				let params = {
					UserMail: email
				}
				emailCode(params).then(res => {}).catch((e) => {})
			},

			// 个人资料图片上传
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
				if (fileList.length >= 1) {
					this.hideUploadAdd = true;
				}
			},
			// 移除文件
			handleAddRemove(file, fileList) {
				this.hideUploadAdd = false;
			},

		}
	}
</script>
