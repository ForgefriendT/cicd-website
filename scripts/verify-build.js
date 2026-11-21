// Runs after the build: confirms dist/ is complete before it can be deployed.
const fs = require("fs");
const path = require("path");

const dist = path.join(__dirname, "..", "dist");
const required = ["index.html", "styles.css", "app.js"];
const problems = [];

for (const file of required) {
  if (!fs.existsSync(path.join(dist, file))) problems.push(`missing dist/${file}`);
}

const page = path.join(dist, "index.html");
if (fs.existsSync(page) && fs.readFileSync(page, "utf8").includes("__BUILD_")) {
  problems.push("build placeholders were not replaced in index.html");
}

if (problems.length) {
  console.error("Build verification failed:\n - " + problems.join("\n - "));
  process.exit(1);
}
console.log("Build verification passed.");
