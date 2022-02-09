import fs from "fs";
import klawSync from "klaw-sync";
import { PluginConfig } from "../../shared/types";
import { getIndexHash } from "./getIndexHash";

jest.mock("klaw-sync");
jest.mock("fs");
const mockConsoleWarn = jest
  .spyOn(console, "warn")
  .mockImplementation(() => void 0);

jest.mock(
  "../../../../package.json",
  () => ({
    version: "0.0.0",
  }),
  {
    virtual: true,
  }
);

(klawSync as jest.MockedFunction<typeof klawSync>).mockImplementation(
  (root, options) => {
    let files: string[] = [];
    if (root === "/tmp/docs") {
      files = ["/tmp/docs/a.md", "/tmp/docs/b.md", "/tmp/docs/b.png"];
    }

    const items = files.map((path) => ({ path } as klawSync.Item));

    return options?.filter ? items.filter(options.filter) : items;
  }
);

(
  fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>
).mockImplementation((filePath: fs.PathOrFileDescriptor) => {
  if (typeof filePath === "string" && filePath.endsWith(".md")) {
    return Buffer.from(filePath);
  }
  throw new Error(`Unknown file: ${filePath}`);
});

(fs.existsSync as jest.MockedFunction<typeof fs.existsSync>).mockImplementation(
  (filePath: fs.PathOrFileDescriptor) => {
    if (typeof filePath === "string") {
      return filePath.startsWith("/tmp/");
    }

    return false;
  }
);

(fs.lstatSync as jest.MockedFunction<typeof fs.lstatSync>).mockImplementation(
  (filePath: fs.PathOrFileDescriptor) => {
    return {
      isDirectory: () => {
        if (typeof filePath === "string") {
          return !filePath.includes(".");
        }
      },
    } as fs.Stats;
  }
);

describe("getIndexHash", () => {
  test.each<[Partial<PluginConfig>, string | null, number]>([
    [{ hashed: false }, null, 0],
    [{ hashed: true, indexDocs: true, docsDir: ["/tmp/docs"] }, "87def35c", 0],
    [{ hashed: true, indexBlog: true, blogDir: ["/tmp/blog"] }, null, 0],
    [
      { hashed: true, indexDocs: true, docsDir: ["/does-not-exist/docs"] },
      null,
      1,
    ],
    [{ hashed: true, indexDocs: true, docsDir: ["/tmp/index.js"] }, null, 1],
  ])("getIndexHash(%j) should return '%s'", (config, hash, warnCount) => {
    expect(getIndexHash(config as PluginConfig)).toBe(hash);
    expect(mockConsoleWarn).toBeCalledTimes(warnCount);
  });
});
