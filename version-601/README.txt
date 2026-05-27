热门片库静态电影网站

生成内容：
- 影片数据解析数量：2000
- 影片详情页：2000 个，位于 movies/ 目录
- 分类页：256 个，位于 categories/ 目录
- 核心页面：首页 index.html、分类 categories.html、全部影片 movies.html、排行榜 rank.html、搜索 search.html、站内地图 sitemap.html

部署方式：
1. 将 ZIP 解压到任意静态服务器目录。
2. 顶级目录可放入 1.jpg 到 150.jpg，页面会自动按影片序号循环引用这些封面图。
3. 详情页播放器使用 m3u8 地址与 HLS 初始化逻辑；现代浏览器建议保持网络可访问 hls.js CDN。

注意：
- 所有 HTML 页面已插入百度统计脚本。
- 重要影片内容已写入静态 HTML，便于搜索引擎抓取。
