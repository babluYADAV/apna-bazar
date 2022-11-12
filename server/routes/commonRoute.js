const express = require("express");
const bodyParser = require("body-parser");

const common_route_controller = require("../controllers/commonController");

const common_route = express();
common_route.use(bodyParser.json());
common_route.use(bodyParser.urlencoded({ extended: true }));

common_route.get("/dataCount", common_route_controller.data_count);

module.exports = common_route;
