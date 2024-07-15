import fs from "fs";
import path from "path";
import util from "util";
import { DocInfoWithFilePath, SearchDocument } from "../../types";
import { parse } from "./parse";
import { debugVerbose } from "./debug";

const readFileAsync = util.promisify(fs.readFile);

let nextDocId = 0;
const getNextDocId = () => {
  return (nextDocId += 1);
};

function getSlicedHash(hash: string, url: string) {
  if (hash.includes("#") && !hash.startsWith("#")) {
    if (hash.startsWith(url) && hash[url.length] === "#") {
      return hash.slice(url.length);
    }
    return false;
  }
  return hash;
}

export async function scanDocuments(
  DocInfoWithFilePathList: DocInfoWithFilePath[]
): Promise<SearchDocument[][]> {
  const titleDocuments: SearchDocument[] = [];
  const headingDocuments: SearchDocument[] = [];
  const contentDocuments: SearchDocument[] = [];
  const allDocuments = [titleDocuments, headingDocuments, contentDocuments];

  await Promise.all(
    DocInfoWithFilePathList.map(async ({ filePath, url, type }) => {
      debugVerbose(
        `parsing %s file %o of %o`,
        type,
        path.relative(process.cwd(), filePath),
        url
      );

      const html = await readFileAsync(filePath, { encoding: "utf8" });
      const { pageTitle, sections, breadcrumb } = parse(html, type, url);

      const titleId = getNextDocId();

      titleDocuments.push({
        i: titleId,
        t: pageTitle,
        u: url,
        b: breadcrumb,
      });

      for (const section of sections) {
        const slicedHash = getSlicedHash(section.hash, url);

        if (section.title !== pageTitle) {

          if (typeof slicedHash === 'boolean' && slicedHash === false) {
            continue;
          }

          headingDocuments.push({
            i: getNextDocId(),
            t: section.title,
            u: url,
            h: slicedHash,
            p: titleId,
          });
        }

        if (section.content) {

          if (typeof slicedHash === 'boolean' && slicedHash === false) {
            continue;
          }

          contentDocuments.push({
            i: getNextDocId(),
            t: section.content,
            s: section.title || pageTitle,
            u: url,
            h: slicedHash,
            p: titleId,
          });
        }
      }
    })
  );
  return allDocuments;
}
