import React, { useState, useEffect, useContext } from "react";
import { createTask, getTasks, deleteTask, getUser } from "../services/tasks";
import { Button } from "baseui/button";
import { SIZE } from "baseui/input";
import SocketContext from "../services/socket";
import { Block } from "baseui/block";
import { Accordion, Panel } from "baseui/accordion";
import Task from "./Task";
import AddTask from "./AddTask";
import { useStyletron } from "baseui";

const TaskList = ({ onLogout }) => {
  const [css, theme] = useStyletron();
  const [tasks, setTasks] = useState([]);

  const socket = useContext(SocketContext);

  useEffect(() => {
    async function fetchTasks() {
      let response = await getTasks();
      if (response.status === 200) {
        setTasks(response.data.data.schedules);
      }
    }
    fetchTasks();
  }, []);

  useEffect(() => {
    socket.emit("authenticate", getUser());
    socket.on("reminder", (task) => {
      alert(`Reminder: ${task.title} is due!`);
    });

    return () => {
      socket.off("reminder");
    };
  }, [socket]);

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    setTasks(tasks.filter((task) => task._id !== taskId));
  };

  return (
    <Block display={"flex"} flexDirection="column">
      <Block display="flex" justifyContent="end" marginBottom={"100px"}>
        <Button size={SIZE.mini} onClick={onLogout}>
          {`Log out ${getUser()}`}
        </Button>
      </Block>
      <Accordion>
        <Panel title="Add Task">
          <AddTask setAllTask={setTasks} />
        </Panel>
      </Accordion>
      <Accordion onChange={({ expanded }) => console.log(expanded)} accordion>
        {tasks &&
          tasks?.map((task) => (
            <Task
              key={task._id}
              task={task}
              handleDeleteTask={handleDeleteTask}
            />
          ))}
      </Accordion>
    </Block>
  );
};

export default TaskList;
