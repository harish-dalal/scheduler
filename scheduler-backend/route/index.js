const express = require("express");
const router = express.Router();

const { ScheduledNotification } = require("../models/scheduledNotification");
const { check, validationResult } = require("express-validator");
const schedule = require("../services/schedule");
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");

// user routes
router.post(
  "/signin",
  [check("username").not().isEmpty().withMessage("Username is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username } = req.body;

    try {
      let user = await User.findOne({ username });
      if (!user) {
        user = new User({ username });
        await user.save();
      }

      res.json({ userId: user._id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Tasks routes
router.post("/task", authMiddleware, async function (req, res) {
  try {
    const userId = req.userId;
    const payload = {
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      reminderTime: req.body.reminderTime,
      dueDate: req.body.dueDate,
      recurring: req.body.recurring,
      recurrencePattern: req.body.recurrencePattern,
      user: userId,
    };

    console.log(payload);

    let task = new ScheduledNotification(payload);
    if (!task.reminderTime) await task.save();
    else task = await schedule.createSchedule(task);

    res.json({
      data: task,
      message: "Task created successfully",
      success: true,
    });
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
});

router.get("/task", authMiddleware, async function (req, res) {
  try {
    console.log(req.userId);

    let schedules = await ScheduledNotification.find({ user: req.userId });

    res.json({
      data: { schedules },
      status: "success",
      message: "Successfully fetched schedules for user",
    });
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
});

router.put("/task/:taskId/status", async (req, res) => {
  const taskId = req.params.taskId;
  const { status } = req.body;

  try {
    const updatedTask = await ScheduledNotification.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ message: "Task not found", success: false });
    }

    res.json({
      data: updatedTask,
      status: "success",
      message: "Task status updated successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message, success: false });
  }
});

router.delete(
  "/task/:taskId/delete",
  authMiddleware,
  async function (req, res) {
    try {
      const taskId = req.params.taskId;
      const list = schedule.getJobs();
      const currentJob = list[taskId];

      await ScheduledNotification.findByIdAndDelete(taskId);

      if (currentJob) currentJob.cancel();

      res.json({
        data: {},
        status: "success",
        message: "successfull",
      });
    } catch (e) {
      res.status(400).json({ message: e.message, success: false });
    }
  }
);

module.exports = router;
