const Product = require("../models/productModel");
const category_controller = require("./categoryController");
const store_controller = require("./storeController");

const add_product = async (req, res) => {
  try {
    let arraImages = [];
    for (let i = 0; i < req.files.length; i++) {
      arraImages[i] = req.files[i].filename;
    }

    const products = new Product({
      vendor_id: req.body.vendor_id,
      store_id: req.body.store_id,
      name: req.body.name,
      price: req.body.price,
      discount: req.body.discount,
      category_id: req.body.category_id,
      sub_cat_id: req.body.sub_cat_id,
      images: arraImages,
    });

    const product_data = await products.save();
    res.status(200).send({
      success: true,
      message: "Product created successfully",
      product: product_data,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const get_product = async (req, res) => {
  try {
    var send_data = [];
    const cat_data = await category_controller.get_category();
    if (cat_data.length > 0) {
      for (let i = 0; i < cat_data.length; i++) {
        var product_data = [];
        var cat_id = cat_data[i]["_id"].toString();
        var cat_product = await Product.find({ category_id: cat_id });
        if (cat_product.length > 0) {
          for (let j = 0; j < cat_product.length; j++) {
            const store = await store_controller.get_store(
              cat_product[j]["store_id"]
            );
            product_data.push({
              product_name: cat_product[j]["name"],
              product_images: cat_product[j]["images"],
              store_address: store["address"],
              store_location: store["location"],
              store_pinCode: store["pin"],
            });
          }
        }
        send_data.push({
          category: cat_data[i]["category"],
          product: product_data,
        });
      }
      res.status(200).send({
        success: true,
        message: "Products fetch successfully",
        product: send_data,
      });
    } else {
      res
        .status(200)
        .send({ success: false, message: "product list", data: send_data });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const search_product = async (req, res) => {
  try {
    const search = req.query.search;
    console.log(search);
    const product_data = await Product.find({
      name: { $regex: ".*" + search + ".*", $options: "i" },
    });
    if (product_data.length > 0) {
      res
        .status(200)
        .send({ success: true, message: "product list", data: product_data });
    } else {
      res
        .status(200)
        .send({ success: true, message: "No product found", data: [] });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const product_paginate = async (req, res) => {
  try {
    const page = req.body.page;
    const sort = req.body.sort;
    var product_data;
    var skip;
    if (page <= 1) {
      skip = 0;
    } else {
      skip = (page - 1) * 2;
    }
    if (sort) {
      var customSort;
      if (sort == "name") {
        customSort = { name: 1 };
      } else if (sort == "_id") {
        customSort = { _id: 1 };
      }
      product_data = await Product.find().sort(customSort).skip(skip).limit(2);
    } else {
      product_data = await Product.find().skip(skip).limit(2);
    }
    res
      .status(200)
      .send({ success: true, message: "product details", data: product_data });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  add_product,
  get_product,
  search_product,
  product_paginate,
};
