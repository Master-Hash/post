import { ensureDir, walk } from "std/fs/mod.ts";
import { join, parse, SEP } from "std/path/mod.ts";
import matter from "gray-matter";
import { markdownToComponent } from "./src/mdpipeline.ts";
import { renderToStaticMarkup } from "https://esm.sh/react-dom@18.2.0/server";
import type { FrontMatter, Post } from "./src/types.ts";
import { getLogByPath } from "./src/git.ts";
// import getAtom from "./src/atom.ts";

const dateFormat = new Intl.DateTimeFormat("zh-CN", { dateStyle: "long" });

await ensureDir("./build");

const postData = [] as Array<Post>;

for await (const entry of walk("反思")) {
  console.log(entry.path);
  if (entry.isFile) {
    const _f = await Deno.readTextFile(entry.path),
      commits = await getLogByPath(entry.path),
      { name: slug, dir } = parse(entry.path);
    const f = `${_f}

---

### 修订记录

${
      commits.map((commit) =>
        `- ${
          dateFormat.format(new Date(commit.date))
        } ${commit.message} [${commit.hash}](${commit.fullHash})`
      )
    }`;
    const postModule = await markdownToComponent(f),
      { data: _data } = matter(f),
      data = _data as FrontMatter,
      category = dir.split(SEP).at(-1)!,
      fspath = "./" +
        (join(
          "./build",
          encodeURI(dir.replaceAll(SEP, "/")),
          encodeURI(slug) + ".jsx",
        )
          .replaceAll(
            SEP,
            "/",
          ));

    await ensureDir(parse(fspath).dir);
    await Deno.writeTextFile(
      fspath,
      postModule,
    );

    const u = encodeURI(fspath),
      m = await import(u),
      content = renderToStaticMarkup(m.default());

    const item: Post = {
      slug,
      title: data?.meta?.title,
      description: data?.meta?.description,
      position: data?.position,
      path: encodeURI(`/${dir.replaceAll(SEP, "/")}/${slug}`),
      fspath,
      category,
      content,
      image: (data.meta && "og:image" in data.meta)
        ? data.meta["og:image"]
        : undefined,
      commits,
    };
    postData.push(item);
  }
}

await Deno.writeTextFile("./build/data.json", JSON.stringify(postData));
