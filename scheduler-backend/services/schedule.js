const _ = require("lodash");

const scheduleLib = require("node-schedule");
const {
  ScheduledNotification,
  STATUS,
} = require("../models/scheduledNotification");
const schedule = {};

let io;

schedule.setIo = function (ioInstance) {
  io = ioInstance;
};

schedule.getJobs = function () {
  return scheduleLib.scheduledJobs;
};

schedule.createSchedule = async function (task) {
  try {
    // return if reminderTime is not set
    if (!task?.reminderTime) {
      return;
    }

    const createNextTaskInstance = async (date, task) => {
      const {
        recurrencePattern,
        title,
        description,
        priority,
        recurring,
        user,
      } = task;
      const newTask = new ScheduledNotification({
        title,
        description,
        priority,
        reminderTime: date,
        dueDate: date,
        recurring,
        recurrencePattern,
        user,
      });
      await newTask.save();

      scheduleLib.scheduleJob(newTask._id.toString(), date, async () => {
        const schedule = await ScheduledNotification.findById(newTask._id);

        // Notification logic if the status is incomplete
        if (schedule.status === STATUS.incomplete) {
          io.to(schedule.user.toString()).emit("reminder", task);
        }

        if (schedule.recurring)
          await createNextTaskInstance(getNextDueDate(schedule), schedule);
      });

      return newTask;
    };

    if (!task?.recurring) {
      // Schedule single occurrence task
      return await createNextTaskInstance(new Date(task?.reminderTime), task);
    } else {
      const time = getNextDueDate(task, true);
      return await createNextTaskInstance(time, task);
    }
  } catch (e) {
    throw e;
  }
};

const getNextDueDate = (task, includeToday = false) => {
  const { reminderTime, recurrencePattern } = task;
  const now = new Date();
  const currentDay = now.getDay();

  // Find the next available day in the recurrence pattern
  const nextDay =
    recurrencePattern.find((day) => {
      return includeToday ? day >= currentDay : day > currentDay;
    }) || recurrencePattern[0];

  // Calculate the next occurrence
  const nextDueDate = new Date(now);
  nextDueDate.setDate(
    now.getDate() +
      ((includeToday ? nextDay >= currentDay : nextDay > currentDay)
        ? nextDay - currentDay
        : nextDay + 7 - currentDay)
  );
  nextDueDate.setHours(
    reminderTime.getHours(),
    reminderTime.getMinutes(),
    0,
    0
  );

  return nextDueDate;
};

// schedule.reSchedule = async function () {
//   try {
//     const scheduledNotifications = await ScheduledNotification.find({});

//     scheduledNotifications.forEach((scheduledNotification) => {
//       const dayOfWeek = scheduledNotification.days.join(",");
//       const timeToSent = scheduledNotification.time.split(":");
//       const hours = timeToSent[0];
//       const minutes = timeToSent[1];

//       const scheduleId = scheduledNotification._id.toString();
//       const scheduleTimeout = `${minutes} ${hours} * * ${dayOfWeek}`;

//       scheduleLib.scheduleJob(scheduleId, scheduleTimeout, async () => {
//
//       });
//     });
//   } catch (e) {
//     throw e;
//   }
// };

module.exports = schedule;
