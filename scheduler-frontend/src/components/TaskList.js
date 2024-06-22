import React, { useState, useEffect, useContext } from "react";
import { getTasks, deleteTask, getUser } from "../services/tasks";
import { Button, KIND } from "baseui/button";
import { SIZE } from "baseui/input";
import SocketContext from "../services/socket";
import { Block } from "baseui/block";
import { Accordion, Panel } from "baseui/accordion";
import Task from "./Task";
import AddTask from "./AddTask";
import ReloadIcon from "../utils/ReloadIcon";

const TaskList = ({ onLogout }) => {
  const [tasks, setTasks] = useState([]);

  const socket = useContext(SocketContext);

  async function fetchTasks() {
    let response = await getTasks();
    if (response.status === 200) {
      setTasks(response.data.data.schedules);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    socket.emit("authenticate", getUser().userid);
    socket.on("reminder", (task) => {
      alert(`Reminder\n${task.title}\n${task.description}`);
      fetchTasks();
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
      <Block
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={"50px"}>
        <Block display="flex" flexDirection="column" justifyContent="end">
          {`Welcom ${getUser().username}`}
          <Button size={SIZE.mini} onClick={onLogout}>
            {`Log out ${getUser().userid}`}
          </Button>
        </Block>
      </Block>
      <Block display="flex" justifyContent="end">
        <Button onClick={fetchTasks} kind={KIND.tertiary} size={SIZE.mini}>
          Reload <ReloadIcon />
        </Button>
      </Block>
      <Accordion>
        <Panel title="Add Task">
          <AddTask setAllTask={setTasks} />
        </Panel>
      </Accordion>
      <Accordion>
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
