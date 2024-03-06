const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();

todoSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true
  },
  done: {
    type: Boolean,
    default: false 
  }
});

const TODO = mongoose.model("tasks", todoSchema);

const tasksRouter = express.Router();

tasksRouter.get("/todos", async (req, resp) => {
  try {
    const perPage = parseInt(req.query.perPage) || 10;
    const page = Math.max(0, parseInt(req.query.page) || 0)

    const tasks = await TODO.find().limit(perPage).skip(perPage * page).exec();
    const count = await  TODO.countDocuments().exec();
    resp.json({ 
      tasks, 
      page: page,
      totalPages: Math.ceil(count / perPage)
    });
  } catch (err) {
    resp.status(500).json({ message: err.message });
  }
});

tasksRouter.post("/todos", async (req, res) => {
  const todo = new TODO({
    task: req.body.task,
  });
  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

tasksRouter.get("/todos/:id", async (req, res) => {
  try {
    const task = await TODO.findById(req.params.id);
    if (task == null) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

tasksRouter.put("/todos/:id", async (req, res) => {
  try {
    const task = await TODO.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.done = !task.done;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
tasksRouter.delete("/todos/:id", async (req, res) => {
  try {
    const task = await TODO.findByIdAndDelete(req.params.id);
    if (task == null) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = tasksRouter;
