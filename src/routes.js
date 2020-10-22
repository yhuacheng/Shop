import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

export default new Router({
	// mode: 'history',
	routes: [{
			path: '/',
			redirect: '/home'
		},
		{
			path: '/loading',
			name: 'loading',
			component: resolve => require(['./components/Loading.vue'], resolve)
		},
		{
			path: '/login',
			name: 'login',
			component: resolve => require(['./components/Login.vue'], resolve)
		},
		{
			path: '/404',
			name: '404',
			component: resolve => require(['./components/404.vue'], resolve)
		},
		{
			path: '/main',
			name: 'main',
			component: resolve => require(['./components/Main.vue'], resolve),
			children: [{
					path: '/home',
					name: 'home',
					component: resolve => require(['./views/home.vue'], resolve),
					meta: {
						title: '首页'
					}
				},
				{
					path: '/product/:type',
					name: 'product',
					component: resolve => require(['./views/product.vue'], resolve),
					meta: {
						title: '商品列表'
					}
				},
				{
					path: '/detail',
					name: 'detail',
					component: resolve => require(['./views/detail.vue'], resolve),
					meta: {
						title: '商品详情'
					}
				},
				{
					path: '/order',
					name: 'order',
					component: resolve => require(['./views/order.vue'], resolve),
					meta: {
						title: '订单'
					}
				},
				{
					path: '/userInfo',
					name: 'userInfo',
					component: resolve => require(['./views/userInfo.vue'], resolve),
					meta: {
						title: '个人信息'
					}
				}
			]
		},
		{
			path: '*',
			redirect: {
				path: '/404'
			}
		}
	]
})
