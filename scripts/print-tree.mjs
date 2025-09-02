// scripts/print-tree.mjs
import { promises as fs } from "node:fs";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).map(a => {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/);
    if (!m) return [a, true];
    const [, k, v] = m;
    return [k, v === undefined ? true : v];
  })
);

const root = path.resolve(args.root || ".");
const maxDepth = Number(args.depth ?? 12);
const includeDots = !!args["include-dots"];
const showFiles =
  args["no-files"] ? false :
  args.files === "false" ? false :
  true;

const defaultExcludes = [
  "node_modules",".next",".git",".turbo",".vercel",
  "dist","build","coverage","out",".DS_Store"
];
const EXCLUDE = new Set(
  (args.exclude ? String(args.exclude).split(",") : defaultExcludes)
    .map(s => s.trim()).filter(Boolean)
);

function normalize(a,b){ return a.localeCompare(b, undefined, {numeric:true, sensitivity:"base"}); }

async function listDir(dir) {
  let entries = await fs.readdir(dir, { withFileTypes: true });
  if (!includeDots) entries = entries.filter(e => !e.name.startsWith(".") || EXCLUDE.has(e.name));
  entries = entries.filter(e => !EXCLUDE.has(e.name));
  const dirs = entries.filter(e => e.isDirectory()).sort((a,b)=>normalize(a.name,b.name));
  const files = entries.filter(e => e.isFile()).sort((a,b)=>normalize(a.name,b.name));
  return [...dirs, ...files];
}

async function tree(dir, prefix = "", depth = 0) {
  let out = "";
  if (depth === 0) out += path.basename(root) + "/\n";
  if (depth >= maxDepth) return out;

  const entries = await listDir(dir);
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const isLast = i === entries.length - 1;
    const connector = isLast ? "└─ " : "├─ ";
    const nextPrefix = prefix + (isLast ? "   " : "│  ");
    const p = path.join(dir, e.name);

    if (e.isDirectory()) {
      out += prefix + connector + e.name + "/\n";
      out += await tree(p, nextPrefix, depth + 1);
    } else if (showFiles) {
      out += prefix + connector + e.name + "\n";
    }
  }
  return out;
}

try {
  process.stdout.write(await tree(root));
} catch (err) {
  console.error("Error:", err);
  process.exit(1);
}
