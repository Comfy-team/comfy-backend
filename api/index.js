const app = require('express')();
const { v4 } = require('uuid');

app.get('/api', (req, res) => {
  const path = `/api/item/${v4()}`;
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`);
});

app.get('/api/item/:slug', (req, res) => {
  const { slug } = req.params;
  res.end(`Item: ${slug}`);
});

module.exports = app;

const mongoose = require("mongoose");
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");

// const cartRoutes = require("./routes/cartRoute");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/ordersRoute");
const authenticationRoute = require("./routes/authenticationRoute");
const brandRoutes = require("./routes/brandRoute");
const categoryRoutes = require("./routes/categoryRoute");
const productRoutes = require("./routes/productRoutes");
const registerRoutes = require("./routes/register");

const port = process.env.PORT || 8080;
const server = express();
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("DB is connected");
    server.listen(port, () => {
      console.log("Up and listenin to port", port);
    });
  })
  .catch((error) => console.log("Error in DB " + error));

server.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://comfy-frontend.vercel.app"],
  })
);

// logging MW
server.use(morgan("short"));

server.use(express.json());

server.use(registerRoutes);

// authentication
server.use(authenticationRoute);

server.use("/uploads", express.static("uploads"));

// routes
server.use(productRoutes);
server.use(brandRoutes);
server.use(userRoutes);
server.use(categoryRoutes);
server.use(orderRoutes);
server.use(cartRoutes);

// not found MW
server.use((req, res, next) => {
  res.status(404).json({ msg: "not found" });
});

// error MW
server.use((error, req, res, next) => {
  res.status(error.status || 500).json({ msg: "" + error });
  // res.status(500).json({ message: "Internal sever error" });
});
