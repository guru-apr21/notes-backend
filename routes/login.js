const express = require("express");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("api/login", async () => {
  const body = req.body;

  const user = await User.findOne({ username: body.username });
  const password = await bcrypt.compare(body.password, user.passwordHash);

  if (!(user && password))
    return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, name: user.name },
    process.env.jwtPrivateKey
  );

  res.status(200).send({ token, name: user.name, username: user.username });
});

module.exports = router;
