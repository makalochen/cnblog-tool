const { app } = require('electron');
const fs = require('fs');
const path = require('path');

/**
 * 注意:此类只能在主进程中使用
 */

// 当前应用的目录
const appPath = app.isPackaged ? path.dirname(app.getPath('exe')) : app.getAppPath();
// 配置文件路径
const userInfoPath = path.join(appPath, 'cnblog-tool.json');

module.exports = {
  // 检查用户信息配置文件是否存在
  isLogin() {
    return fs.existsSync(userInfoPath);
  },

  // 用戶配置读取
  getUserInfo() {
    // 读取配置
    return JSON.parse(fs.readFileSync(userInfoPath).toString());
  },

  // app自动退出时间 单位毫秒
  appAutoExitTime: 3000,

  // 当前应用目录
  appPath,

  // 用户配置文件路径
  userInfoPath,
};
