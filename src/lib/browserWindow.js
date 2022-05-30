const { BrowserWindow } = require('electron');

/**
 * 注意:此类只能在主进程中使用
 */


module.exports = {
  // 显示登录窗口
  showLoginWindow() {
    const win = new BrowserWindow({
      width: 400,
      height: 400,
      // frame: false,
      webPreferences: {
        // 是否注入nodeapi
        nodeIntegration: true,
        // 渲染进程是否启用remote模块
        enableRemoteModule: true,
      },
    });
    win.loadFile('src/html/login.html');
  },

  // 显示上传图片窗口
  showUploadImageWindow(filePath) {
    const win = new BrowserWindow({
      width: 600,
      height: 800,
      // frame: false,
      webPreferences: {
        // 是否注入nodeapi
        nodeIntegration: true,
        // 渲染进程是否启用remote模块
        enableRemoteModule: true,
      },
    });
    win.loadFile('src/html/uploadImage.html');

    // 发送消息
    win.webContents.on('did-finish-load', () => {
      win.webContents.send('file-path-event', filePath);
    });
  },

  // 显示上传博客园窗口
  showUploadCNBlogWindow(filePath) {
    const win = new BrowserWindow({
      width: 600,
      height: 800,
      // frame: false,
      webPreferences: {
        // 是否注入nodeapi
        nodeIntegration: true,
        // 渲染进程是否启用remote模块
        enableRemoteModule: true,
      },
    });
    win.loadFile('src/html/uploadCNBlog.html');

    // 发送消息
    win.webContents.on('did-finish-load', () => {
      win.webContents.send('file-path-event', filePath);
    });
  },
};
