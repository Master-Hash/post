# post

我的博客数据生成器。

受到 Remix 和 Cloudflare Workers 启发，我想到，可以将涉及文件系统的部分分离，SSR 服务器直接 import json
即可，这样前端可以只涉及 Web API。

## 生成 `data.json`

```console
$ deno task dump
```

会在根目录生成 `./data.json` 文件。

## 搜索文章内容

因为我写不过 Github 自带的搜索，我放弃了自己的搜索实现（无论是服务端还是客户端）。

现有方案如下：

- `/search?q={searchTerms}`，将 302 重定向到 Github
- `https://github.com/search?q={searchTerms}+repo%3AMaster-Hash%2Fpost+language%3AMarkdown&type=Code+path%3Apost`
- 添加 OpenSearch 搜索引擎，将直接访问 Github
- 使用 vscode 全局搜索，包括：
  - [Github web editor](https://github.dev/Master-Hash/post) 需登录 github.com
  - [vscode.dev](https://vscode.dev/github/Master-Hash/post) 需拉取 Github OAuth2
    认证，国内慎用
  - 本地使用 Github Repositories 拓展打开远程仓库
  - 本地克隆仓库

话说 vscode 里面不仅是搜索，直接看 markdown 都很不错。~~我的前端几斤几两，我还算有数~~

## 提交

因为使用 git commit message 来给文章添加元数据（作者，修改时间，修订说明），所以提交得讲究。

- 代码更变（包括 README.md）和文档更变分离
- 文档更变**一次一篇**
- 文档更变的提交信息**仅限一行**（换行符会变成空格）
- 考虑到更变细节可以从 Github 找到，提交信息点到为止即可。
- 为避免 Github 污染提交信息，不应合并草稿，而应当**在本地变基**。

## 目标

- scheme 稳定
  - 尽量涵盖所有信息，宁滥勿缺
- 少拓展 CommonMark 语法
- 少依赖特定前端样式
- 测试良好（TODO
- 可手动修改数据（按需添加，使用 npm 库 merge
- 兼容多种数据来源（目前有 Markdown，按需添加

## 兼容性

[micromark README](https://github.com/micromark/micromark#extending-markdown)
介绍了四种拓展 CommonMark 的方式，强烈推荐阅读。

如其所言，拓展 markdown 语法会降低 markdown 兼容性，拓展 HTML 内容会降低前端兼容性（例如引入样式表）。

### Markdown 语法拓展

目前拓展：

- frontmatter
  - title（需与 `# title` 重复）
  - description（按需求，与正文开头内容重复）
- 代码高亮（[prismjs](https://prismjs.com/)）

都是非常常见的功能，几乎遇不上兼容性问题。

或许以后需要别的：

- 尾注
- 数学公式

暂时不考虑实现，而用手写 markdown 和 插入图片（如 zhihu tex，OneNote 手绘图）代替。

### 样式表

本仓库使用了 prismjs 来高亮代码。这对不需要语法高亮的项目没有副作用。如果需要，请自行引入主题样式表。

## 分类方案

我还没想通分类怎么处理。估计只有再积累一定量，才有本事开专栏吧。

暂时没有机会在 `./post` 文件夹里开子文件夹来表示专栏的计划，也没有通过文件头加标签或分类的计划。

## 代码参考

[Next.js blog starter](https://github.com/vercel/next.js/tree/canary/examples/blog-starter)
