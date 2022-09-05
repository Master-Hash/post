import { ensureDir, walk } from "std/fs/mod.ts";
import { join, parse, SEP } from "std/path/mod.ts";
import matter from "gray-matter";
import { markdownToComponent } from "./mdpipeline.ts";
import { renderToStaticMarkup } from "https://esm.sh/react-dom@18.2.0/server";

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
  fspath: string;
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
const contentData = new Map<string, string>();

for await (const entry of walk("灵感")) {
  console.log(entry.path);
  if (entry.isFile) {
    const f = await Deno.readTextFile(entry.path),
      { name: slug, dir } = parse(entry.path),
      postModule = await markdownToComponent(f);
    const { data: _data } = matter(f),
      data = _data as FrontMatter,
      category = dir.split(SEP).at(-1)!;

    const item = {
      slug,
      title: data?.meta?.title,
      description: data?.meta?.description,
      position: data?.position,
      path: encodeURI(`/${dir.replaceAll(SEP, "/")}/${slug}`),
      fspath: "./" +
        (join("./build", encodeURI(category), encodeURI(slug) + ".jsx")
          .replaceAll(
            SEP,
            "/",
          )),
      category,
      image: (data.meta && "og:image" in data.meta)
        ? data.meta["og:image"]
        : undefined,
    } as Post;
    tData.push(item);

    /**
     * @todo git commit message
     */
    await ensureDir(parse(item.fspath).dir);
    // await Deno.writeTextFile(
    //   item.fspath,
    //   postModule,
    // );
  }
}

// await Deno.writeTextFile("./data1.json", JSON.stringify(tData));

/**
 * @todo atom
 */
for (const item of tData) {
  const u = encodeURI(item.fspath);
  const m = await import(u);
  const content = renderToStaticMarkup(m.default());
  console.log(content);
  contentData.set(item.slug, content);
}
