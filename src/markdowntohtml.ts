import matter from "gray-matter";
import { unified } from "unified";
import type { Plugin } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypePrism from "rehype-prism-plus";
import rehypeStringify from "rehype-stringify";
import type { GreyMatterType } from "./types.ts";

export async function markdownToHtml(
  fileContent: string,
): Promise<GreyMatterType> {
  const { data: headers, content: markdown } = matter(
    fileContent,
  ) as unknown as {
    content: string;
    data: GreyMatterType;
  };
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrism)
    .use(rehypeStringify as unknown as Plugin[])
    .process(markdown);
  return {
    ...headers,
    content: file.toString(),
  };
}
