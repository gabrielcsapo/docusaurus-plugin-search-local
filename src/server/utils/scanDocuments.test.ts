import path from "path";
import fixturify from "fixturify";
import tmp from "tmp";
import { DocInfoWithFilePath } from "../../types";
import { scanDocuments } from "./scanDocuments";
import { afterEach } from "vitest";

describe("scanDocuments", () => {
  let tmpLocation: tmp.DirResult;
  let projectFixture;

  beforeEach(() => {
    tmpLocation = tmp.dirSync({ unsafeCleanup: true });
    projectFixture = {
      "first.html": `<body>
        <nav>
          <a class="navbar__link navbar__link--active">
            Docs
          <a>
        </nav>
        <div class="main-wrapper">
          <div class="menu">
            <a class="menu__link menu__link--sublist">
              Docs
            </a>
            <a class="menu__link menu__link--active">
              First Doc
            </a>
          </div>
        </div>
        <article>
          <header>
            <h1>Hello First Docs</h1>
          </header>
          <div class="markdown">
            <h2>
              First heading
              <a aria-hidden="true" tabindex="-1" class="hash-link" href="#first-heading" title="Direct link to heading">#</a>
            </h2>
            <ul id="fruits">
              <li class="apple">Apple</li>
              <li class="orange">Orange</li>
              <li class="pear">Pear</li>
            </ul>
            <h3>
              Goodbye fruits.
              <a tabindex="-1" class="hash-link" href="#goodbye-fruits" title="Direct link to heading">#</a>
            </h3>
          </div>
        </article>
      </body>`,
      "second.html": `<body>
        <nav>
          <a class="navbar__link navbar__link--active">
            Docs
          <a>
        </nav>
        <div class="main-wrapper">
          <div class="menu">
            <a class="menu__link menu__link--sublist">
              API
            </a>
            <a class="menu__link menu__link--sublist menu__link--active">
              Guide
            </a>
            <a class="menu__link menu__link--sublist menu__link--active">
              Advanced
            </a>
            <a class="menu__link menu__link--active">
              First Doc
            </a>
          </div>
        </div>
        <article>
          <header>
            <h1>Hello World</h1>
          </header>
          <div class="markdown">
            <h2>
              Hello fruits.
              <a aria-hidden="true" tabindex="-1" class="hash-link" href="#hello-fruits" title="Direct link to heading">#</a>
            </h2>
            <ul id="fruits">
              <li class="apple">Apple</li>
              <li class="orange">Orange</li>
              <li class="pear">Pear</li>
            </ul>
            <h3>
              Goodbye fruits.
              <a tabindex="-1" class="hash-link" href="#goodbye-fruits" title="Direct link to heading">#</a>
            </h3>
          </div>
        </article>
      </body>`,
    };

    fixturify.writeSync(tmpLocation.name, projectFixture);
  });

  afterEach(() => {
    tmpLocation.removeCallback();
  });

  test("should work", async () => {
    const DocInfoWithFilePathList: DocInfoWithFilePath[] = [
      {
        filePath: path.join(tmpLocation.name, "first.html"),
        url: "/1",
        type: "docs",
      },
      {
        filePath: path.join(tmpLocation.name, "second.html"),
        url: "/2",
        type: "page",
      },
    ];

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
            "t": "Hello World",
            "u": "/2",
          },
        ],
        [
          {
            "h": "#first-heading",
            "i": 2,
            "p": 1,
            "t": "First heading",
            "u": "/1",
          },
          {
            "h": "#goodbye-fruits",
            "i": 4,
            "p": 1,
            "t": "Goodbye fruits.",
            "u": "/1",
          },
        ],
        [
          {
            "h": "#first-heading",
            "i": 3,
            "p": 1,
            "s": "First heading",
            "t": "Apple Orange Pear",
            "u": "/1",
          },
        ],
      ]
    `);
  });
});
