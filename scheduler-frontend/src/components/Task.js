import React, { useState } from "react";
import { Panel } from "baseui/accordion";
import { Block } from "baseui/block";
import { Checkbox, LABEL_PLACEMENT } from "baseui/checkbox";
import { updateTaskStatus } from "../services/tasks";
import { Button, SHAPE, SIZE, KIND } from "baseui/button";
import { Delete } from "baseui/icon";
import { SelectedDaysDisplay } from "./AddTask";

function formatTime(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  let strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
}

const TaskBody = ({ task }) => {
  return (
    <Block>
      <Block>{task?.description}</Block>
      {task?.reminderTime && (
        <Block>
          <Block>{formatTime(new Date(task.reminderTime))}</Block>
          {task?.recurring ? (
            <SelectedDaysDisplay task={task} />
          ) : (
            <Block>{formatDate(new Date(task.reminderTime))}</Block>
          )}
        </Block>
      )}
    </Block>
  );
};

const TaskTitle = ({ title, isComplete, setIsComplete, handleDeleteTask }) => {
  return (
    <Block
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      width="100%">
      <Checkbox
        checked={isComplete}
        onChange={(e) => setIsComplete(e.target.checked)}
        labelPlacement={LABEL_PLACEMENT.right}>
        {title}
      </Checkbox>
      <Button
        kind={KIND.tertiary}
        size={SIZE.mini}
        onClick={handleDeleteTask}
        shape={SHAPE.circle}>
        <Delete />
      </Button>
    </Block>
  );
};

const Task = (props) => {
  const { task, handleDeleteTask } = props;
  const [isComplete, setIsComplete] = useState(
    task.status === "complete" ?? false
  );

  const handleOncomplete = async (value) => {
    try {
      const response = await updateTaskStatus(task._id, value);
      if (response.status === 200) {
        setIsComplete(value);
      } else {
        alert("Failed to update task status.");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert(`An error occurred while updating the task ${task._id}`);
    }
  };

  return (
    <Panel
      {...props}
      title={
        <TaskTitle
          title={task.title}
          isComplete={isComplete}
          setIsComplete={handleOncomplete}
          handleDeleteTask={() => handleDeleteTask(task._id)}
        />
      }>
      <TaskBody task={task} />
    </Panel>
  );
};

export default Task;
