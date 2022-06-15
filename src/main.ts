import type { DataType, Post } from "./types.ts";
import { getLogByFileName } from "./git.ts";
import { markdownToHtml } from "./markdowntohtml.ts";

async function getPosts(): Promise<DataType> {
  const fileNames = Deno.readDir("./post");
  const data = [] as DataType;
  for await (const _fileName of fileNames) {
    if (_fileName.isFile) {
      const fileName = _fileName.name;
      const slug = fileName.replace(/\.md$/, "");
      const commits = await getLogByFileName(fileName);
      const fileContent = await Deno.readTextFile(`./post/${fileName}`);
      const res = await markdownToHtml(fileContent);
      data.push({ slug, ...res, commits });
    }
  }
  // 按发表时间，从新到旧（不过我不觉得这很科学
  // ~~并且 JavaScript 的对象本来就是无序的，forin 遍历总会打乱~~
  return data.sort((a: Post, b: Post) =>
    new Date(b.commits[0].date).valueOf() -
    new Date(a.commits[0].date).valueOf()
  );
}

const d = JSON.stringify(await getPosts());
await Deno.writeTextFile("./data.json", d);
