import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from "../components/register.vue"
import Login from "../components/login.vue"
// import DataUser from "../components/dataUser.vue"
import DataUser from "../components/dataUsercopy.vue"
import DataOwner from "../components/dataOwner.vue"

Vue.use(VueRouter)

const routes = [
  {path:'/', redirect:'/login'},
  // 注册路由
  {path: "/register", component: Register},
  // 登录路由
  {path: "/login", component: Login},
  // 数据使用用户
  {path: "/dataUser", component: DataUser},
  // 数据拥有者
  {path: "/dataOwner", component: DataOwner},
]

const router = new VueRouter({
  routes
})

// 配置全局路由守卫
router.beforeEach((to, from, next) => {
   // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转
  if ((to.path == '/login') || (to.path == '/register')) return next()    // 登录注册不需要权限
  // 访问其它页面均需要权限，获取token
  const username = window.sessionStorage.getItem("username")
  if (!username){
     return next("/login")
  }
  next() // token存在放行
})
export default router
