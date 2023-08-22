import * as vscode from "vscode";
import { getOffMessage1, notificationMessage } from "./constant";
import type { Config } from ".//types";
import { getMessage } from "./utils";

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

  if (newMessage === getOffMessage) {
    vscode.window.showInformationMessage(notificationMessage);
    clearInterval(timer!);
  } else {
    timer = setTimeout(() => {
      updateStatusBarItem(config);
    }, 1000);
  }
}

// 设置下班时间的命令
function setGoOffWorkTime() {
  const config = vscode.workspace
    .getConfiguration()
    .get<Config>("goOffWork") as Config;
  vscode.window
    .showInputBox({ placeHolder: "请输入下班时间（HH:mm）" })
    .then((inputValue) => {
      if (inputValue) {
        const [hour, minute] = inputValue.split(":");
        if (!isNaN(Number(hour)) && !isNaN(Number(minute))) {
          config.hour = Number(hour);
          config.minute = Number(minute);
          vscode.workspace
            .getConfiguration()
            .update(
              "goOffWork.hour",
              config.hour,
              vscode.ConfigurationTarget.Global
            );
          vscode.workspace
            .getConfiguration()
            .update(
              "goOffWork.minute",
              config.minute,
              vscode.ConfigurationTarget.Global
            );
        } else {
          vscode.window.showErrorMessage("请输入有效的时间格式（HH:mm）！");
        }
      }
    });
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

  // 注册设置下班时间的命令
  context.subscriptions.push(
    vscode.commands.registerCommand("setGoOffWorkTime", setGoOffWorkTime)
  );
}

export function deactivate() {
  if (timer) {
    clearTimeout(timer);
  }
  if (statusBar) {
    statusBar.dispose();
  }
}
