export type CommitMeta = Array<{
  date: string;
  author: string;
  hash: string;
  fullHash: string;
  message: string;
}>;
export type Post = {
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
export type FrontMatter = {
  meta: {
    title: string;
    description: string;
    "og:image"?: string;
  };
  position: number;
};
