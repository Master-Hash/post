export type Post = {
  slug: string;
  title: string;
  description: string;
  content: string;
  commits: CommitMeta;
};

export type GreyMatterType = {
  title: string;
  description: string;
  content: string;
};

export type DataType = Array<Post>;

export type CommitMeta = Array<{
  date: string;
  author: string;
  hash: string;
  fullHash: string;
  message: string;
}>;
