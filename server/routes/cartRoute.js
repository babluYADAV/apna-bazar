const express = require("express");
const bodyParser = require("body-parser");

const cart_controller = require("../controllers/cartController");

const cart_route = express();
cart_route.use(bodyParser.json());
cart_route.use(bodyParser.urlencoded({ extended: true }));

cart_route.get("/cart", cart_controller.add_to_cart);

module.exports = cart_route;
