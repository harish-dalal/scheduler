import React, { useState } from "react";
import { Panel } from "baseui/accordion";
import { Block } from "baseui/block";
import { Checkbox, LABEL_PLACEMENT } from "baseui/checkbox";
import { updateTaskStatus } from "../services/tasks";
import { Button, SHAPE, SIZE, KIND } from "baseui/button";
import { Delete } from "baseui/icon";

const TaskBody = ({ task }) => {
  console.log(task);
  return (
    <Block>
      <Block>{task?.description}</Block>
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
    const response = await updateTaskStatus(task._id, value);
    if (response.status === 200) {
      setIsComplete(value);
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
