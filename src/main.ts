import type { CommitMeta } from "./git.ts";
import { getLogByFileName } from "./git.ts";
import { markdownToHtml } from "./markdowntohtml.ts";
import matter from "gray-matter";

type DataType = {
  [slug: string]: {
    content: string;
    commits: CommitMeta;
  };
};

async function getPosts(): Promise<DataType> {
  const fileNames = Deno.readDir("./post");
  const data = {} as DataType;
  for await (const _fileName of fileNames) {
    if (_fileName.isFile) {
      const fileName = _fileName.name;
      const slug = fileName.replace(/\.md$/, '');
      const x = await getLogByFileName(fileName);
      const fileContent = await Deno.readTextFile(`./post/${fileName}`);
      const { data: headers, content } = matter(fileContent);
      data[slug] = { content: await markdownToHtml(content), ...headers, commits: x };
    }
  }
  return data;
}

const d = JSON.stringify(await getPosts());
await Deno.writeTextFile("./data.json", d);
