const http = require("http");
const db = require("./db.json");

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);

  if (req.url === "/buddys") {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(db.buddyList));
  } else {
    res.statusCode = 404;
    res.end("Hello client");
  }
});

server.listen(4000, () => {
  console.log("server started on port 4000");
});
