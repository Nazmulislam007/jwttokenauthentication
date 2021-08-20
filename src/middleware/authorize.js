const jwt = require("jsonwebtoken");
const User = require("../models/model");

const authorize = async (req, res, next) => {
  try {
    const token = req.cookies.nazmulcookie;
    // console.log(token);
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    const uservarify = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });

    if (!uservarify) {
      throw new Error("user not valid");
    }
    req.token = token;
    req.uservarify = uservarify;

    next();
  } catch (error) {
    res.status(500).json({ msg: "please log in you id" });
  }
};
module.exports = authorize;
