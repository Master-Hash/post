import { Feed } from "https://esm.sh/feed";
import { SITEURL } from "./constant.ts";
import { Post } from "./types.ts";

export default function generateAtom(
  postsData: Post[],
  contentData: Map<string, string>,
): string {
  const feed = new Feed({
    title: "Hashland",
    description: "文章合集",
    id: `${SITEURL}/`,
    copyright: "公共领域",
    favicon: `${SITEURL}/favicon.svg`,
  });

  postsData.forEach((post) => {
    feed.addItem({
      published: new Date(post.commits[0].date),
      link: `${SITEURL}/${post.path}`,
      title: post.title,
      author: [
        ...new Set(post.commits
          .map((commit) => commit.author)),
      ].map((author) => {
        return { name: author };
      }),
      image: post.image,
      content: contentData.get(post.slug),
      description: post.description,
      date: new Date(post.commits.at(-1)!.date),
    });
  });
  return feed.atom1();
}
