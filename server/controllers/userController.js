const User = require("../models/userModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const config = require("../config/config");

const securPassword = async (pass) => {
  try {
    const passwordHash = await bcryptjs.hash(pass, 10);
    return passwordHash;
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const create_token = async (id) => {
  try {
    const token = await jwt.sign({ _id: id }, config.secret_jwt);
    return token;
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const sendResetPasswordEmail = async (name, email, token) => {
  try {
    const transport = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        email: config.emailUser,
        pass: config.emailPassword,
      },
    });
    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: "Reset your password",
      html:
        "<p> Hi " +
        name +
        ', <a href="http://localhost:8000/api/resetPassword?token=' +
        token +
        '">please reset your password</a></p>',
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("mail not sent", error.message);
      } else {
        console.log("mail  sent", info.response);
      }
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const register_user = async (req, res) => {
  try {
    const securePass = await securPassword(req.body.password);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: securePass,
      image: req.file.filename,
      mobile: req.body.mobile,
      type: req.body.type,
    });

    const userData = await User.findOne({ email: req.body.email });
    if (userData) {
      res.status(200).send({
        success: false,
        message: "User already exist",
      });
    } else {
      const user_data = await user.save();
      res.status(200).send({
        success: true,
        user: user_data,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const login_user = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await User.findOne({ email: email });
    if (userData) {
      const passwordMatch = await bcryptjs.compare(password, userData.password);
      if (passwordMatch) {
        const tokenData = await create_token(userData._id);
        const userResult = {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          password: userData.password,
          image: userData.image,
          mobile: userData.mobile,
          type: userData.type,
          token: tokenData,
        };

        const response = {
          success: true,
          message: "User details",
          data: userResult,
        };
        res.status(200).send(response);
      } else {
        res.status(200).send({
          success: false,
          message: "User not found",
        });
      }
    } else {
      res.status(200).send({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const update_user_password = async (req, res) => {
  try {
    const user_id = req.body.id;
    const password = req.body.password;
    const userData = await User.findOne({ _id: user_id });

    if (userData) {
      const newPass = await securPassword(password);

      const updatePass = await User.findByIdAndUpdate(
        { _id: user_id },
        {
          $set: {
            password: newPass,
          },
        }
      );

      res.status(200).send({
        success: true,
        message: "Your password has been updated successfully",
        data: updatePass,
      });
    } else {
      res.status(200).send({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const forget_user_password = async (req, res) => {
  try {
    const email = req.body.email;
    const userData = await User.findOne({ email: email });

    if (userData) {
      const randomString = randomstring.generate();
      const data = User.updateOne(
        { email: email },
        {
          $set: {
            token: randomString,
          },
        }
      );
      sendResetPasswordEmail(userData.name, userData.email, randomString);
      res.status(200).send({
        success: true,
        message: "Mail is sent on registered email id ",
      });
    } else {
      res.status(200).send({
        success: true,
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const reset_user_password = async (req, res) => {
  try {
    const token = req.query.token;
    const userToken = await User.findOne({ token: token });
    if (userToken) {
      const password = req.body.password;
      const newPass = await securPassword(password);

      const userData = await User.findByIdAndUpdate(
        { _id: userToken._id },
        {
          $set: {
            password: newPass,
            token: "",
          },
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "User Password has been reset successfully",
        data: userData,
      });
    } else {
      res.status(200).send({
        success: true,
        message: "This link has been expired",
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  register_user,
  login_user,
  update_user_password,
  forget_user_password,
  reset_user_password,
};
