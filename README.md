# post

我的博客数据生成器。

受到 Remix 和 Cloudflare Workers 启发，我想到，可以将涉及文件系统的部分分离，SSR 服务器直接 import json
即可，这样前端可以只涉及 Web API。

## 用法

```console
$ deno run --allow-read --allow-run --allow-write --no-check --import-map ./import_map.json ./src/main.ts
```

会生成 `./data.json` 文件。

## 提交

因为使用 git commit message 来给文章添加元数据（作者，修改时间，修订说明），所以提交得讲究。

- 代码更变（包括 README.md）和文档更变分离
- 文档更变一次一篇
- 文档更变的提交信息仅限一行
  - 考虑到更变细节可以从 Github 找到，提交信息点到为止即可。

## 目标

- scheme 稳定
- 尽量涵盖所有信息
- 前端无关（但样式表除外，见下）
- 测试良好（TODO
- 可手动修改数据（按需添加，使用 npm 库 merge
- 兼容多种数据来源（目前有 Markdown，按需添加

## 样式表

因为使用了 [prismjs](https://prismjs.com) 来高亮代码，如果需要，请自行引入主题样式表。

如果不需要，冗余的类属性不会有任何副作用。

## 参考

[Next.js blog starter](https://github.com/vercel/next.js/tree/canary/examples/blog-starter)

## 使用 Deno

主要是因为不会用 node 的 event。return 时怎么等待？

虽说 Deno 的 ReadableStream 也很费解……但毕竟是 Web 标准。
