const mongoose = require("mongoose");

// const schema = new mongoose.Schema({
//   time: {
//     type: String,
//   },
//   days: {
//     type: [],
//   },
//   notification: {},
// });

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: {
    type: Date,
    required: function () {
      return !this.recurring;
    },
  },
  priority: String,
  status: { type: String, default: "incomplete" },
  canceled: { type: Boolean, default: false },
  reminderTime: Date,
  recurring: { type: Boolean, default: false },
  recurrencePattern: {
    type: [Number],
    validate: {
      validator: function (array) {
        return array.every((day) => day >= 0 && day <= 6);
      },
      message: "Recurrence pattern should be an array of days from 0 to 6",
    },
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const ScheduledNotification = mongoose.model("scheduledNotification", taskSchema);

module.exports = ScheduledNotification;