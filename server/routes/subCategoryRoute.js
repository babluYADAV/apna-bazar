const express = require("express");
const bodyParser = require("body-parser");

const sub_category_controller = require("../controllers/subCategoryController");

const sub_category_route = express();
sub_category_route.use(bodyParser.json());
sub_category_route.use(bodyParser.urlencoded({ extended: true }));

sub_category_route.post(
  "/addSubCategory",
  sub_category_controller.add_sub_category
);

module.exports = sub_category_route;
