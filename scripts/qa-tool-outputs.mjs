#!/usr/bin/env node

import fg from "fast-glob";
import { readFile } from "node:fs/promises";
import path from "node:path";

const cwd = process.cwd();
const toolFiles = await fg(
  ["app/en/tools/**/page.tsx", "app/es/herramientas/**/page.tsx"],
  { cwd, absolute: true }
);

const errors = [];
const warnings = [];

let printCount = 0;
let csvCount = 0;
let xlsxCount = 0;

const has = (source, pattern) => pattern.test(source);

for (const file of toolFiles) {
  const source = await readFile(file, "utf8");
  const rel = path.relative(cwd, file);

  const hasPrint = has(source, /window\.print\(\)/);
  const hasCsv =
    has(source, /downloadCsv\(/) ||
    has(source, /Export\s*\(CSV\)|Exportar\s*\(CSV\)/);
  const hasXlsx =
    has(source, /downloadXlsx\(/) ||
    has(source, /Export\s*\(XLSX\)|Exportar\s*\(XLSX\)/);

  const usesSharedCsv = has(source, /downloadCsv\(/);
  const usesSharedXlsx = has(source, /downloadXlsx\(/);

  const hasRawCsvLogic =
    has(source, /new Blob\(\s*\[\s*["'`]\\uFEFF/) ||
    has(source, /text\/csv;charset=utf-8/) ||
    has(source, /\btoCSV\(/) ||
    has(source, /\bdownloadCSV\(/);

  const hasColumnWidths = has(source, /downloadXlsx\([\s\S]*?columnWidths\s*:/);

  if (hasPrint) {
    printCount += 1;
    const hasPrintLabel = has(
      source,
      /Print or Save PDF|Imprimir o guardar PDF|Guardar como PDF|Save as PDF/
    );
    if (!hasPrintLabel) {
      warnings.push(`${rel}: print action found without explicit Save PDF guidance text.`);
    }
  }

  if (hasCsv) {
    csvCount += 1;
    if (!usesSharedCsv) {
      errors.push(`${rel}: CSV export exists but does not use shared downloadCsv().`);
    }
    if (hasRawCsvLogic) {
      errors.push(`${rel}: legacy CSV blob/toCSV logic still present.`);
    }
  }

  if (hasXlsx) {
    xlsxCount += 1;
    if (!usesSharedXlsx) {
      errors.push(`${rel}: XLSX export label exists but does not use shared downloadXlsx().`);
    }
    if (usesSharedXlsx && !hasColumnWidths) {
      warnings.push(`${rel}: downloadXlsx() missing explicit columnWidths (using inferred widths).`);
    }
  }

  if (hasCsv && !hasXlsx) {
    warnings.push(`${rel}: CSV export present without XLSX option.`);
  }
}

console.log("Tool Output QA");
console.log(`- Files scanned: ${toolFiles.length}`);
console.log(`- Print-enabled tools: ${printCount}`);
console.log(`- CSV-enabled tools: ${csvCount}`);
console.log(`- XLSX-enabled tools: ${xlsxCount}`);

if (warnings.length) {
  console.log(`\nWarnings (${warnings.length})`);
  warnings.forEach((warning) => console.log(`- ${warning}`));
}

if (errors.length) {
  console.error(`\nErrors (${errors.length})`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log("\nNo blocking issues found.");
}
