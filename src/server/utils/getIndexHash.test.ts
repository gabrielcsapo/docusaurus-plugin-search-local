import fs from "fs";
import klawSync from "klaw-sync";
import { PluginConfig } from "../../types";
import { getIndexHash } from "./getIndexHash";

describe("getIndexHash", () => {
  let mockConsoleWarn;

  beforeEach(() => {
    vi.mock("klaw-sync");
    vi.mock("fs");

    mockConsoleWarn = vi
      .spyOn(console, "warn")
      .mockImplementation(() => void 0);

    vi.mock(
      "../../../../package.json",
      () => ({
        version: "0.0.0",
      }),
      {
        virtual: true,
      }
    );

    (klawSync as vi.MockedFunction<typeof klawSync>).mockImplementation(
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
      fs.readFileSync as vi.MockedFunction<typeof fs.readFileSync>
    ).mockImplementation((filePath: fs.PathOrFileDescriptor) => {
      if (typeof filePath === "string" && filePath.endsWith(".md")) {
        return Buffer.from(filePath);
      }
      throw new Error(`Unknown file: ${filePath}`);
    });

    (
      fs.existsSync as vi.MockedFunction<typeof fs.existsSync>
    ).mockImplementation((filePath: fs.PathOrFileDescriptor) => {
      if (typeof filePath === "string") {
        return filePath.startsWith("/tmp/");
      }

      return false;
    });

    (fs.lstatSync as vi.MockedFunction<typeof fs.lstatSync>).mockImplementation(
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
  });

  test.each<[Partial<PluginConfig>, string | null, number]>([
    [{ hashed: false }, 0],
    [{ hashed: true, indexDocs: true, docsDir: ["/tmp/docs"] }, 0],
    [{ hashed: true, indexBlog: true, blogDir: ["/tmp/blog"] }, 0],
    [{ hashed: true, indexDocs: true, docsDir: ["/does-not-exist/docs"] }, 1],
    [{ hashed: true, indexDocs: true, docsDir: ["/tmp/index.js"] }, 1],
  ])("getIndexHash(%j) should return '%s'", (config, warnCount) => {
    expect(getIndexHash(config as PluginConfig)).toMatchSnapshot();
    expect(mockConsoleWarn).toBeCalledTimes(warnCount);
  });
});
