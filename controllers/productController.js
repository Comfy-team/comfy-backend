const mongoose = require("mongoose");

require("../models/productSchema");

const Product = mongoose.model("products");
const Brand = mongoose.model("brands");
const Category = mongoose.model("categories");

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
      Brand.updateOne({ _id: data.brand }, { $push: { products: data._id } })
        .then(() => true)
        .catch((error) => next(error));
      return data;
    })
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((error) => next(error));
};

module.exports.updateProduct = (req, res, next) => {
  let imagesArr;
  if (req.files) {
    imagesArr = req.files.map((img) => {
      return { src: img.path };
    });
  }
  Product.findOne({ _id: req.body._id }, { category: 1, brand: 1 })
    .then((obj) => {
      // check if brand was updated
      if (req.body.brand != obj.brand.toString()) {
        // remove product from old brand
        Brand.updateOne({ _id: obj.brand }, { $pull: { products: obj._id } })
          .then(() => true)
          .catch((error) => next(error));
        // add product to updated brand
        Brand.updateOne(
          { _id: req.body.brand },
          { $push: { products: obj._id } }
        )
          .then(() => true)
          .catch((error) => next(error));
      }
      // check if category was updated
      if (req.body.category !== obj.category) {
        // remove product from old category
        Category.updateOne(
          { _id: obj.category },
          { $pull: { products_id: obj._id } }
        )
          .then(() => true)
          .catch((error) => next(error));
        // add product to updated category
        Category.updateOne(
          { _id: req.body.brand },
          { $push: { products_id: obj._id } }
        )
          .then(() => true)
          .catch((error) => next(error));
      }
    })
    .then(() => {
      return Product.updateOne(
        { _id: req.body._id },
        { $set: imagesArr ? { ...req.body, images: imagesArr } : req.body }
      );
    })
    .then((obj) => res.status(200).json(obj))
    .catch((error) => next(error));
};

module.exports.deleteProduct = (req, res, next) => {
  Brand.updateOne(
    { _id: req.body.brand },
    { $pull: { products: req.body._id } }
  )
    .then(() => true)
    .catch((error) => next(error));
  Category.updateOne(
    { _id: req.body.category },
    { $pull: { products_id: req.body._id } }
  )
    .then(() => true)
    .catch((error) => next(error));
  Product.deleteOne({ _id: req.body._id })
    .then((info) => {
      res.status(200).json(info);
    })
    .catch((error) => next(error));
};
