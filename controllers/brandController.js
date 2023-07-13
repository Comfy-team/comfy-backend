const mongoose = require("mongoose");

require("../models/brandSchema");
const { getDataOfPage } = require("./paginationController");

const Brand = mongoose.model("brands");

module.exports.getAllBrands = (req, res, next) => {
  Brand.find({})
    .then((data) => {
      const page = req.query.page ? req.query.page : 1;
      const { totalPages, pageData } = getDataOfPage(data, page);
      res.status(200).json({
        data: pageData,
        totalPages,
        totalBrands: data.length,
        allData: data,
      });
    })
    .catch((error) => next(error));
};

module.exports.getBrandById = (req, res, next) => {
  Brand.findOne({ _id: req.params.id })
    .then((obj) => {
      if (obj === null) {
        throw new Error("brand isn't found");
      }
      res.status(200).json(obj);
    })
    .catch((error) => next(error));
};

module.exports.getBrandProducts = (req, res, next) => {
  Brand.findOne({ _id: req.params.id })
    .populate("products")
    .select("products")
    .then((data) => {
      if (data === null) {
        throw new Error("Brand not found");
      }
      res.status(200).json(data);
    })
    .catch((error) => next(error));
};

module.exports.getBrandCategoryProducts = (req, res, next) => {
  Brand.find({ category: req.params.name })
    .populate("products")
    .select("products")
    .then((data) => {
      if (data.length === 0) {
        throw new Error("Brand category not found");
      }
      res.status(200).json(data);
    })
    .catch((error) => next(error));
};

module.exports.addBrand = (req, res, next) => {
  let object = new Brand({
    name: req.body.name,
    category: req.body.category,
    image: req.file.path,
    products: req.body.products || [],
  });
  object
    .save()
    .then(() => Brand.find({}))
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => next(error));
};

module.exports.updateBrand = (req, res, next) => {
  Brand.updateOne(
    { _id: req.body._id },
    { $set: req.file ? { ...req.body, image: req.file.path } : req.body }
  )
    .then(() => Brand.find({}))
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => next(error));
};

module.exports.deleteBrand = (req, res, next) => {
  Brand.deleteOne({ _id: req.params.id })
    .then((info) => {
      res.status(200).json(info);
    })
    .catch((error) => next(error));
};

module.exports.searchForBrand = (req, res, next) => {
  const regex = new RegExp(req.query.search, "ig");
  Brand.find()
    .then((data) => {
      const arr = data.filter((ele) => {
        return regex.test(ele.name) || regex.test(ele._id);
      });
      return arr;
    })
    .then((data) => {
      const page = req.query.page ? req.query.page : 1;
      const { totalPages, pageData } = getDataOfPage(data, page);
      res.status(200).json({
        data: pageData,
        totalPages,
        totalBrands: data.length,
      });
    })
    .catch((error) => next(error));
};
