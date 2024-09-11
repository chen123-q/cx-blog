//日期格式化
export function formatDate(date, fmt = "yyyy-MM-dd") {
  if (!(date instanceof Date)) date = new Date(date);
  const opt = {
    "y+": date.getFullYear().toString(), // 年
    "M+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "h+": date.getHours().toString(), // 时
    "m+": date.getMinutes().toString(), // 分
    "s+": date.getSeconds().toString(), // 秒
  };

  for (const k in opt) {
    const ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      if (/(y+)/.test(k)) {
        fmt = fmt.replace(
          ret[1],
          opt[k as keyof typeof opt].substring(4 - ret[1].length)
        );
      } else {
        fmt = fmt.replace(
          ret[1],
          ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
        );
      }
    }
  }
  return fmt;
}
//获取周几
export function today(date = new Date()) {
  const arr = ["日", "一", "二", "三", "四", "五", "六"];
  return "星期" + arr[date.getDay()];
}
//一天时间段
export function timeQuantum(date = new Date()) {
  const hour = date.getHours();
  if (hour < 5) return "凌晨好";
  if (hour < 8) return "早上好";
  if (hour < 11) return "上午好";
  if (hour < 13) return "中午好";
  if (hour < 17) return "下午好";
  if (hour < 19) return "傍晚好";
  if (hour <= 23) return "晚上好";
}

export const getTime = () => {
  const date = new Date();
  const tips = `今天是【${formatDate(date)} / ${today(date)}】,${timeQuantum(
    date
  )}!`;

  return tips;
};
