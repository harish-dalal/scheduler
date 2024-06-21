import React, { useState, useEffect, useContext } from "react";
import { createTask, getTasks, deleteTask } from "../services/tasks";
import SocketContext from "../services/socket";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");

  const socket = useContext(SocketContext);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await getTasks();
      console.log(response);
      setTasks(response.data);
    };
    fetchTasks();

    socket.emit("authenticate", "user_id");
    socket.on("reminder", (task) => {
      alert(`Reminder: ${task.title} is due!`);
    });

    return () => {
      socket.off("reminder");
    };
  }, [socket]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    const newTask = {
      title,
      description,
      dueDate,
      priority,
      reminderTime: dueDate,
    };
    const response = await createTask(newTask);
    setTasks([...tasks, response.data]);
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    setTasks(tasks.filter((task) => task._id !== taskId));
  };

  return (
    <div>
      <h2>Task List</h2>
      <form onSubmit={handleCreateTask}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">Select Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit">Add Task</button>
      </form>
      {/* <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.title} - {task.description}
            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default TaskList;
