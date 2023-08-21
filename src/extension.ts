import * as vscode from 'vscode';

const GetOffMessage = '已经下班啦~ 赶紧滚回家去';
const NotificationMessage = '到点啦~ 该下班了!';

let timer: NodeJS.Timeout | undefined;
let statusBar: vscode.StatusBarItem | undefined;

// 创建并显示状态栏消息
function showStatusBarMessage(message: string) {
	if (statusBar) {
		statusBar.dispose();
	}

	statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
	statusBar.text = message;
	statusBar.show();
}

// 获取提示消息
function getMessage(config: any) {
	const now = new Date();
	const goOffWork = new Date();
	goOffWork.setHours(config.hour);
	goOffWork.setMinutes(config.minute);
	goOffWork.setSeconds(0);
	
	const duration = goOffWork.getTime() - now.getTime();
	if (duration <= 0) {
		return GetOffMessage;
	}

	const hour = Math.floor(duration / 1000 / 60 / 60);
	const minute = Math.floor(duration / 1000 / 60 % 60);
	const second = Math.floor(duration / 1000 % 60);

	// 补零函数，确保时间显示两位数
	const addLeadingZero = (num: number) => num.toString().padStart(2, '0');

	return `>> 距离下班还有 ${hour ? addLeadingZero(hour) + '小时' : ''}${minute ? addLeadingZero(minute) + '分钟' : ''}${second ? addLeadingZero(second) + '秒' : ''}`;
}

// 更新状态栏项
function updateStatusBarItem(config: any) {
	const newMessage = getMessage(config);
	showStatusBarMessage(newMessage);

	if (newMessage === GetOffMessage) {
		vscode.window.showInformationMessage(NotificationMessage);
		clearInterval(timer!);
	} else {
		timer = setTimeout(() => {
			statusBar?.dispose();
			updateStatusBarItem(config);
		}, 1000);
	}
}

// 设置下班时间的命令
function setGoOffWorkTime() {
	const config = vscode.workspace.getConfiguration().get('goOffWork');
	vscode.window.showInputBox({ placeHolder: '请输入下班时间（HH:mm）' }).then(inputValue => {
		if (inputValue) {
			const [hour, minute] = inputValue.split(':');
			if (!isNaN(Number(hour)) && !isNaN(Number(minute))) {
				vscode.workspace.getConfiguration().update('goOffWork.hour', Number(hour), vscode.ConfigurationTarget.Global);
				vscode.workspace.getConfiguration().update('goOffWork.minute', Number(minute), vscode.ConfigurationTarget.Global);
				clearInterval(timer!);
				updateStatusBarItem(config);
			} else {
				vscode.window.showErrorMessage('请输入有效的时间格式（HH:mm）！');
			}
		}
	});
}

export function activate(context: vscode.ExtensionContext) {
	const allConfig = vscode.workspace.getConfiguration();
	let config = allConfig.goOffWork;

	if (!config || typeof config.hour !== 'number' || typeof config.minute !== 'number') {
		vscode.window.showErrorMessage('请正确配置 goOffWork 的 hour 和 minute！');
		return;
	}

	updateStatusBarItem(config);

	// 监听配置变化，在配置变化时重新加载插件
	vscode.workspace.onDidChangeConfiguration((event) => {
		if (event.affectsConfiguration('goOffWork')) {
			config = vscode.workspace.getConfiguration().get('goOffWork');
			updateStatusBarItem(config);
		}
	});

	// 注册设置下班时间的命令
	context.subscriptions.push(vscode.commands.registerCommand('setGoOffWorkTime', setGoOffWorkTime));
}

export function deactivate() {
	if (timer) {
		clearTimeout(timer);
	}
	if (statusBar) {
		statusBar.dispose();
	}
}
