const express = require("express");
const router = express.Router();

const ScheduledNotification = require("../models/scheduledNotification");
const schedule = require("../services/schedule");
const User = require("../models/user");

router.post("/user", async function (req, res) {
  try {
    const payload = {
      name: req.body.name,
      token: req.body.token,
    };

    const user = new User(payload);
    await user.save();

    res.json({
      data: { user },
      message: "User Created successfully",
      success: true,
    });
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
});

router.post("/task", async function (req, res) {
  try {
    const payload = {
      time: req.body.time,
      days: req.body.days,
      title: req.body.title,
      body: req.body.body,
    };

    await schedule.createSchedule(payload);

    res.json({
      data: {},
      message: "Success",
      success: true,
    });
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
});

router.get("/task", async function (req, res) {
  try {
    const list = schedule.getJobs();
    const keys = Object.keys(list);

    let schedules = await ScheduledNotification.find({});

    schedules = schedules.filter((item) => keys.includes(item._id.toString()));

    res.json({
      data: { schedules },
      status: "success",
      message: "successfull",
    });
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
});

router.delete("/task", async function (req, res) {
  try {
    const jobId = req.body.id;
    const list = schedule.getJobs();
    const currentJob = list[jobId];

    if (!currentJob) throw new Error("Job not found");

    await ScheduledNotification.findByIdAndRemove(jobId);

    currentJob.cancel();

    res.json({
      data: {},
      status: "success",
      message: "successfull",
    });
  } catch (e) {
    res.status(400).json({ message: e.message, success: false });
  }
});

module.exports = router;