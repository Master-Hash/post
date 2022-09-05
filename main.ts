import { ensureDir, walk } from "std/fs/mod.ts";
import { join, parse, SEP } from "std/path/mod.ts";
import matter from "gray-matter";
import { markdownToComponent } from "./src/mdpipeline.ts";
import { renderToStaticMarkup } from "https://esm.sh/react-dom@18.2.0/server";
import type { FrontMatter, Post } from "./src/types.ts";
import { getLogByPath } from "./src/git.ts";
// import getAtom from "./src/atom.ts";

await ensureDir("./build");

const tData = [] as Array<Post>;
const contentData = new Map<string, string>();

for await (const entry of walk("反思")) {
  console.log(entry.path);
  if (entry.isFile) {
    const f = await Deno.readTextFile(entry.path),
      { name: slug, dir } = parse(entry.path),
      postModule = await markdownToComponent(f),
      { data: _data } = matter(f),
      data = _data as FrontMatter,
      category = dir.split(SEP).at(-1)!,
      commits = await getLogByPath(entry.path);

    const item = {
      slug,
      title: data?.meta?.title,
      description: data?.meta?.description,
      position: data?.position,
      path: encodeURI(`/${dir.replaceAll(SEP, "/")}/${slug}`),
      fspath: "./" +
        (join(
          "./build",
          encodeURI(dir.replaceAll(SEP, "/")),
          encodeURI(slug) + ".jsx",
        )
          .replaceAll(
            SEP,
            "/",
          )),
      category,
      image: (data.meta && "og:image" in data.meta)
        ? data.meta["og:image"]
        : undefined,
      commits,
    } as Post;
    tData.push(item);
    await ensureDir(parse(item.fspath).dir);
    await Deno.writeTextFile(
      item.fspath,
      postModule,
    );
  }
}

await Deno.writeTextFile("./build/data.json", JSON.stringify(tData));

for (const item of tData) {
  const u = encodeURI(item.fspath),
    m = await import(u),
    content = renderToStaticMarkup(m.default());
  contentData.set(item.slug, content);
}

// console.log(getAtom(tData, contentData));
