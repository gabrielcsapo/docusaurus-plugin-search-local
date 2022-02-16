const css = require("@parcel/css");
const fs = require("fs");
const klaw = require("klaw-sync");
const path = require("path");

/**
 * @param {klaw.Item} item
 * @returns {boolean}
 */
function cssFilter(item) {
  return item.path.endsWith("css");
}

/**
 * @param {string} filePath - Path to the css file we want to transform.
 */
function moveCSS(filePath) {
  const file = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);

  let { code } = css.transform({
    filename: fileName,
    code: file,
  });

  console.log(fileName);
  console.log(code.toString());
}

function main() {
  const srcPath = path.resolve(__dirname, "..", "..", "src");
  const cssFiles = klaw(srcPath, {
    depthLimit: -1,
    nodir: true,
    filter: cssFilter,
    traverseAll: true,
  });

  moveCSS(cssFiles[0].path);
}

main();
