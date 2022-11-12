const express = require("express");
const bodyParser = require("body-parser");

const category_controller = require("../controllers/categoryController");

const category_route = express();
category_route.use(bodyParser.json());
category_route.use(bodyParser.urlencoded({ extended: true }));

category_route.post("/addCategory", category_controller.add_category);

module.exports = category_route;
