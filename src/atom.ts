import { Feed } from "https://esm.sh/feed";
import { SITEURL } from "./constant.ts";

export default function generateAtom(posts) {
  const feed = new Feed({
    title: "Hashland",
    description: "文章合集",
    id: `${SITEURL}/`,
    copyright: "公共领域",
    favicon: `${SITEURL}/favicon.svg`,
  });

  posts.forEach((post) => {
    feed.addItem({
      published: new Date(post.commits[0].date),
      link: `${SITEURL}/post/${post.slug}`,
      title: post.title,
      author: [
        ...new Set(post.commits
          .map((commit) => commit.author)),
      ].map((author) => {
        return { name: author };
      }),
      image: post.image,
      content: post.content,
      description: post.description,
      date: new Date(post.commits.at(-1).date),
      // date: new Date(post.commits[post.commits.length - 1].date),
    });
  });
}
