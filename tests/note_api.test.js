const mongoose = require("mongoose");
const supertest = require("supertest");
//const helper = require("../tests/test_helper");
const app = require("../app");
const Note = require("../models/Note");

const api = supertest(app);

const initialNotes = [
  {
    content: "HTML is easy",
    date: new Date(),
    important: false,
  },
  {
    content: "Browser can execute only Javascript",
    date: new Date(),
    important: true,
  },
];

beforeEach(async () => {
  await Note.deleteMany({});

  for (let note of initialNotes) {
    let noteObject = new Note(note);
    await noteObject.save();
  }
});

afterEach(async () => {
  await Note.deleteMany({});
});

test("notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all notes are returned", async () => {
  const response = await api.get("/api/notes");

  expect(response.body).toHaveLength(initialNotes.length);
});

test("a specific note is within the returned notes", async () => {
  const response = await api.get("/api/notes");

  const contents = response.body.map((r) => r.content);

  expect(contents).toContain("Browser can execute only Javascript");
});

test("a valid note can be added", async () => {
  const newNote = {
    content: "async/await simplifies making async calls",
    important: true,
  };

  await api
    .post("/api/notes")
    .send(newNote)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/notes");

  const contents = response.body.map((r) => r.content);

  expect(response.body).toHaveLength(initialNotes.length + 1);
  expect(contents).toContain("async/await simplifies making async calls");
});

test("notes without content is not added", async () => {
  const newNote = {
    important: false,
  };

  await api.post("/api/notes").send(newNote).expect(400);

  const response = await api.get("/api/notes");

  expect(response.body).toHaveLength(initialNotes.length);
});

test("a specific note can be viewed", async () => {
  const notesAtStart = await api.get("/api/notes");
  const noteToView = notesAtStart.body[0];
  console.log(notesAtStart);

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const processedNoteToView = JSON.parse(JSON.stringify(noteToView));

  expect(resultNote.body).toEqual(processedNoteToView);
});

test("a note can be deleted", async () => {
  const notesAtStart = await api.get("/api/notes");
  const noteToDelete = notesAtStart.body[0];

  await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

  const notesAtEnd = await api.get("api/notes");

  expect(notesAtEnd).toHaveLength(initialNotes.length - 1);

  const contents = notesAtEnd.map((r) => r.content);

  expect(contents).not.toContain(noteToDelete.content);
});

afterAll(() => {
  mongoose.connection.close();
});
