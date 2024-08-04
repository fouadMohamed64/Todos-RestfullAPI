const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      unique: [true, "title must be unique"],
      minLength: [3, "title must be at least 3 chracter"],
    },
    status: {
      type: String,
      enum: ["Todo", "In-progress", "Done"],
      default: "Todo",
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

let todosModel = mongoose.model("Todo", todoSchema);

module.exports = todosModel;
