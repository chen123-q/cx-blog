export const JueJin =
  '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg class="icon" width="200px" height="155.62px" viewBox="0 0 1316 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M643.181714 247.698286l154.916572-123.172572L643.181714 0.256 643.072 0l-154.660571 124.269714 154.660571 123.245715 0.109714 0.182857z m0 388.461714h0.109715l399.579428-315.245714-108.361143-87.04-291.218285 229.888h-0.146286l-0.109714 0.146285L351.817143 234.093714l-108.251429 87.04 399.433143 315.136 0.146286-0.146285z m-0.146285 215.552l0.146285-0.146286 534.893715-422.034285 108.397714 87.04-243.309714 192L643.145143 1024 10.422857 525.056 0 516.754286l108.251429-86.893715L643.035429 851.748571z" fill="#1E80FF" /></svg>';
export const Gitee =
  '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg class="icon" width="200px" height="200.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m284.8 313.6c0 12.8-12.8 25.6-25.6 25.6H416c-41.6 0-76.8 35.2-76.8 76.8v243.2c0 12.8 12.8 25.6 25.6 25.6h240c41.6 0 76.8-35.2 76.8-76.8v-12.8c0-12.8-12.8-25.6-25.6-25.6H480c-12.8 0-25.6-12.8-25.6-25.6v-64c0-12.8 12.8-25.6 25.6-25.6h291.2c12.8 0 25.6 12.8 25.6 25.6v144c0 92.8-76.8 169.6-169.6 169.6H252.8c-12.8 0-25.6-12.8-25.6-25.6V412.8C227.2 310.4 310.4 224 416 224h355.2c12.8 0 25.6 12.8 25.6 25.6v64z" fill="#B32225" /></svg>';
export const navList = [
  { text: "首页", link: "/" },
  {
    text: "大前端",
    // activeMatch: /front-end.*/,
    highlightLink: "/front-end/",
    items: [
      {
        text: "JavaScript",
        link: "/front-end/js/",
        // activeMatch: /front-end\/js.*/,
      },
      { text: "Vue", link: "/front-end/vue/" },
      { text: "环境配置", link: "/front-end/env-config/" },
    ],
  },
  {
    text: "阅读笔记",
    highlightLink: "/read-notes/",
    items: [
      {
        text: "计算机类",
        link: "/read-notes/computer/",
      },
    ],
  },
  {
    text: "碎碎念",
    link: "/self-talking/",
    /*  items: [
      {
        text: "关于目录",
        link: "/about-catalogue/",
      },
    ], */
  },
  {
    text: "小玩意儿",
    items: [
      {
        text: "下班倒计时",
        link: "https://cx-off-duty.zeabur.app/",
      },
    ],
  },
  // { text: "关于作者", link: "https://sugarat.top/aboutme.html" },
];
function help(navList) {
  navList.map((item) => {
    if (item?.link === "/") return;
    const _link: string = (item.link || item.highlightLink) ?? "";

    item.activeMatch = _link.replace(/(.*)\//, "$1.*/");
    if (item.items) {
      help(item.items);
    }
  });
  return navList;
}
export const nav = help(navList);
