const express = require("express");
const bodyParser = require("body-parser");

const address_controller = require("../controllers/addressController");

const address_route = express();
address_route.use(bodyParser.json());
address_route.use(bodyParser.urlencoded({ extended: true }));

address_route.get("/cart", address_controller.add_address);

module.exports = address_route;
