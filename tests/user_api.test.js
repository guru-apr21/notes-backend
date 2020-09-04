const bcrypt = require("bcrypt");
const User = require("../models/User");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const mongoose = require("mongoose");

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });

    const data = await user.save();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await api.get("/api/users");
    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await api.get("/api/users");
    expect(usersAtEnd.body).toHaveLength(usersAtStart.body.length + 1);

    const usernames = usersAtEnd.body.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await api.get("/api/users");

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("`username` to be unique");

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd.body).toHaveLength(usersAtStart.body.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
