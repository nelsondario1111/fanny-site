export type SpreadsheetCell = string | number | boolean | null | undefined;
export type SpreadsheetRow = SpreadsheetCell[];

const encoder = new TextEncoder();

function safeDateSuffix() {
  return new Date().toISOString().slice(0, 10);
}

function xmlEscape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sanitizeFileBase(baseName: string) {
  return baseName
    .trim()
    .replace(/[^A-Za-z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "") || "export";
}

export function sanitizeSpreadsheetText(raw: string) {
  const value = String(raw ?? "").replace(/\u0000/g, "");
  // Prevent spreadsheet formula execution from user-entered text.
  if (/^[\t\r\n ]*[=+\-@]/.test(value)) {
    return `'${value}`;
  }
  return value;
}

function toCsvCell(value: SpreadsheetCell) {
  if (value === null || value === undefined) return "";

  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "";
  }

  if (typeof value === "boolean") {
    return value ? "TRUE" : "FALSE";
  }

  const sanitized = sanitizeSpreadsheetText(String(value));
  const escaped = sanitized.replace(/\"/g, '""');
  const needsQuotes = /[",\n\r]/.test(escaped);
  return needsQuotes ? `"${escaped}"` : escaped;
}

export function rowsToCsv(rows: SpreadsheetRow[]) {
  return rows.map((row) => row.map(toCsvCell).join(",")).join("\r\n");
}

export function downloadCsv(
  baseName: string,
  rows: SpreadsheetRow[],
  options?: { includeDateSuffix?: boolean }
) {
  const includeDateSuffix = options?.includeDateSuffix ?? true;
  const fileBase = sanitizeFileBase(baseName);
  const name = includeDateSuffix ? `${fileBase}_${safeDateSuffix()}` : fileBase;
  const csv = rowsToCsv(rows);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function inferColumnWidths(rows: SpreadsheetRow[], min = 10, max = 50) {
  const cols = Math.max(0, ...rows.map((r) => r.length));
  const widths = Array.from({ length: cols }, () => min);

  for (const row of rows) {
    row.forEach((cell, idx) => {
      const str =
        cell === null || cell === undefined
          ? ""
          : typeof cell === "number"
          ? Number.isFinite(cell)
            ? String(cell)
            : ""
          : typeof cell === "boolean"
          ? cell
            ? "TRUE"
            : "FALSE"
          : String(cell);
      const length = Math.max(str.length, widths[idx]);
      widths[idx] = length;
    });
  }

  return widths.map((len) => Math.max(min, Math.min(max, Math.round(len * 1.15 + 2))));
}

function colToLetter(index: number) {
  let n = index + 1;
  let out = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    out = String.fromCharCode(65 + rem) + out;
    n = Math.floor((n - 1) / 26);
  }
  return out;
}

// -------------------- Minimal ZIP writer (store/no compression) --------------------
const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) {
      c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(data: Uint8Array) {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i += 1) {
    crc = crcTable[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function concatUint8(parts: Uint8Array[]) {
  const total = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

function writeLe16(view: DataView, offset: number, value: number) {
  view.setUint16(offset, value & 0xffff, true);
}

function writeLe32(view: DataView, offset: number, value: number) {
  view.setUint32(offset, value >>> 0, true);
}

type ZipEntry = {
  path: string;
  bytes: Uint8Array;
};

function buildZip(entries: ZipEntry[]) {
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.path);
    const data = entry.bytes;
    const crc = crc32(data);

    const localHeader = new Uint8Array(30);
    const localView = new DataView(localHeader.buffer);
    writeLe32(localView, 0, 0x04034b50);
    writeLe16(localView, 4, 20); // version needed
    writeLe16(localView, 6, 0); // flags
    writeLe16(localView, 8, 0); // method: store
    writeLe16(localView, 10, 0); // mod time
    writeLe16(localView, 12, 0); // mod date
    writeLe32(localView, 14, crc);
    writeLe32(localView, 18, data.length);
    writeLe32(localView, 22, data.length);
    writeLe16(localView, 26, nameBytes.length);
    writeLe16(localView, 28, 0);

    const local = concatUint8([localHeader, nameBytes, data]);
    localParts.push(local);

    const centralHeader = new Uint8Array(46);
    const centralView = new DataView(centralHeader.buffer);
    writeLe32(centralView, 0, 0x02014b50);
    writeLe16(centralView, 4, 20); // version made by
    writeLe16(centralView, 6, 20); // version needed
    writeLe16(centralView, 8, 0); // flags
    writeLe16(centralView, 10, 0); // method
    writeLe16(centralView, 12, 0); // mod time
    writeLe16(centralView, 14, 0); // mod date
    writeLe32(centralView, 16, crc);
    writeLe32(centralView, 20, data.length);
    writeLe32(centralView, 24, data.length);
    writeLe16(centralView, 28, nameBytes.length);
    writeLe16(centralView, 30, 0); // extra len
    writeLe16(centralView, 32, 0); // comment len
    writeLe16(centralView, 34, 0); // disk start
    writeLe16(centralView, 36, 0); // int attrs
    writeLe32(centralView, 38, 0); // ext attrs
    writeLe32(centralView, 42, offset);

    centralParts.push(concatUint8([centralHeader, nameBytes]));
    offset += local.length;
  }

  const centralDir = concatUint8(centralParts);
  const centralOffset = offset;
  const eocd = new Uint8Array(22);
  const eocdView = new DataView(eocd.buffer);
  writeLe32(eocdView, 0, 0x06054b50);
  writeLe16(eocdView, 4, 0);
  writeLe16(eocdView, 6, 0);
  writeLe16(eocdView, 8, entries.length);
  writeLe16(eocdView, 10, entries.length);
  writeLe32(eocdView, 12, centralDir.length);
  writeLe32(eocdView, 16, centralOffset);
  writeLe16(eocdView, 20, 0);

  return new Blob([concatUint8(localParts), centralDir, eocd], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

function buildWorksheetXml(
  rows: SpreadsheetRow[],
  options: { sheetName: string; columnWidths?: number[]; freezeHeader?: boolean }
) {
  const rowCount = rows.length;
  const colCount = Math.max(1, ...rows.map((r) => r.length));
  const lastCol = colToLetter(colCount - 1);
  const lastCell = `${lastCol}${Math.max(1, rowCount)}`;

  const inferredWidths = options.columnWidths ?? inferColumnWidths(rows);
  const colsXml = inferredWidths.length
    ? `<cols>${inferredWidths
        .map(
          (width, i) =>
            `<col min="${i + 1}" max="${i + 1}" width="${Math.max(8, width)}" customWidth="1"/>`
        )
        .join("")}</cols>`
    : "";

  const rowsXml = rows
    .map((row, rIdx) => {
      const cellsXml = row
        .map((cell, cIdx) => {
          if (cell === null || cell === undefined || cell === "") return "";
          const ref = `${colToLetter(cIdx)}${rIdx + 1}`;
          const isHeader = rIdx === 0 ? ' s="1"' : "";

          if (typeof cell === "number" && Number.isFinite(cell)) {
            return `<c r="${ref}"${isHeader}><v>${cell}</v></c>`;
          }

          if (typeof cell === "boolean") {
            return `<c r="${ref}" t="b"${isHeader}><v>${cell ? 1 : 0}</v></c>`;
          }

          const text = String(cell);
          const preserve = /^\s|\s$/.test(text) ? ' xml:space="preserve"' : "";
          return `<c r="${ref}" t="inlineStr"${isHeader}><is><t${preserve}>${xmlEscape(
            text
          )}</t></is></c>`;
        })
        .join("");

      return `<row r="${rIdx + 1}">${cellsXml}</row>`;
    })
    .join("");

  const sheetViews = options.freezeHeader
    ? `<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>`
    : "<sheetViews><sheetView workbookViewId=\"0\"/></sheetViews>";

  const autoFilter = rowCount > 1 ? `<autoFilter ref="A1:${lastCol}1"/>` : "";

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="A1:${lastCell}"/>
  ${sheetViews}
  ${colsXml}
  <sheetData>${rowsXml}</sheetData>
  ${autoFilter}
</worksheet>`;
}

export function downloadXlsx(
  baseName: string,
  rows: SpreadsheetRow[],
  options?: {
    includeDateSuffix?: boolean;
    sheetName?: string;
    columnWidths?: number[];
    freezeHeader?: boolean;
  }
) {
  const includeDateSuffix = options?.includeDateSuffix ?? true;
  const fileBase = sanitizeFileBase(baseName);
  const name = includeDateSuffix ? `${fileBase}_${safeDateSuffix()}` : fileBase;
  const sheetName = (options?.sheetName || "Sheet1").replace(/[\\/*?:\[\]]/g, " ").slice(0, 31);

  const worksheetXml = buildWorksheetXml(rows, {
    sheetName,
    columnWidths: options?.columnWidths,
    freezeHeader: options?.freezeHeader ?? true,
  });

  const entries: ZipEntry[] = [
    {
      path: "[Content_Types].xml",
      bytes: encoder.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`),
    },
    {
      path: "_rels/.rels",
      bytes: encoder.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`),
    },
    {
      path: "xl/workbook.xml",
      bytes: encoder.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="${xmlEscape(sheetName || "Sheet1")}" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`),
    },
    {
      path: "xl/_rels/workbook.xml.rels",
      bytes: encoder.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`),
    },
    {
      path: "xl/styles.xml",
      bytes: encoder.encode(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2">
    <font><sz val="11"/><name val="Calibri"/><family val="2"/></font>
    <font><b/><sz val="11"/><name val="Calibri"/><family val="2"/></font>
  </fonts>
  <fills count="1"><fill><patternFill patternType="none"/></fill></fills>
  <borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="2">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
  </cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`),
    },
    {
      path: "xl/worksheets/sheet1.xml",
      bytes: encoder.encode(worksheetXml),
    },
  ];

  const blob = buildZip(entries);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
