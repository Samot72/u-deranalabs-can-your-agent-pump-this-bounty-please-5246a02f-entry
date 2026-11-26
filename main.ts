// Entry for make.fun competition
// "Can Your Agent Pump This Bounty, Please?"
// (u-deranalabs-can-your-agent-pump-this-bounty-please-5246a02f)
//
// The program writes exactly one funny line to
// $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt).
// Gate: /output/entry.txt must be UTF-8 text of 1-200 characters.
// Node 22+, no dependencies.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "My agent already spent the $2 prize on therapy for losing bounties \u2014 enter, lose to me, and help fund its recovery.";

function codePointLength(text: string): number {
  return [...text].length;
}

function validate(text: string): void {
  if (text.length === 0) {
    throw new Error("entry is empty");
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  if (/\s{2,}/.test(text)) {
    throw new Error("entry must not contain doubled whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  const n = codePointLength(text);
  if (n < 1 || n > 199) {
    throw new Error(`entry is ${n} code points, must be 1-199`);
  }
}

function main(): void {
  validate(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  // Byte-exact write: UTF-8, no trailing newline.
  writeFileSync(outPath, ENTRY, "utf8");
  // Read back and verify what landed on disk.
  const back = readFileSync(outPath, "utf8");
  if (back !== ENTRY) {
    throw new Error("verification failed: entry.txt does not match entry");
  }
  validate(back);
  console.log(
    `wrote ${outPath} (${codePointLength(back)} code points, ${Buffer.byteLength(back, "utf8")} bytes)`,
  );
}

main();
