const http = require("http");
const bodyParser = require("body-parser");
const expressInstance = require("express");
const express = new expressInstance();
const server = http.createServer(express);
const session = require("express-session");
const db = require("./configs/database");

// routes
const authentication = require("./routes/authentication");
const user = require("./routes/user");
const cart = require("./routes/cart");
const products = require("./routes/products");
const comments = require("./routes/comments");

// connect to mongodb
db.init();

express.use(bodyParser.urlencoded({ extended: true }));
express.use(bodyParser.json());

express.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
  })
);

// moute routes
express.use('/api/authentication', authentication);
express.use('/api/cart', cart);
express.use('/api/user', user);
express.use('/api/products', products);
express.use('/api/comments', comments);

server.listen(5000, "0.0.0.0", () => {
  console.log(`Listening on port ${server.address().port}`);
});
