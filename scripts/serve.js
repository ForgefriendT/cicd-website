// Minimal local preview server for dist/ (npm start). No dependencies.
const http = require("http");
const fs = require("fs");
const path = require("path");

const dist = path.join(__dirname, "..", "dist");
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };

http
  .createServer((req, res) => {
    const name = req.url === "/" ? "index.html" : path.basename(req.url);
    const file = path.join(dist, name);
    if (!fs.existsSync(file)) {
      res.writeHead(404).end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "text/plain" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(8080, () => console.log("Preview at http://localhost:8080 (run npm run build first)"));
