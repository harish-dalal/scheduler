import "./App.css";
import TaskList from "./components/TaskList";
import SocketContext, { socket } from "./services/socket";

function App() {
  return (
    <SocketContext.Provider value={SocketContext._currentValue}>
      <TaskList />
    </SocketContext.Provider>
  );
}

export default App;
