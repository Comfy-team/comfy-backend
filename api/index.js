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

const cartRoutes = require("../routes/cartRoute");
const userRoutes = require("../routes/userRoutes");
const orderRoutes = require("../routes/ordersRoute");
const authenticationRoute = require("../routes/authenticationRoute");
const brandRoutes = require("../routes/brandRoute");
const categoryRoutes = require("../routes/categoryRoute");
const productRoutes = require("../routes/productRoutes");
const registerRoutes = require("../routes/register");

const port = process.env.PORT || 8080;
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("DB is connected");
    app.listen(port, () => {
      console.log("Up and listenin to port", port);
    });
  })
  .catch((error) => console.log("Error in DB " + error));

app.use(
  cors({
    credentials: true,
    origin: ["https://comfy-frontend.vercel.app"],
  })
);

// logging MW
app.use(morgan("short"));

app.use(express.json());

app.use(registerRoutes);

// authentication
app.use(authenticationRoute);

app.use("/uploads", express.static("uploads"));

// routes
app.use(productRoutes);
app.use(brandRoutes);
app.use(userRoutes);
app.use(categoryRoutes);
app.use(orderRoutes);
app.use(cartRoutes);

// not found MW
app.use((req, res, next) => {
  res.status(404).json({ msg: "not found" });
});

// error MW
app.use((error, req, res, next) => {
  res.status(500).json({ message: "Internal sever error" });
});
