// print-tree.mjs
import fs from "node:fs";
import path from "node:path";

const START = ["content", "app", "lib", path.join("public","images","resources")];
const EXCLUDE = new Set(["node_modules",".git",".next","dist","build","coverage",".vercel",".DS_Store"]);
const MAX_DEPTH = 4;

function printTree(dir, depth = 0, prefix = "") {
  if (depth > MAX_DEPTH || !fs.existsSync(dir)) return;
  const name = path.basename(dir) || dir;
  console.log(prefix + name + "/");
  const items = fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => !EXCLUDE.has(d.name));
  for (const d of items) {
    const full = path.join(dir, d.name);
    if (d.isDirectory()) {
      printTree(full, depth + 1, prefix + "  ");
    } else if (depth <= MAX_DEPTH - 1) {
      console.log(prefix + "  " + d.name);
    }
  }
}

for (const root of START) {
  if (fs.existsSync(root)) printTree(root, 0, "");
}
