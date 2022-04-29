const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const src = path.join(__dirname, "public");

app.use(express.static(src));
app.use(express.json());

app.get("/home", (req, res) => {
  res.sendFile(src + "/index.html");
});
app.get("/login", (req, res) => {
  res.sendFile(src + "/login.html");
});
app.get("/register", (req, res) => {
  res.sendFile(src + "/register.html");
});
app.use("/api/user", require("./routes/user"));
app.use("/api/login", require("./routes/login"));
app.use("/dynamo", require("./routes/dynamo"));
app.use("/s3", require("./routes/s3"));
app.use("/api/register", require("./routes/register"));

// Catch-all for non defined routes
app.get("*", (req, res) => {
  res.status(404).send("Oopsie, this doesn't seem right.", 404);
});

app.listen(port, () => {
  console.log(`Express running on port ${port}`);
});
