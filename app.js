require("express-async-errors");
const express = require("express");
const app = express();
const notesRouter = require("./routes/notes");
const userRouter = require("./routes/user");
const loginRouter = require("./routes/login");
const errorHandler = require("./middleware/error");
const cors = require("cors");
require("./startup/db")();

app.use(cors());
app.use(express.json());
app.use(express.static("build"));
app.use("/api/notes", notesRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

app.use(errorHandler);

module.exports = app;
