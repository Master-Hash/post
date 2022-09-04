import { ensureDir, walk } from "https://deno.land/std@0.154.0/fs/mod.ts";
import { join, parse, SEP } from "https://deno.land/std@0.154.0/path/mod.ts";
import { compile } from "https://esm.sh/@mdx-js/mdx@2.1.3";
import matter from "gray-matter";

await ensureDir("./build");

type CommitMeta = Array<{
  date: string;
  author: string;
  hash: string;
  fullHash: string;
  message: string;
}>;

type Post = {
  slug: string;
  path: string;
  title: string;
  category: string;
  position?: number;
  description: string;
  image?: string;
  commits?: CommitMeta;
};

type FrontMatter = {
  meta: {
    title: string;
    description: string;
    "og:image"?: string;
  };
  position: number;
};

const tData = [] as Array<Post>;

for await (const entry of walk("灵感")) {
  console.log(entry.path);
  if (entry.isFile) {
    /**
     * @todo 分离编译逻辑
     */
    const f = await Deno.readTextFile(entry.path),
      { name: slug, dir } = parse(entry.path),
      postModule = await compile(f, {
        jsx: true,
        format: "md",
      });
    const { data: _data } = matter(f),
      data = _data as FrontMatter;

    const item = {
      slug,
      title: data?.meta?.title,
      description: data?.meta?.description,
      position: data?.position,
      path: encodeURI(`/${dir.replaceAll(SEP, "/")}/${slug}`),
      category: dir.split(SEP).at(-1),
      image: (data.meta && "og:image" in data.meta)
        ? data.meta["og:image"]
        : undefined,
    } as Post;
    tData.push(item);

    /**
     * @todo git commit message
     */
    await ensureDir(join("./build", encodeURI(dir)));
    await Deno.writeTextFile(
      join("./build", encodeURI(dir), encodeURI(slug) + ".jsx"),
      postModule.toString(),
    );
  }
}

await Deno.writeTextFile("./data1.json", JSON.stringify(tData));
