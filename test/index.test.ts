import { describe, it, expect } from "vitest";
import { addLeadingZero, messageTemplate, getMessage } from "../src/utils";

describe("utils functions", () => {
  it("addLeadingZero 函数", () => {
    expect(addLeadingZero(0)).toBe("00");
    expect(addLeadingZero(1)).toBe("01");
    expect(addLeadingZero(2)).toBe("02");
    expect(addLeadingZero(12)).toBe("12");
    expect(addLeadingZero(13)).toBe("13");
  });

  it("messageTemplate 函数", () => {
    expect(messageTemplate(0, 0, 0)).toBe(">> 距离下班还有 00小时00分钟00秒");
    expect(messageTemplate(1, 0, 0)).toBe(">> 距离下班还有 01小时00分钟00秒");
    expect(messageTemplate(2, 0, 0)).toBe(">> 距离下班还有 02小时00分钟00秒");
    expect(messageTemplate(12, 0, 0)).toBe(">> 距离下班还有 12小时00分钟00秒");
    expect(messageTemplate(13, 0, 0)).toBe(">> 距离下班还有 13小时00分钟00秒");

    expect(messageTemplate(0, 1, 0)).toBe(">> 距离下班还有 00小时01分钟00秒");
    expect(messageTemplate(0, 2, 0)).toBe(">> 距离下班还有 00小时02分钟00秒");
    expect(messageTemplate(0, 30, 0)).toBe(">> 距离下班还有 00小时30分钟00秒");
    expect(messageTemplate(0, 59, 0)).toBe(">> 距离下班还有 00小时59分钟00秒");

    expect(messageTemplate(0, 0, 1)).toBe(">> 距离下班还有 00小时00分钟01秒");
    expect(messageTemplate(0, 0, 2)).toBe(">> 距离下班还有 00小时00分钟02秒");
    expect(messageTemplate(0, 0, 30)).toBe(">> 距离下班还有 00小时00分钟30秒");
    expect(messageTemplate(0, 0, 59)).toBe(">> 距离下班还有 00小时00分钟59秒");

    expect(messageTemplate(1, 30, 45)).toBe(">> 距离下班还有 01小时30分钟45秒");
    expect(messageTemplate(5, 15, 30)).toBe(">> 距离下班还有 05小时15分钟30秒");
    expect(messageTemplate(10, 45, 20)).toBe(
      ">> 距离下班还有 10小时45分钟20秒"
    );
    expect(messageTemplate(23, 59, 59)).toBe(
      ">> 距离下班还有 23小时59分钟59秒"
    );
  });

  it("getMessage 函数", () => {
    const now = new Date(); // 获取当前日期
    const fixedDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0);

    expect(getMessage(fixedDateTime, { hour: 18, minute: 0 })).toBe(
      ">> 距离下班还有 08小时00分钟00秒"
    );

    expect(getMessage(fixedDateTime, { hour: 18, minute: 10 })).toBe(
      ">> 距离下班还有 08小时10分钟00秒"
    );

    expect(getMessage(fixedDateTime, { hour: 18, minute: 20 })).toBe(
      ">> 距离下班还有 08小时20分钟00秒"
    );

    expect(getMessage(fixedDateTime, { hour: 17, minute: 0 })).toBe(
      ">> 距离下班还有 07小时00分钟00秒"
    );

    expect(getMessage(fixedDateTime, { hour: 10, minute: 0, getOffMessage: "xxxxxxxxxxx" })).toBe(
      "xxxxxxxxxxx"
    );
  });
});
