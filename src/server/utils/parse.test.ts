import { ParsedDocument } from "../../shared/interfaces";
import { parse } from "./parse";

type TestCaseData = [string, "docs" | "blog" | "page", ParsedDocument];

describe("parse", () => {
  const testCase1: TestCaseData = [
    `<body>
      <article>
        <header>
          <h1>Hello World</h1>
        </header>
        <main>
          Peace.
          <div class="mdxCodeBlock_abc">
            Code.
            <button>Copy</button>
          </div>
        </main>
      </article>
    </body>`,
    "page",
    {
      pageTitle: "Hello World",
      sections: [
        {
          title: "Hello World",
          hash: "",
          content: "Peace. Code.",
        },
      ],
      breadcrumb: [],
    },
  ];

  const testCase2: TestCaseData = [
    `<body>
      <article>
        <header>
          <h1>Hello World</h1>
        </header>
        <main>
          <span class="badge">Version:1.0.0</span>
          Peace.
        </main>
      </article>
    </body>`,
    "docs",
    {
      pageTitle: "Hello World",
      sections: [
        {
          title: "Hello World",
          hash: "",
          content: "Peace.",
        },
      ],
      breadcrumb: [],
    },
  ];

  test("parse(testCase1) should work", () => {
    const [html, type, doc] = testCase1;
    expect(parse(html, type, "")).toEqual(doc);
  });

  test.skip("parse(testCase2) should work", () => {
    const [html, type, doc] = testCase2;
    expect(parse(html, type, "")).toEqual(doc);
  });
});
