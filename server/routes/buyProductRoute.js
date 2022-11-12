const express = require("express");
const bodyParser = require("body-parser");

const buy_product_controller = require("../controllers/buyProductController");

const buy_product_route = express();
buy_product_route.use(bodyParser.json());
buy_product_route.use(bodyParser.urlencoded({ extended: true }));

buy_product_route.post("/buyProduct", buy_product_controller.buy_product);

module.exports = buy_product_route;
