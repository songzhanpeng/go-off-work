import { getOffMessage } from "../constant";
import type { Config } from "../types";

// 补零函数，确保时间显示两位数
export const addLeadingZero = (num: number) => num.toString().padStart(2, "0");

// 消息模版
export const messageTemplate = (
  hour: number,
  minute: number,
  second: number
): string => {
  return `>> 距离下班还有 ${addLeadingZero(hour)}小时${addLeadingZero(
    minute
  )}分钟${addLeadingZero(second)}秒`;
};

// 获取提示消息
export function getMessage(now: Date, config: Config): string {
  const goOffWork = new Date();
  goOffWork.setHours(config.hour, config.minute, 0, 0); // 将秒和毫秒设置为0

  const duration = Math.max(goOffWork.getTime() - now.getTime(), 0);

  if (duration <= 0) {
    return config.getOffMessage || getOffMessage;
  }

  const hour = Math.floor(duration / 1000 / 60 / 60);
  const minute = Math.floor((duration / 1000 / 60) % 60);
  const second = Math.floor((duration / 1000) % 60);

  return messageTemplate(hour, minute, second);
}

