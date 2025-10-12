// ==================== 不使用布局管理器的路由 ====================
export const noLayoutRoutes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/Login.vue"),
    meta: {
      title: "用户登录",
      requiresAuth: false,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () => import("@/views/404/Index.vue"),
    meta: {
      title: "任意路由",
      requiresAuth: false,
    },
  },
];

// ==================== 使用布局管理器的路由 ====================
export const layoutRoutes = [
  // 仪表盘
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/views/Dashboard/index.vue"),
    meta: {
      title: "仪表盘",
      icon: "DashboardOutlined",
      requiresAuth: true,
      order: 1,
      hidden: false,
    },
  },
  //大语言模型
  {
    path: "/llm",
    name: "LLM",
    component: () => import("@/views/Llm/Index.vue"),
    meta: {
      title: "大模型",
      icon: "ChromeOutlined",
      requiresAuth: true,
      order: 2,
      hidden: false,
    },
  },
  // 表单页面
  {
    path: "/form",
    name: "Form",
    redirect: "/form/basic",
    meta: {
      title: "表单页",
      icon: "FormOutlined",
      requiresAuth: true,
      order: 3,
      hidden: false,
    },
    children: [
      {
        path: "/form/basic",
        name: "BasicForm",
        component: () => import("@/views/Form/BasicForm.vue"),
        meta: {
          title: "基础表单",
          icon: "FormOutlined",
          requiresAuth: true,
          order: 1,
          hidden: false,
        },
      },
      {
        path: "/form/step",
        name: "StepForm",
        component: () => import("@/views/Form/StepForm.vue"),
        meta: {
          title: "分步表单",
          icon: "FormOutlined",
          requiresAuth: true,
          order: 2,
          hidden: false,
        },
      },
      {
        path: "/form/advanced",
        name: "AdvancedForm",
        component: () => import("@/views/Form/AdvancedForm.vue"),
        meta: {
          title: "高级表单",
          icon: "FormOutlined",
          requiresAuth: true,
          order: 3,
          hidden: false,
        },
      },
    ],
  },
  // 列表页面
  {
    path: "/list",
    name: "List",
    redirect: "/list/table",
    meta: {
      title: "列表页",
      icon: "TableOutlined",
      requiresAuth: true,
      order: 4,
      hidden: false,
    },
    children: [
      {
        path: "/list/table",
        name: "TableList",
        component: () => import("@/views/List/TableList.vue"),
        meta: {
          title: "查询表格",
          icon: "TableOutlined",
          requiresAuth: true,
          order: 1,
          hidden: false,
        },
      },
      {
        path: "/list/basic",
        name: "BasicList",
        component: () => import("@/views/List/BasicList.vue"),
        meta: {
          title: "标准列表",
          icon: "TableOutlined",
          requiresAuth: true,
          order: 2,
          hidden: false,
        },
      },
      {
        path: "/list/card",
        name: "CardList",
        component: () => import("@/views/List/CardList.vue"),
        meta: {
          title: "卡片列表",
          icon: "TableOutlined",
          requiresAuth: true,
          order: 3,
          hidden: false,
        },
      },
      {
        path: "/list/search",
        name: "SearchList",
        redirect: "/list/search/articles",
        meta: {
          title: "搜索列表",
          icon: "SearchOutlined",
          requiresAuth: true,
          order: 4,
          hidden: false,
        },
        children: [
          {
            path: "/list/search/articles",
            name: "SearchArticles",
            component: () => import("@/views/List/Search/Articles.vue"),
            meta: {
              title: "搜索列表（文章）",
              icon: "FileTextOutlined",
              requiresAuth: true,
              order: 1,
              hidden: false,
            },
          },
          {
            path: "/list/search/projects",
            name: "SearchProjects",
            component: () => import("@/views/List/Search/Projects.vue"),
            meta: {
              title: "搜索列表（项目）",
              icon: "ProjectOutlined",
              requiresAuth: true,
              order: 2,
              hidden: false,
            },
          },
          {
            path: "/list/search/applications",
            name: "SearchApplications",
            component: () => import("@/views/List/Search/Applications.vue"),
            meta: {
              title: "搜索列表（应用）",
              icon: "AppstoreOutlined",
              requiresAuth: true,
              order: 3,
              hidden: false,
            },
          },
        ],
      },
    ],
  },
  // 详情页面
  {
    path: "/profile",
    name: "Profile",
    redirect: "/profile/basic",
    meta: {
      title: "详情页",
      icon: "ProfileOutlined",
      requiresAuth: true,
      order: 5,
      hidden: false,
    },
    children: [
      {
        path: "/profile/basic",
        name: "BasicProfile",
        component: () => import("@/views/Profile/BasicProfile.vue"),
        meta: {
          title: "基础详情页",
          icon: "ProfileOutlined",
          requiresAuth: true,
          order: 1,
          hidden: false,
        },
      },
      {
        path: "/profile/advanced",
        name: "AdvancedProfile",
        component: () => import("@/views/Profile/AdvancedProfile.vue"),
        meta: {
          title: "高级详情页",
          icon: "ProfileOutlined",
          requiresAuth: true,
          order: 2,
          hidden: false,
        },
      },
    ],
  },
  // 结果页面
  {
    path: "/result",
    name: "Result",
    redirect: "/result/success",
    meta: {
      title: "结果页",
      icon: "CheckCircleOutlined",
      requiresAuth: true,
      order: 6,
      hidden: false,
    },
    children: [
      {
        path: "/result/success",
        name: "ResultSuccess",
        component: () => import("@/views/Result/Success.vue"),
        meta: {
          title: "成功页",
          icon: "CheckCircleOutlined",
          requiresAuth: true,
          order: 1,
          hidden: false,
        },
      },
      {
        path: "/result/fail",
        name: "ResultFail",
        component: () => import("@/views/Result/Fail.vue"),
        meta: {
          title: "失败页",
          icon: "CloseCircleOutlined",
          requiresAuth: true,
          order: 2,
          hidden: false,
        },
      },
    ],
  },
  // 异常页面
  {
    path: "/exception",
    name: "Exception",
    redirect: "/exception/403",
    meta: {
      title: "异常页",
      icon: "ExclamationCircleOutlined",
      requiresAuth: true,
      order: 7,
      hidden: false,
    },
    children: [
      {
        path: "/exception/403",
        name: "Exception403",
        component: () => import("@/views/Exception/403.vue"),
        meta: {
          title: "403 禁止访问",
          icon: "StopOutlined",
          requiresAuth: true,
          order: 1,
          hidden: false,
        },
      },
      {
        path: "/exception/404",
        name: "Exception404",
        component: () => import("@/views/Exception/404.vue"),
        meta: {
          title: "404 页面不存在",
          icon: "FileUnknownOutlined",
          requiresAuth: false,
          order: 2,
          hidden: false,
        },
      },
      {
        path: "/exception/500",
        name: "Exception500",
        component: () => import("@/views/Exception/500.vue"),
        meta: {
          title: "500 服务器错误",
          icon: "DisconnectOutlined",
          requiresAuth: false,
          order: 3,
          hidden: false,
        },
      },
    ],
  },
  // 用户管理页面
  {
    path: "/user",
    name: "User",
    redirect: "/user/center",
    meta: {
      title: "个人页",
      icon: "UserOutlined",
      requiresAuth: true,
      order: 8,
      hidden: false,
    },
    children: [
      {
        path: "/user/center",
        name: "UserCenter",
        component: () => import("@/views/User/Center.vue"),
        meta: {
          title: "个人中心",
          icon: "UserOutlined",
          requiresAuth: true,
          order: 1,
          hidden: false,
        },
      },
      {
        path: "/user/settings",
        name: "UserSettings",
        component: () => import("@/views/User/Settings.vue"),
        meta: {
          title: "个人设置",
          icon: "SettingOutlined",
          requiresAuth: true,
          order: 2,
          hidden: false,
        },
      },
    ],
  },
  // 账户管理页面
  {
    path: "/account",
    name: "Account",
    redirect: "/account/center",
    meta: {
      title: "账户管理",
      icon: "FormOutlined",
      requiresAuth: true,
      order: 9,
      hidden: false,
    },
    children: [
      {
        path: "/account/center",
        name: "AccountCenter",
        component: () => import("@/views/Account/Center.vue"),
        meta: {
          title: "账户中心",
          icon: "UserOutlined",
          requiresAuth: true,
          order: 1,
          hidden: false,
        },
      },
      {
        path: "/account/settings",
        name: "AccountSettings",
        component: () => import("@/views/Account/Settings.vue"),
        meta: {
          title: "账户设置",
          icon: "SettingOutlined",
          requiresAuth: true,
          order: 2,
          hidden: false,
        },
      },
    ],
  },
  // 编辑器页面
  {
    path: "/editor",
    name: "Editor",
    redirect: "/editor/flow",
    meta: {
      title: "图形编辑器",
      icon: "EditOutlined",
      requiresAuth: true,
      order: 10,
      hidden: false,
    },
    children: [
      {
        path: "/editor/flow",
        name: "FlowEditor",
        component: () => import("@/views/Editor/Flow.vue"),
        meta: {
          title: "流程编辑器",
          icon: "NodeIndexOutlined",
          requiresAuth: true,
          order: 1,
          hidden: false,
        },
      },
      {
        path: "/editor/mind",
        name: "MindEditor",
        component: () => import("@/views/Editor/Mind.vue"),
        meta: {
          title: "脑图编辑器",
          icon: "ShareAltOutlined",
          requiresAuth: true,
          order: 2,
          hidden: false,
        },
      },
      {
        path: "/editor/koni",
        name: "KoniEditor",
        component: () => import("@/views/Editor/Koni.vue"),
        meta: {
          title: "Koni编辑器",
          icon: "EditOutlined",
          requiresAuth: true,
          order: 3,
          hidden: false,
        },
      },
    ],
  },
  // 嵌套路由示例
  {
    path: "/nested",
    name: "Nested",
    redirect: "/nested/menu1",
    meta: {
      title: "路由嵌套",
      icon: "MenuOutlined",
      requiresAuth: true,
      order: 11,
      hidden: false,
    },
    children: [
      {
        path: "/nested/menu1",
        name: "NestedMenu1",
        redirect: "/nested/menu1/menu1-1",
        meta: {
          title: "Menu1",
          icon: "MenuOutlined",
          requiresAuth: true,
          order: 1,
          hidden: false,
        },
        children: [
          {
            path: "/nested/menu1/menu1-1",
            name: "NestedMenu1-1",
            component: () => import("@/views/Nested/Menu1/Menu1-1.vue"),
            meta: {
              title: "Menu1-1",
              icon: "MenuOutlined",
              requiresAuth: true,
              order: 1,
              hidden: false,
            },
          },
          {
            path: "/nested/menu1/menu1-2",
            name: "NestedMenu1-2",
            redirect: "/nested/menu1/menu1-2/menu1-2-1",
            meta: {
              title: "Menu1-2",
              icon: "MenuOutlined",
              requiresAuth: true,
              order: 2,
              hidden: false,
            },
            children: [
              {
                path: "/nested/menu1/menu1-2/menu1-2-1",
                name: "NestedMenu1-2-1",
                component: () =>
                  import("@/views/Nested/Menu1/Menu1-2/Menu1-2-1.vue"),
                meta: {
                  title: "Menu1-2-1",
                  icon: "MenuOutlined",
                  requiresAuth: true,
                  order: 1,
                  hidden: false,
                },
              },
              {
                path: "/nested/menu1/menu1-2/menu1-2-2",
                name: "NestedMenu1-2-2",
                component: () =>
                  import("@/views/Nested/Menu1/Menu1-2/Menu1-2-2.vue"),
                meta: {
                  title: "Menu1-2-2",
                  icon: "MenuOutlined",
                  requiresAuth: true,
                  order: 2,
                  hidden: false,
                },
              },
            ],
          },
          {
            path: "/nested/menu1/menu1-3",
            name: "NestedMenu1-3",
            component: () => import("@/views/Nested/Menu1/Menu1-3.vue"),
            meta: {
              title: "Menu1-3",
              icon: "MenuOutlined",
              requiresAuth: true,
              order: 3,
              hidden: false,
            },
          },
        ],
      },
      {
        path: "/nested/menu2",
        name: "NestedMenu2",
        component: () => import("@/views/Nested/Menu2.vue"),
        meta: {
          title: "Menu2",
          icon: "MenuOutlined",
          requiresAuth: true,
          order: 2,
          hidden: false,
        },
      },
      {
        path: "/nested/menu3",
        name: "NestedMenu3",
        component: () => import("@/views/Nested/Menu3.vue"),
        meta: {
          title: "Menu3",
          icon: "MenuOutlined",
          requiresAuth: true,
          order: 3,
          hidden: false,
        },
      },
    ],
  },
];

// 兼容性导出：为现有组件提供routes导出
// 菜单组件需要使用layoutRoutes来渲染菜单项
export const routes = layoutRoutes;
