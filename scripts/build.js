// Build step: copy src/ to dist/ and stamp the page with the commit and date.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const src = path.join(root, "src");
const dist = path.join(root, "dist");

fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(src, dist, { recursive: true });

const version = (process.env.GITHUB_SHA || "local").slice(0, 7);
const date = new Date().toISOString().slice(0, 10);

const page = path.join(dist, "index.html");
const html = fs
  .readFileSync(page, "utf8")
  .replaceAll("__BUILD_VERSION__", version)
  .replaceAll("__BUILD_DATE__", date);
fs.writeFileSync(page, html);

console.log(`Built dist/ (version ${version}, ${date})`);
