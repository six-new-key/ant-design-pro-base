import axios from 'axios'
// import { message,AuthUtils } from '@/utils'
// import router from '@/router'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 自动添加认证头
    // const authHeaders = AuthUtils.getAuthHeaders()
    // config.headers = {
    //   ...config.headers,
    //   ...authHeaders
    // }

    // 添加时间戳防止缓存
    // if (config.method === 'get') {
    //   config.params = {
    //     ...config.params,
    //     _t: Date.now()
    //   }
    // }

    console.log('🚀 发送请求:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('❌ 请求配置错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // const { data, status } = response
    
    // 请求成功
    // if (status >= 200 && status < 300) {
    //   console.log('✅ 请求成功:', response.config.url)
    //   return data
    // }
    
    return response
  },
//   (error) => {
//     const { response, config } = error
    
//     if (response) {
//       const { status, data } = response
      
//       switch (status) {
//         case 401:
//           // 未授权，清除认证信息并跳转到登录页
//           message.error('登录已过期，请重新登录')
//           AuthUtils.logout()
//           router.push('/login')
//           break
          
//         case 403:
//           // 权限不足
//           message.error('权限不足，无法访问该资源')
//           break
          
//         case 404:
//           // 资源不存在
//           message.error('请求的资源不存在')
//           break
          
//         case 500:
//           // 服务器错误
//           message.error('服务器内部错误，请稍后重试')
//           break
          
//         default:
//           // 其他错误
//           const errorMsg = data?.message || `请求失败 (${status})`
//           message.error(errorMsg)
//       }
      
//       console.error(`❌ 请求失败 [${status}]:`, config.url, data)
//     } else if (error.code === 'ECONNABORTED') {
//       // 请求超时
//       message.error('请求超时，请检查网络连接')
//       console.error('❌ 请求超时:', config.url)
//     } else {
//       // 网络错误
//       message.error('网络连接失败，请检查网络设置')
//       console.error('❌ 网络错误:', error.message)
//     }
    
//     return Promise.reject(error)
//   }
)

// 导出 axios 实例
export default request