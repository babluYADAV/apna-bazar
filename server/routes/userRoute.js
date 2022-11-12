const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const user_controller = require("../controllers/userController");

const user_route = express();
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

user_route.use(express.static("public"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/userImages"), (error, success) => {
      if (error) throw error;
    });
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

user_route.post(
  "/register",
  upload.single("image"),
  user_controller.register_user
);
user_route.post("/login", user_controller.login_user);

user_route.post("/updatePassword", user_controller.update_user_password);
user_route.post("/forgetPassword", user_controller.forget_user_password);
user_route.get("/resetPassword", user_controller.reset_user_password);

module.exports = user_route;
