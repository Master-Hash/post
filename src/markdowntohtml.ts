import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypePrism from "rehype-prism-plus";
import rehypeStringify from "rehype-stringify";

export async function markdownToHtml(fileContent: string): Promise<{
  title: string;
  description: string;
  content: string;
}> {
  const { data: headers, content: markdown } = matter(fileContent);
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrism)
    .use(rehypeStringify)
    .process(markdown);
  return {
    ...headers,
    content: file.toString(),
  };
}
