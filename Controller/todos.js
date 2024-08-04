const fs = require("fs");

const todosModel = require("../models/todo");

exports.getAllTodos = async (req, res) => {
  try {
    let allTodos = await todosModel
      .find({})
      .populate(
        "userId",
        "-_id -password -createdAt -updatedAt -__v -refreshTaken"
      );
    res.status(200).json({ message: "success", data: allTodos });
  } catch (err) {
    res.status(400).json();
  }
};

exports.getTodoByID = async (req, res) => {
  let { id } = req.params;
  try {
    let todo = await todosModel
      .findOne({ _id: id })
      .populate("userId", "-password -_id");
    if (!todo) return res.status(404).json({ message: "not found this todo" });
    res.status(200).json({ message: "success", data: todo });
  } catch (err) {
    res.status(400).json();
  }
};

exports.addTodo = async (req, res) => {
  let newTodo = req.body;
  newTodo.userId = req.id;
  try {
    let todo = await todosModel.create(newTodo);
    res.status(201).json({ message: "success", data: todo });
  } catch (err) {
    res.status(400).json();
  }
};

exports.deleteTodo = async (req, res) => {
  let { id } = req.params;
  try {
    await todosModel.findOneAndDelete({ _id: id });
    res.status(204).json();
  } catch (err) {
    res.status(404).json();
  }
};

exports.updateTodoByID = async (req, res) => {
  let { id } = req.params;
  let newTodo = req.body;
  try {
    let todo = await todosModel.findByIdAndUpdate(id, newTodo);
    res.status(200).json({ message: "succss", data: todo });
  } catch (err) {
    res.status(400).json();
  }
};

exports.viewAllTodos = async (req, res) => {
  let todos = await todosModel.find();
  res.render("todos", { todos });
};
