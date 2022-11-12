const jwt = require("jsonwebtoken");
const config = require("../config/config");

const verifyToken = (req, res, next) => {
  try {
    const token =
      req.body.token || req.query.token || req.headers["authorization"];
    if (!token) {
      res.status(200).send({
        success: true,
        message: "A token is required for this request",
      });
    }
    try {
      const decode = jwt.verify(token, config.secret_jwt);
      req.user = decode;
    } catch (error) {
      res.status(200).send({
        success: false,
        message: "A valide token is required for this request",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }

  return next();
};

module.exports = verifyToken;
