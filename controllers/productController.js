const mongoose = require("mongoose");

require("../models/productSchema");

const Product = mongoose.model("products");

module.exports.getAllProducts = (req, res, next) => {
  Product.find({})
    .then((data) => res.status(200).json(data))
    .catch((error) => next(error));
};

module.exports.getProductById = (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .then((obj) => {
      if (obj === null) {
        throw new Error("product isn't found");
      }
      res.status(200).json(obj);
    })
    .catch((error) => next(error));
};

module.exports.addProduct = (req, res, next) => {
  const imagesArr = req.files.map((img) => {
    return { src: img.path };
  });
  let object = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    images: imagesArr,
    color: req.body.color,
    discount: req.body.discount,
    stock: req.body.stock,
    category: req.body.category,
    brand: req.body.brand,
  });
  object
    .save()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((error) => next(error));
};

module.exports.updateProduct = (req, res, next) => {
  if (req.files) {
    const imagesArr = req.files.map((img) => {
      return { src: img.path };
    });
    Product.updateOne(
      { _id: req.body._id },
      { $set: { ...req.body, image: imagesArr } }
    )
      .then((obj) => res.status(200).json(obj))
      .catch((error) => next(error));
  } else {
    Product.updateOne({ _id: req.body._id }, { $set: req.body })
      .then((obj) => res.status(200).json(obj))
      .catch((error) => next(error));
  }
};

module.exports.deleteProduct = (req, res, next) => {
  Product.deleteOne({ _id: req.body._id })
    .then((info) => {
      res.status(200).json(info);
    })
    .catch((error) => next(error));
};
