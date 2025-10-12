import { defineStore } from "pinia";
import { AuthUtils } from "@/utils";
import { ref } from "vue";
import { login, querySelf, logout } from "@/api";
import { message } from "@/utils";
import router from "@/router";

export const useUserStore = defineStore(
  "user",
  () => {
    const userData = ref(null);

    // 登录方法
    const handleLogin = async (data) => {
      // 调用登录接口
      const res = await login(data);
      if (res.code === 200) {
        // 使用认证工具类保存用户token
        AuthUtils.setToken(res.data, {
          expires: 7, // Token 7天过期
          secure: process.env.NODE_ENV === "production",
        });

        return true;
      } else {
        return false;
      }
    };

    //获取用户信息
    const getUserInfo = async () => {
      // 调用登录接口
      const res = await querySelf();
      if (res.code === 200) {
        userData.value = res.data;
      }
    };

    //退出登录
    const handleLogout = async () => {
      // 调用退出登录接口
      const res = await logout();
      if (res.code === 200) {
        // 清除用户数据
        userData.value = null;

        // 使用认证工具类清除登录信息
        AuthUtils.removeToken();

        message.success("退出登录成功");
        router.push("/login");
      }
    };

    return {
      handleLogin,
      handleLogout,
      getUserInfo,
      userData,
    };
  },
  {
    // 持久化配置
    persist: {
      key: "user-store",
      storage: localStorage,
      paths: ["userData"],
    },
  }
);
