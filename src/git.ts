export type CommitMeta = Array<{
  date: string;
  author: string;
  hash: string;
  fullHash: string;
  message: string;
}>;

export async function getLogByFileName(fileName: string): Promise<CommitMeta> {
  const p = Deno.run({
    cmd: [
      "git",
      "-P",
      "log",
      "--date=iso-strict",
      "--pretty=%an|%ad|%h|%H|%s",
      "--reverse",
      "--",
      `post/${fileName}`
    ],
    stdout: "piped"
  });
  const uint8ArrayData = await p.output();
  p.close();
  const stringData = new TextDecoder().decode(uint8ArrayData);
  // 换行符，跨平台的痛
  return stringData.split("\n")
    .filter(line => line)  // 消除空行
    .map((line) => {
      const [author, date, hash, fullHash, message] = line.split("|");
      return { author, date, hash, fullHash, message };
    });
}