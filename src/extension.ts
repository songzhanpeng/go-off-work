import * as vscode from "vscode";
import type { Config } from ".//types";
import { getMessage } from "./utils";
import { getOffMessage, notificationMessage } from "./constant";

let timer: NodeJS.Timeout | undefined;
let statusBar: vscode.StatusBarItem | undefined;

// 创建并显示状态栏消息
function showStatusBarMessage(message: string) {
  if (!statusBar) {
    statusBar = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      0
    );
    statusBar.show();
  }
  statusBar.text = message;
}

// 更新状态栏项
function updateStatusBarItem(config: Config) {
  const newMessage = getMessage(new Date(), config);
  showStatusBarMessage(newMessage);

  if (newMessage === (config.getOffMessage || getOffMessage)) {
    vscode.window.showInformationMessage(
      config.notificationMessage || notificationMessage
    );
    clearInterval(timer!);
  } else {
    timer = setTimeout(() => {
      updateStatusBarItem(config);
    }, 1000);
  }
}

// 设置下班时间的命令
async function setGoOffWorkTime() {
  const config = vscode.workspace
    .getConfiguration()
    .get<Config>("goOffWork") as Config;

  const inputValue = await vscode.window.showInputBox({
    placeHolder: "请输入下班时间（HH:mm）",
  });

  if (inputValue) {
    const [hour, minute] = inputValue.split(":");
    const parsedHour = parseInt(hour, 10);
    const parsedMinute = parseInt(minute, 10);

    if (
      !isNaN(parsedHour) &&
      !isNaN(parsedMinute) &&
      parsedHour >= 0 &&
      parsedHour < 24 &&
      parsedMinute >= 0 &&
      parsedMinute < 60
    ) {
      config.hour = parsedHour;
      config.minute = parsedMinute;

      const configuration = vscode.workspace.getConfiguration();
      await configuration.update(
        "goOffWork.hour",
        config.hour,
        vscode.ConfigurationTarget.Global
      );
      await configuration.update(
        "goOffWork.minute",
        config.minute,
        vscode.ConfigurationTarget.Global
      );

      // 通知
      vscode.window.showInformationMessage(`下班时间设置成功 >> ${inputValue}`);
    } else {
      vscode.window.showErrorMessage(
        `请输入有效的时间格式 (HH:mm) >> ${inputValue} ???`
      );
    }
  }
}

// 设置通知信息 `notificationMessage`
async function setNotificationMessage() {
  const config = vscode.workspace
    .getConfiguration()
    .get<Config>("goOffWork") as Config;

  const inputValue = await vscode.window.showInputBox({
    placeHolder: "请输入通知信息",
  });

  if (inputValue) {
    config.notificationMessage = inputValue;

    const configuration = vscode.workspace.getConfiguration();
    await configuration.update(
      "goOffWork.notificationMessage",
      config.notificationMessage,
      vscode.ConfigurationTarget.Global
    );
  }
}

// 设置提示信息 `getOffMessage`
async function setGetOffMessage() {
  const config = vscode.workspace
    .getConfiguration()
    .get<Config>("goOffWork") as Config;

  const inputValue = await vscode.window.showInputBox({
    placeHolder: "请输入提示信息",
  });

  if (inputValue) {
    config.getOffMessage = inputValue;

    const configuration = vscode.workspace.getConfiguration();
    await configuration.update(
      "goOffWork.getOffMessage",
      config.getOffMessage,
      vscode.ConfigurationTarget.Global
    );
  }
}

export function activate(context: vscode.ExtensionContext) {
  const allConfig = vscode.workspace.getConfiguration();
  let config: Config = allConfig.goOffWork;

  if (
    !config ||
    typeof config.hour !== "number" ||
    typeof config.minute !== "number"
  ) {
    vscode.window.showErrorMessage("请正确配置 goOffWork 的 hour 和 minute！");
    return;
  }

  updateStatusBarItem(config);

  // 监听配置变化，在配置变化时重新加载插件
  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration("goOffWork")) {
      config = vscode.workspace
        .getConfiguration()
        .get<Config>("goOffWork") as Config;
      clearInterval(timer!);
      updateStatusBarItem(config);
    }
  });

  const commandMappings = [
    // 注册设置下班时间的命令
    { command: "setGoOffWorkTime", handler: setGoOffWorkTime },
    // 注册设置通知信息的命令
    { command: "setNotificationMessage", handler: setNotificationMessage },
    // 注册设置提示信息的命令
    { command: "setGetOffMessage", handler: setGetOffMessage },
  ];

  commandMappings.forEach(({ command, handler }) => {
    // 注册命令
    context.subscriptions.push(
      vscode.commands.registerCommand(command, handler)
    );
  });
}

export function deactivate() {
  if (timer) {
    clearTimeout(timer);
  }
  if (statusBar) {
    statusBar.dispose();
  }
}
