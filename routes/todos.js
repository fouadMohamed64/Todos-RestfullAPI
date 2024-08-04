const express = require("express");
const fs = require("fs");
const { auth, restrictTo } = require("../middleware/auth");
const router = express.Router();

const {
  getAllTodos,
  getTodoByID,
  addTodo,
  deleteTodo,
  updateTodoByID,
  viewAllTodos,
} = require("../Controller/todos");

router.get("/", getAllTodos);
router.post("/", auth, restrictTo("Admin", "User"), addTodo);
router.get("/:id", auth, restrictTo("Admin", "User"), getTodoByID);
router.delete("/:id", auth, restrictTo("Admin"), deleteTodo);
router.patch("/:id", auth, restrictTo("Admin"), updateTodoByID);
router.get("/view/api", viewAllTodos);

module.exports = router;
