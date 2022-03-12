import type { CommitMeta } from "./git.ts";
import { getLogByFileName } from "./git.ts";
import { markdownToHtml } from "./markdowntohtml.ts";

export type Post = {
  slug: string;
  title: string;
  description: string;
  content: string;
  commits: CommitMeta;
};

type DataType = Array<Post>;


async function getPosts(): Promise<DataType> {
  const fileNames = Deno.readDir("./post");
  const data = [] as DataType;
  for await (const _fileName of fileNames) {
    if (_fileName.isFile) {
      const fileName = _fileName.name;
      const slug = fileName.replace(/\.md$/, '');
      const commits = await getLogByFileName(fileName);
      const fileContent = await Deno.readTextFile(`./post/${fileName}`);
      const res = await markdownToHtml(fileContent);
      data.push({ slug, ...res, commits });
    }
  }
  // 按发表时间，从新到旧（不过我不觉得这很科学
  // ~~并且 JavaScript 的对象本来就是无序的，forin 遍历总会打乱~~
  return data.sort((a, b) =>
    new Date(b.commits[0].date).valueOf() - new Date(a.commits[0].date).valueOf()
  );
}

const d = JSON.stringify(await getPosts());
await Deno.writeTextFile("./data.json", d);
