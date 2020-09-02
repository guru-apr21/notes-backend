require("express-async-errors");
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./config/db")();
const Note = require("./models/Note");

app.use(express.json());
app.use(express.static("build"));
app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>Hello World Hi</h1>");
});

app.get("/api/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

app.get("/api/notes/:id", async (req, res, next) => {
  const note = await Note.findById(req.params.id);
  note ? res.json(note) : res.status(404).end();
});

app.delete("/api/notes/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.post("/api/notes", async (req, res) => {
  if (!req.body.content)
    return res.status(400).json({ error: "Content is required" });

  const { content, important } = req.body;

  let note = new Note({
    content,
    important: important || false,
  });

  note = await note.save();
  res.json(note);
});

app.put("/api/notes/:id", async (res, req) => {
  const id = req.params.id;
  const updateNote = {
    content: req.body.content,
    important: req.body.important,
  };
  const note = await findByIdAndUpdate(id, updateNote, { new: true });
  res.send(note);
});

const errorHandler = (err, req, res, next) => {
  console.log(err.message);
  res.status(500).send({ error: "Something failed" });
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
