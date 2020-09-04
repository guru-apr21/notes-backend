const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/User");

usersRouter.get("/", async (req, res) => {
  const data = await User.find().populate("notes");
  res.json(data);
});

usersRouter.post("/", async (request, response) => {
  const body = request.body;

  //   const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(body.password, 10);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.json(savedUser);
});

module.exports = usersRouter;
