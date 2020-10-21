import {
	get,
	post,
	postForm
} from './http'

export const login = (params) => post('/api/Login/UserLogin', params) //登录

export const register = (params) => postForm('/api/Login/Register', params) //注册

export const resetPassword = (params) => post('/api/Login/ChangePassword', params) //找回密码

export const emailCode = (params) => post('/api/Login/SendMail', params) //获取邮箱验证码

export const address = (params) => get('/api/Ip/GetAddress', params) //获取当前位置

export const countryList = (params) => get('/api/Country/GetCountryList', params) //国家列表

export const typeList = (params) => get('/api/ProductManage/GetProductTypeList', params) //商品分类列表

export const productList = (params) => get('/api/ProductManage/GetProductManageList', params) //商品列表

export const bannerList = (params) => get('/api/Rotation/GetRotationList', params) //轮播图列表

export const contactList = (params) => get('/api/CustomerService/GetCustomerService', params) //联系方式列表

export const noticeList = (params) => get('/api/Notice/GetNotice', params) //系统公告列表

export const userInfo = (params) => post('/api/Login/GetBuyer', params) //个人信息
