const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

var salt = bcrypt.genSaltSync(10);

router.post(
  "/registration",
  [
    body("email", "Invalid email").isEmail(),
    // password must be at least 5 chars long
    body(
      "password",
      "Password should be more than or equal to 5 characters"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let email = req.body.email;
    try {
      let userdata = await User.findOne({ email: email });

      if (userdata) {
        return res.status(400).json({
          message:
            "User already exist, please login or used another email to register.",
        });
      }
      const securepassword = await bcrypt.hashSync(req.body.password, salt);

      await User.create({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        password: securepassword,
        role: req.body.role,
        location: req.body.location,
      });
      res.type("json").status(201).json({ success: true });
    } catch (err) {
      res.json({ success: false });
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Invalid email").isEmail(),
    // password must be at least 5 chars long
    body("password", "In correct password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    // let email = req.body.email;
    try {
      let userdata = await User.findOne({ email });
      if (!userdata) {
        return res
          .status(401)
          .json({ message: "User not found", success: false });
      }

      const comparepassword = await bcrypt.compare(password, userdata.password);
      if (!comparepassword) {
        return res.status(401).json({
          message:
            "In correct password, please try again with the correct password",
          success: false,
        });
      }

      return res.json({ message: "Login successful", success: true });
    } catch (err) {
      res.json({ err, success: false });
    }
  }
);

router.get("/users", async (req, res) => {
  const fetch_userdata = await mongoose.connection.db.collection("users");

  fetch_userdata.find({}).toArray(function (err, data) {
    if (err) {
      res.json({ err, success: false });
    } else {
      res.json({ data, success: true });
    }
  });
});

router.get("/users/:id", async (req, res) => {
  const fetch_userdata = await mongoose.connection.db.collection("users");
  let param = req.params.id;
  fetch_userdata.find({ email: param }).toArray(function (err, data) {
    if (err) {
      res.json({ err, success: false });
    } else {
      res.json({ data, success: true });
    }
  });
});

//Liveness check
router.get("/healthz", (req, res) => {
  res.send("Service OK");
});

module.exports = router;
