const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const product_controller = require("../controllers/productController");

const product_route = express();
product_route.use(bodyParser.json());
product_route.use(bodyParser.urlencoded({ extended: true }));

product_route.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.join(__dirname, "../public/productImages"),
      (error, success) => {
        if (error) throw error;
      }
    );
  },
  filename: (req, file, cb) => {
    const name = Date.now() + "_" + file.originalname;
    cb(null, name, (err, succ) => {
      if (err) throw err;
    });
  },
});

const upload = multer({
  storage: storage,
});

product_route.post(
  "/addProduct",
  upload.array("images"),
  product_controller.add_product
);
product_route.get("/productList", product_controller.get_product);
product_route.get("/searchProduct", product_controller.search_product);

product_route.post("/paginate", product_controller.product_paginate);

module.exports = product_route;
