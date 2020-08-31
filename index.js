const express = require("express");
const app = express();
const cors = require("cors");

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
];

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

app.get("/", (req, res) => {
  res.send("<h1>Hello World Hi</h1>");
});

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((n) => n.id === id);
  if (note) return res.json(note);
  res.status(404).end();
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((n) => n.id !== id);
  res.status(204).end();
});

app.post("/api/notes", (req, res) => {
  let note = req.body;
  if (!note.content)
    return res.status(400).json({ error: "Content is required" });

  const id = notes[notes.length - 1].id + 1;

  const { content, important } = req.body;
  note = {
    content,
    id,
    date: new Date(),
    important: important || false,
  };
  notes = [...notes, note];

  res.json(note);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
