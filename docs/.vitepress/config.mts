import { defineConfig } from "vitepress";

// 导入主题的配置
import { blogTheme } from "./blog-theme";
import { nav, Gitee, JueJin } from "./constant";

// 如果使用 GitHub/Gitee Pages 等公共平台部署
// 通常需要修改 base 路径，通常为“/仓库名/”
// 如果项目名已经为 name.github.io 域名，则不需要修改！
const base = process.env.GITHUB_ACTIONS === "true" ? "/cx-blog/" : "/";

// Vitepress 默认配置
// 详见文档：https://vitepress.dev/reference/site-config
export default defineConfig({
  // 继承博客主题(@sugarat/theme)
  extends: blogTheme,
  base,
  lang: "zh-cn",
  title: "cx-blog",
  description: "cx-blog",

  lastUpdated: true,
  // 详见：https://vitepress.dev/zh/reference/site-config#head
  head: [
    // 配置网站的图标（显示在浏览器的 tab 上）
    // ['link', { rel: 'icon', href: `${base}favicon.ico` }], // 修改了 base 这里也需要同步修改
    ["link", { rel: "icon", href: "/favicon.ico" }],
  ],
  cleanUrls: true,
  themeConfig: {
    // 展示 2,3 级标题在目录中
    outline: {
      level: [2, 3],
      label: "目录",
    },
    // 默认文案修改
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "相关文章",
    lastUpdatedText: "上次更新于",

    // 设置logo
    logo: "/avatar.jpg",
    // editLink: {
    //   pattern:
    //     'https://github.com/ATQQ/sugar-blog/tree/master/packages/blogpress/:path',
    //   text: '去 GitHub 上编辑内容'
    // },
    nav: nav,
    /*   sidebar: {
      // 当用户位于 `guide` 目录时，会显示此侧边栏
      "/js/": [
        {
          text: "JS",
          items: [
            { text: "GC", link: "/front-end/js/GC" },
            { text: "One", link: "/front-end/one" },
            { text: "Two", link: "/front-end/two" },
          ],
        },
      ],
    }, */
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/chen123-q",
      },
      {
        icon: {
          svg: JueJin,
        },
        link: "https://juejin.cn/user/3153820020379912",
      },
      {
        icon: {
          svg: Gitee,
        },
        link: "https://gitee.com/cx-7788",
      },
    ],
  },

  srcExclude: ["**/README.md", "test/**/*.md"],
  metaChunk: true,

  markdown: {
    lineNumbers: true,
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
  },
});
