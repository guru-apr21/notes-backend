const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const User = require("../models/User");

router.get("/", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

router.get("/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  note ? res.json(note) : res.status(404).end();
});

router.delete("/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

router.post("/", async (req, res) => {
  if (!req.body.content)
    return res.status(400).json({ error: "Content is required" });

  const user = await User.findById(req.body.userId);

  const { content, important } = req.body;

  let note = new Note({
    content,
    important: important || false,
    user: user._id,
  });

  note = await note.save();

  user.notes = [...user.notes, note._id];
  await user.save();
  res.json(note);
});

router.put("/:id", async (res, req) => {
  console.log(req.params.id);
  const id = req.params.id;
  const updateNote = {
    content: req.body.content,
    important: req.body.important,
  };
  const note = await findByIdAndUpdate(id, updateNote, { new: true });
  res.send(note);
});

module.exports = router;
