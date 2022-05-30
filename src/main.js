const { app } = require('electron');
const path = require('path');
const bw = require('../src/lib/browserWindow');
const util = require('../src/lib/util');
const md = require('../src/lib/md');

// 应用启动时检查配置文件是否存在
app.on('ready', () => {
  // 配置文件不存在
  if (!util.isLogin()) {
    bw.showLoginWindow();
    return;
  }
  // 参数数组 第一个参数为程序运行路径 后面都是以空格分隔的指令
  const { argv } = process;
  // argv[1] 是注册表中的指令
  // argv[2] 就是文件路径
  let filePath = argv[2];
  if (!path.isAbsolute(filePath)) {
    // 如果不是绝对路径，则将相对路径拼成绝对路径
    filePath = path.join(process.cwd(), filePath);
  }
  switch (argv[1]) {
    case 'read':
      bw.showUploadImageWindow(filePath);
      break;
    case 'upload':
      bw.showUploadCNBlogWindow(filePath);
      break;
    case 'conver-base64':
      md.getMdByBase64(filePath);
      app.quit();
      break;
    default:
      break;
  }
});
