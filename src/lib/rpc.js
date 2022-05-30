// 引入包
const xmlrpc = require('xmlrpc');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

// 博客园rpc地址前缀
const rpcUrl = 'https://rpc.cnblogs.com/metaweblog/';

// 博客园的rpc方法
const rpcMethod = {
  // 获取用户信息的方法
  getUsersBlogs: 'blogger.getUsersBlogs',
  // 上传图片的方法
  newMediaObject: 'metaWeblog.newMediaObject',
  // 获取分类的方法
  getCategories: 'metaWeblog.getCategories',
  // 上传博客的方法
  newPost: 'metaWeblog.newPost',
  // 获取所有博客的方法，分页
  getRecentPosts: 'metaWeblog.getRecentPosts',
  // 获取所有博客的方法
  getPost: 'metaWeblog.getPost',
};

module.exports = {
  /**
   * 获取用户信息
   * @param username 用户名
   * @param password 密码
   * @param callback rpc回调
   */
  getUsersBlogs(username, password, callback) {
    // 创建xmlRpc客户端
    const client = xmlrpc.createSecureClient({ url: rpcUrl + username });
    // 调用
    client.methodCall(rpcMethod.getUsersBlogs, [
      'appkey',
      username,
      password,
    ], callback);
  },

  /**
   * 上传图片
   * @param blogId 博客id
   * @param username 用户名
   * @param password 密码
   * @param file 文件路径
      @base64 bits 文件字节流的base64字符串
        @string name 文件名
        @string type 文件类型  注意是mime类型
    * @param callback
    */
  newMediaObject(blogId, username, password, file, callback) {
    // 创建xmlRpc客户端
    const client = xmlrpc.createSecureClient({ url: rpcUrl + username });
    // 文件参数结构
    const fileParams = {
      bits: Buffer.from(fs.readFileSync(file).toString('base64'), 'base64'),
      name: path.basename(file),
      type: mime.getType(file),
    };
    // 调用
    client.methodCall(rpcMethod.newMediaObject, [
      blogId,
      username,
      password,
      fileParams,
    ], callback);
  },

  /**
   * 获取用户博客分类
   * @param blogId 博客id
   * @param username 用户名
   * @param password 密码
   * @param callback
   */
  getCategories(blogId, username, password, callback) {
    // 创建xmlRpc客户端
    const client = xmlrpc.createSecureClient({ url: rpcUrl + username });
    // 调用
    client.methodCall(rpcMethod.getCategories, [
      blogId,
      username,
      password,
    ], callback);
  },

  /**
   * 过滤rpc获取的博客分类，返回个人的随笔分类 和 [Markdown] 分类
   * @param categories rpc获取的博客分类数组值
   * @returns {[]}
   *
   * 数组item 对象示例
   * {
      description: '[随笔分类]杂谈',
      htmlUrl: '',
      rssUrl: '',
      title: '杂谈',
      categoryid: '1616829'
    }
    */
  getMyCategory(categories) {
    const result = [];
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].title.indexOf('[随笔分类]') === -1) {
        continue;
      }
      // 保持原来的
      // categories[i].title = categories[i].title.substring('[随笔分类]'.length);
      result.push(categories[i]);
    }
    return result;
  },


  /**
   * 发布博客的方法
   * @param blogId 博客id
   * @param username 用户名
   * @param password 密码
   * @param filePath 要发布的markdown文件路径
   * @param categories 选定的分类
   * @param delFirstRow 是否删除第一行
   * @param publish 是否发布
   * @param callback
   */
  newPost(blogId, username, password, filePath, categories = [], delFirstRow = true, publish = true, callback) {
    // 创建xmlRpc客户端
    const client = xmlrpc.createSecureClient({ url: rpcUrl + username });

    /**
    @param post 博客参数对象
    @dateTime  dateCreated 创建日期 - 发布时必填。
    @string description  - 发布时必填。
    @string title  - 发布时必填。
    @arrayofstring categories 类别（可选）值为 分类名 如果是markdown 格式发布  必须带上 [Markdown]分类
    @struct 附件 enclosure （可选）
    @integer length (optional)
    @string type (optional)
    @string url (optional)
    @string link 链接 （可选）
    @string permalink 永久链接 （可选）
    @any postid （可选）
    @struct source （可选）
    @string name （可选）
    @string url （可选）
    @string userid （可选）
    @any mt_allow_comments (optional)
    @any mt_allow_pings (optional)
    @any mt_convert_breaks (optional)
    @string mt_text_more (optional)
    @string mt_excerpt (optional)
    @string mt_keywords (optional)
    @string wp_slug (optional)
    */

    // 获取文件名
    let filename = path.basename(filePath, path.extname(filePath));
    // 判断是否带有-cnblog, 如果有则截取
    if (filename.indexOf('-cnblog') !== -1) {
      filename = filename.substring(0, filename.indexOf('-cnblog'));
    }

    let mdContent = fs.readFileSync(filePath).toString();
    // 删除第一行
    if (delFirstRow === true) {
      mdContent = mdContent.substring(mdContent.indexOf('\n') + 1);
    }

    // 加上[Markdown]分类
    categories.push('[Markdown]');
    const post = {
      dateCreated: new Date(),
      description: mdContent,
      title: filename,
      categories,
    };

    // 调用
    client.methodCall(rpcMethod.newPost, [
      blogId,
      username,
      password,
      post,
      publish,
    ], callback);
  },

  /**
   * 获取现有的博客列表,分页
   * @param {int} blogId 博客id
   * @param {string} username 博客用户名
   * @param {string} password 博客密码
   * @param {int} numberOfPosts 返回多少篇
   * @param {Function} callback 回调函数
   */
  getRecentPosts(blogId, username, password, numberOfPosts, callback) {
    // 创建xmlRpc客户端
    const client = xmlrpc.createSecureClient({ url: rpcUrl + username });
    // 调用
    client.methodCall(rpcMethod.getRecentPosts, [
      blogId,
      username,
      password,
      numberOfPosts,
    ], callback);
  },


  /**
   * 获取单个博客
   * @param {string} postid 帖子id
   * @param {string} username 博客用户名
   * @param {string} password 博客密码
   * @param {Function} callback 回调函数
   */
  getPost(postid, username, password, callback) {
    // 创建xmlRpc客户端
    const client = xmlrpc.createSecureClient({ url: rpcUrl + username });
    // 调用
    client.methodCall(rpcMethod.getPost, [
      postid,
      username,
      password,
    ], callback);
  },
};
