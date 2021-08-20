const express = require("express");
const router = require("express").Router();
const validator = require("validator");
const User = require("../models/model");
const bcrypt = require("bcrypt");
const authorize = require("../middleware/authorize");
const cookieparser = require("cookie-parser");

router.use(express.urlencoded({ extended: false }));
router.use(cookieparser());

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, cpassword } = req.body;

    if (!name || !email || !password || !cpassword) {
      return res.status(422).json({ msg: "please fill all data" });
    }
    if (password != cpassword) {
      return res.status(422).json({ msg: "password are not match" });
    }
    if (!validator.isEmail(email)) {
      return res.status(422).json({ msg: "invalid email" });
    }
    if (password.length < 6) {
      return res.status(422).json({ msg: "password must be 6 character" });
    }
    const matchEmail = await User.findOne({ email });
    if (matchEmail) {
      return res.status(422).json({ msg: "Email already use" });
    }

    const user = new User({
      name,
      email,
      password,
      cpassword,
    });

    const newUser = await user.save();

    res.status(201).send(newUser);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(422).json({ msg: "fill all data" });
    }
    const loginUser = await User.findOne({ email });
    if (!loginUser) {
      return res.status(422).json({ msg: "invalid login details (email)" });
    }
    const matchPass = await bcrypt.compare(password, loginUser.password);

    if (!matchPass) {
      return res.status(422).json({ msg: "invalid login details (pass)" });
    }

    const token = await loginUser.getTokenGenerate();
    res.cookie("nazmulcookie", token, {
      expires: new Date(Date.now() + 300000),
      httpOnly: true,
    });

    res.status(200).render("home");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/", authorize, (req, res) => {
  // console.log(req.cookies.nazmulcookie);
  res.render("home");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/logout", authorize, async (req, res) => {
  try {
    // ! single divece remove
    // req.uservarify.tokens = req.uservarify.tokens.filter((curnt) => {
    //   return curnt.token != req.token;
    // });
    // ! all divece remove
    req.uservarify.tokens = [];

    res.clearCookie("nazmulcookie");
    await req.uservarify.save();
    res.render("login");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/register", (req, res) => {
  res.render("register");
});

module.exports = router;
