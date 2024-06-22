import React, { useState } from "react";
import { BaseProvider, LightTheme } from "baseui";
import { Button } from "baseui/button";
import { FormControl } from "baseui/form-control";
import { Input, SIZE } from "baseui/input";
import { DatePicker } from "baseui/datepicker";
import { TimePicker } from "baseui/timepicker";
import { Textarea } from "baseui/textarea";
import { ButtonGroup } from "baseui/button-group";
import { createTask } from "../services/tasks";
import { Block } from "baseui/block";
import { Checkbox, STYLE_TYPE, LABEL_PLACEMENT } from "baseui/checkbox";

const CustomTimePicker = ({ label, value, onChange }) => {
  return (
    <FormControl label={label}>
      <TimePicker
        size={SIZE.mini}
        creatable
        value={value}
        onChange={onChange}
      />
    </FormControl>
  );
};

const CustomDatePicker = ({ label, value, onChange }) => {
  return (
    <FormControl label={label}>
      <DatePicker
        size={SIZE.mini}
        creatable
        value={value}
        onChange={onChange}
      />
    </FormControl>
  );
};

export const daysOfWeek = [
  { label: "S", value: 0 },
  { label: "M", value: 1 },
  { label: "T", value: 2 },
  { label: "W", value: 3 },
  { label: "T", value: 4 },
  { label: "F", value: 5 },
  { label: "S", value: 6 },
];

export const SelectedDaysDisplay = ({ task }) => {
  return (
    <ButtonGroup
      mode="checkbox"
      selected={task.recurrencePattern}
      overrides={{
        Root: {
          style: {
            marginTop: "10px",
            display: "flex",
          },
        },
      }}>
      {daysOfWeek.map((day) => (
        <Button
          key={day.value}
          disabled
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                borderRadius: "50%",
                marginRight: $theme.sizing.scale200,
                width: "20px",
                height: "20px",
                padding: 0,
                fontSize: ".8em",
                backgroundColor: task.days?.includes(day.value)
                  ? $theme.colors.accent
                  : $theme.colors.backgroundTertiary,
                color: task.days?.includes(day.value)
                  ? $theme.colors.buttonPrimaryText
                  : $theme.colors.contentPrimary,
                cursor: "default",
              }),
            },
          }}>
          {day.label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

const DayToggle = ({ task, setTask }) => {
  const handleDayChange = (value) => {
    setTask((task) => {
      let days = task.days;
      days = days.includes(value)
        ? days.filter((day) => day !== value)
        : [...days, value];
      return {
        ...task,
        ...{ date: days.length === 0 ? new Date() : "", days },
      };
    });
  };

  return (
    <ButtonGroup
      mode="checkbox"
      selected={task.days}
      onClick={(_, index) => handleDayChange(daysOfWeek[index].value)}
      overrides={{
        Root: {
          style: {
            display: "flex",
          },
        },
      }}>
      {daysOfWeek.map((day) => (
        <Button
          key={day.value}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                borderRadius: "50%",
                marginRight: $theme.sizing.scale200,
                width: "30px",
                height: "30px",
                fontSize: "1em",
                backgroundColor: task.days?.includes(day.value)
                  ? $theme.colors.accent
                  : $theme.colors.backgroundTertiary,
                color: task.days?.includes(day.value)
                  ? $theme.colors.buttonPrimaryText
                  : $theme.colors.contentPrimary,
              }),
            },
          }}>
          {day.label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

const defaultTask = {
  title: "",
  description: "",
  days: [],
  date: new Date(),
  time: new Date(),
};

const AddTask = ({ setAllTask }) => {
  const [task, setTask] = useState(defaultTask);
  const [isAlert, setIsAlert] = useState(false);

  const handleSubmit = async () => {
    // Simple validation function
    const validateTask = (task) => {
      if (!task.title || task.title.trim() === "") {
        return "Title is required.";
      }
      if (isAlert) {
        if (!task.reminderTime) {
          return "Reminder time is required.";
        }
      }
      return null;
    };

    const taskPayload = {
      title: task.title,
      description: task.description,
      priority: "0",
      reminderTime: isAlert ? task.time : "",
      dueDate: isAlert ? task.date : "",
      recurring: isAlert ? task.days.length > 0 : false,
      recurrencePattern: isAlert ? task.days : [],
    };

    const errorMessage = validateTask(taskPayload);
    if (errorMessage) {
      alert(errorMessage);
      return;
    }

    try {
      const response = await createTask(taskPayload);
      if (response.status === 200 && response.data.success) {
        setAllTask((tasks) => [...tasks, response.data.data]);
      } else {
        alert("Failed to create task.");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("An error occurred while creating the task.");
    }
  };

  return (
    <BaseProvider theme={LightTheme}>
      <FormControl label="Title">
        <Input
          value={task.title}
          size={SIZE.mini}
          onChange={(e) =>
            setTask((task) => ({ ...task, ...{ title: e.target.value } }))
          }
          overrides={{
            Input: {
              style: ({ $theme }) => ({
                resize: "vertical",
              }),
            },
          }}
        />
      </FormControl>
      <FormControl label="Description">
        <Textarea
          value={task.description}
          onChange={(e) =>
            setTask((task) => ({
              ...task,
              ...{ description: e.target.value },
            }))
          }
          overrides={{
            Input: {
              style: ({ $theme }) => ({
                minHeight: "100px",
                resize: "vertical",
              }),
            },
          }}
        />
      </FormControl>

      <Checkbox
        checked={isAlert}
        checkmarkType={STYLE_TYPE.toggle}
        onChange={(e) => setIsAlert(e.target.checked)}
        labelPlacement={LABEL_PLACEMENT.right}>
        alert
      </Checkbox>

      {isAlert && (
        <Block>
          <CustomDatePicker
            label="Select Date"
            value={task.date}
            onChange={({ date }) =>
              setTask((task) => ({
                ...task,
                ...{
                  date:
                    date || task.days.length === 0
                      ? date
                        ? new Date(date)
                        : new Date()
                      : "",
                  days: [],
                },
              }))
            }
          />
          <CustomTimePicker
            label="Select Time"
            value={task.time}
            onChange={(time) =>
              setTask((task) => ({ ...task, ...{ time: new Date(time) } }))
            }
          />
          <FormControl label="Select Days">
            <DayToggle task={task} setTask={setTask} />
          </FormControl>
        </Block>
      )}

      <Button
        overrides={{
          BaseButton: {
            style: ({ $theme }) => ({
              marginTop: $theme.sizing.scale700,
            }),
          },
        }}
        size={SIZE.mini}
        onClick={handleSubmit}>
        Add Task
      </Button>
    </BaseProvider>
  );
};

export default AddTask;
