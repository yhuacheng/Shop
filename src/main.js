import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import '@/assets/css/style.scss'
import router from './routes'

Vue.use(ElementUI, {
	locale
})

Vue.prototype.$IMGURL = 'http://47.112.217.146:9090' //统一设置页面上图片URL路径入口

router.beforeEach((to, from, next) => {
	let cId = localStorage.getItem('cId') //国家id
	let uId = sessionStorage.getItem('userId') //用户id
	if (!cId && to.path !== '/loading') {
		next('/loading')
	} else if (to.path == '/login') {
		sessionStorage.setItem("path", router.currentRoute.fullPath)
		next()
	} else if (!uId && to.path == '/order') {
		next('/login')
	} else {
		next()
	}
})

new Vue({
	el: '#app',
	router,
	render: h => h(App)
}).$mount('#app')
