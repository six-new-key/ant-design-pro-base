import { defineStore } from "pinia";
import { AuthUtils } from "@/utils";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {

    const userData = ref(null);

  // 登录方法
  const handleLogin = async (userInfo) => {
    // 模拟后端 300ms 延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (userInfo.username === "admin" && userInfo.password === "123456") {

        userData.value = userInfo;

      // 模拟后端返回的 Token 和用户信息
      const mockToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

      // 使用认证工具类保存登录信息
      AuthUtils.setToken(mockToken, {
        expires: 7, // Token 7天过期
        secure: process.env.NODE_ENV === "production",
      });

      return true;
    } else {
      return false;
    }
  };

  //退出登录
  const handleLogout = () => {
    // 清除用户数据
    userData.value = null;

    // 使用认证工具类清除登录信息
    AuthUtils.removeToken();
  };

  return {
    handleLogin,
    handleLogout
  };
});
