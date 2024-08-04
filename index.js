const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const todosRouter = require("./routes/todos");
const usersRouter = require("./routes/users");
const app = express();

dotenv.config();

app.use(express.json());
app.use(express.static("./static"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.set("view engine", "pug");
app.set("views", "./views");

app.use("/todos", todosRouter);
app.use("/users", usersRouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/TodosApi")
  .then(() => console.log("connecting to DB sucssfully...."))
  .catch((err) => console.log(err));

app.use(
  cors({
    origin: "*",
    methods: "*",
  })
);

app.use("*", (req, res, next) => {
  res.status(404).json({ message: ` ${req.baseUrl} not found...` });
});

app.listen(5555, () => {
  console.log("connected sucssfully on port 5555...");
});
