// import type { Plugin } from "unified";
import rehypePrism from "rehype-prism-plus";
import rehypeRaw from "rehype-raw";
// import remarkFrontmatter from "remark-frontmatter";
// import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { compile } from "@mdx-js/mdx";

export async function markdownToComponent(
  fileContent: string,
): Promise<string> {
  const res = await compile(fileContent, {
    jsx: true,
    format: "md",
    remarkPlugins: [
      // remarkFrontmatter as Plugin,
      // remarkMdxFrontmatter,
    ],
    remarkRehypeOptions: [],
    rehypePlugins: [rehypeRaw, rehypePrism],
    recmaPlugins: [],
  });
  return res.toString();
}
