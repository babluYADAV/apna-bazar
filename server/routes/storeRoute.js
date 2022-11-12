const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const store_controller = require("../controllers/storeController");

const store_route = express();
store_route.use(bodyParser.json());
store_route.use(bodyParser.urlencoded({ extended: true }));

store_route.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.join(__dirname, "../public/storeImages"),
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

store_route.post(
  "/createStore",
  upload.single("logo"),
  store_controller.create_Store
);

store_route.post("/nearestStore", store_controller.find_store);
module.exports = store_route;
