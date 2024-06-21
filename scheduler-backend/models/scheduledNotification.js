const mongoose = require("mongoose");

const STATUS = {
  incomplete: "incomplete",
  complete: "complete",
};

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  priority: String,
  status: { type: String, default: STATUS.incomplete },
  canceled: { type: Boolean, default: false },
  reminderTime: Date,
  dueDate: { type: Date },
  recurring: { type: Boolean, default: false },
  recurrencePattern: { type: [Number] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const ScheduledNotification = mongoose.model(
  "scheduledNotification",
  taskSchema
);

module.exports = {
  ScheduledNotification,
  STATUS,
};
