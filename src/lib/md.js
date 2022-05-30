const fs = require('fs');
const path = require('path');
const mineType = require('mime-types');

module.exports = {
  // 获取图片的绝对路径
  getImageAbsolutePath(file_path, image_path) {
    if (path.isAbsolute(image_path)) {
      return image_path;
    }
    // 图片文件的绝对路径 = 获取md文件的绝对路径中的文件夹部分 + 相对路径
    return path.join(path.dirname(path.resolve(file_path)), image_path);
  },

  // 获取md文件中的所有本地图片,只返回文件存在的路径
  getAllLocalImage(file_path) {
    const content = fs.readFileSync(file_path).toString();
    // eslint-disable-next-line no-useless-escape
    const pattern = /(?<=\!\[.*\]\()(.+)(?=\))/g;
    // 返回匹配结构并只保留本地图片 和 本地文件存在的
    return content.match(pattern).filter((item) => { return item.substr(0, 4) !== 'http' && fs.existsSync(this.getImageAbsolutePath(file_path, item)); });
  },


  /**
   * 将图片文件转换成base64 字符串
   * @param {string} filePath 文件路径
   * @returns base64格式的图片文件
   */
  fileConverBase64(filePath) {
    const readable = fs.readFileSync(filePath, 'binary');
    const base64 = Buffer.from(readable, 'binary').toString('base64');
    return `data:${mineType.lookup(filePath)};base64,${base64}`;
  },

  /**
   * 将markdown文件中的图片转换成base64格式，并返回新的文件路径
   * @param {string} filePath 文件路径
   * @returns 新的文件路径
   */
  getMdByBase64(filePath) {
    // 判断文件是否存在
    if (!fs.existsSync(filePath)) {
      return false;
    }
    // 获取所有有效路径
    const imageList = this.getAllLocalImage(filePath);
    if (imageList.length === 0) {
      return false;
    }
    // 目标路径
    const filename = `${path.basename(filePath, path.extname(filePath))}-base64-cnblog${path.extname(filePath)}`;
    const outFilePath = path.join(path.dirname(filePath), filename);
    // 复制文件
    fs.copyFileSync(filePath, outFilePath);
    // 文件内容
    let fileContent = fs.readFileSync(outFilePath).toString();

    // 遍历图片,转换成base64
    imageList.forEach((item) => {
      // 图片的绝对路径
      const absolutePath = this.getImageAbsolutePath(filePath, item);
      const imgName = path.basename(absolutePath, path.extname(absolutePath));
      // 替换文件内容对象的链接,为了保证路径使用模板,转换成base64 格式
      fileContent = fileContent.replace(String.raw`(${item})`, `[${imgName}]`);
      // 追加写入
      fileContent += `\n[${imgName}]:${this.fileConverBase64(absolutePath)}\n`;
    });
    // 写入文件内容
    fs.writeFileSync(outFilePath, fileContent);
    return outFilePath;
  },
};
