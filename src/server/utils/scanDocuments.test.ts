import fs from "fs";
import { parse } from "./parse";
import { DocInfoWithFilePath } from "../../types";

fs.readFile;

vi.mock("./parse");
vi.spyOn(fs, "readFile").mockImplementation(((
  filePath: string,
  options: null,
  callback: (err: NodeJS.ErrnoException | null, data: Buffer | string) => void
) => {
  callback(null, filePath);
}) as unknown as any);

import { scanDocuments } from "./scanDocuments";

const mockParse = parse as vi.MockedFunction<typeof parse>;

describe("scanDocuments", () => {
  test("should work", async () => {
    const DocInfoWithFilePathList: DocInfoWithFilePath[] = [
      {
        filePath: "/tmp/1",
        url: "/1",
        type: "docs",
      },
      {
        filePath: "/tmp/2",
        url: "/2",
        type: "page",
      },
    ];
    mockParse.mockImplementation((html) => {
      if (html.includes("1")) {
        return {
          pageTitle: "Hello First Docs",
          sections: [
            {
              title: "Hello First Docs",
              hash: "",
              content: "Leading content.",
            },
            {
              title: "First heading",
              hash: "#first-heading",
              content: "First content.",
            },
          ],
          breadcrumb: ["Docs"],
        };
      } else {
        return {
          pageTitle: "Hello First Page",
          sections: [
            {
              title: "Hello First Page",
              hash: "",
              content: "",
            },
          ],
          breadcrumb: [],
        };
      }
    });
    const allDocuments = await scanDocuments(DocInfoWithFilePathList);
    expect(allDocuments).toMatchInlineSnapshot(`
      [
        [
          {
            "b": [
              "Docs",
            ],
            "i": 1,
            "t": "Hello First Docs",
            "u": "/1",
          },
          {
            "b": [],
            "i": 5,
            "t": "Hello First Page",
            "u": "/2",
          },
        ],
        [
          {
            "h": "#first-heading",
            "i": 3,
            "p": 1,
            "t": "First heading",
            "u": "/1",
          },
        ],
        [
          {
            "h": "",
            "i": 2,
            "p": 1,
            "s": "Hello First Docs",
            "t": "Leading content.",
            "u": "/1",
          },
          {
            "h": "#first-heading",
            "i": 4,
            "p": 1,
            "s": "First heading",
            "t": "First content.",
            "u": "/1",
          },
        ],
      ]
    `);
  });
});
