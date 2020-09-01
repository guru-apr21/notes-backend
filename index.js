const express = require("express");
const app = express();
const cors = require("cors");
require("./config/db")();
const Note = require("./models/Note");

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

app.get("/", (req, res) => {
  res.send("<h1>Hello World Hi</h1>");
});

app.get("/api/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

app.get("/api/notes/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    res.json(note);
  } catch (err) {
    console.log("Something failed");
    res.end();
  }
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
    date: new Date(),
    important: important || false,
  });

  note = await note.save();
  res.json(note);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
