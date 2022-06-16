import type { CommitMeta } from "./types.ts";

export async function getLogByFileName(fileName: string): Promise<CommitMeta> {
  const { stdout } = await Deno.spawn("git", {
    args: [
      "-P",
      "log",
      "--date=iso-strict",
      "--pretty=%an|%ad|%h|%H|%s",
      "--reverse",
      "--",
      `post/${fileName}`,
    ],
  });
  const stringData = new TextDecoder().decode(stdout);
  // 换行符，跨平台的痛
  return stringData.split("\n")
    .filter((line) => line) // 消除空行
    .map((line) => {
      const [author, date, hash, fullHash, message] = line.split("|");
      return { author, date, hash, fullHash, message };
    });
}
