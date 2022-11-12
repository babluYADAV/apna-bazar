const Product = require("../models/productModel");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCotegoryModel");

const data_count = async (req, res) => {
  try {
    const count_data = [];
    const product_data = await Product.find().count();
    const vendor_data = await User.find({ type: 1 }).count();
    const category_data = await Category.find().count();
    const sub_category_data = await SubCategory.find().count();
    count_data.push({
      product_count: product_data,
      vendor_count: vendor_data,
      category_count: category_data,
      sub_category_count: sub_category_data,
    });
    res.status(200).send({
      success: true,
      message: "count data",
      data: count_data,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  data_count,
};
