const test = require("node:test");
const assert = require("node:assert");
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "src");
const html = fs.readFileSync(path.join(src, "index.html"), "utf8");
const { validateName, validateEmail, validateMessage, validateForm } = require("../src/app.js");

test("page has the basics: language, title, viewport and one h1", () => {
  assert.match(html, /<html lang="en">/);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /name="viewport"/);
  assert.strictEqual((html.match(/<h1>/g) || []).length, 1);
});

test("every local file referenced by the page exists", () => {
  const refs = [...html.matchAll(/(?:href|src)="([^"#:]+)"/g)].map((m) => m[1]);
  assert.ok(refs.length > 0);
  for (const ref of refs) {
    assert.ok(fs.existsSync(path.join(src, ref)), `missing file: ${ref}`);
  }
});

test("every in-page link points to an existing id", () => {
  const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
  for (const id of anchors) {
    assert.ok(html.includes(`id="${id}"`), `no element with id="${id}"`);
  }
});

test("validateEmail accepts valid and rejects invalid addresses", () => {
  assert.ok(validateEmail("team@example.com"));
  assert.ok(validateEmail("  a.b@c.io  "));
  assert.ok(!validateEmail("no-at-sign.com"));
  assert.ok(!validateEmail("missing@tld"));
  assert.ok(!validateEmail(""));
});

test("validateName and validateMessage enforce minimum lengths", () => {
  assert.ok(validateName("Al"));
  assert.ok(!validateName(" A "));
  assert.ok(validateMessage("This is long enough."));
  assert.ok(!validateMessage("too short"));
});

test("validateForm returns one error per invalid field", () => {
  const errors = validateForm({ name: "", email: "bad", message: "hi" });
  assert.deepStrictEqual(Object.keys(errors).sort(), ["email", "message", "name"]);
  const ok = validateForm({ name: "Asha", email: "asha@example.com", message: "Need a new site." });
  assert.deepStrictEqual(ok, {});
});
