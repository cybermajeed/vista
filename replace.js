const fs = require("fs");
const path = require("path");

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, "utf8");
  let original = content;
  for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const replacements = [
  ["brand-blue", "brand-accent"],
  ["blue-pressed", "accent-pressed"],
];

walkDir(path.join(__dirname, "src"), (filePath) => {
  if (
    filePath.endsWith(".tsx") ||
    filePath.endsWith(".ts") ||
    filePath.endsWith(".css")
  ) {
    replaceInFile(filePath, replacements);
  }
});
