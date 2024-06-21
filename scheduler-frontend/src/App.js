import "./App.css";
import React, { useState } from "react";
import TaskList from "./components/TaskList";
import SocketContext from "./services/socket";
import { Client as Styletron } from "styletron-engine-monolithic";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider, styled } from "baseui";
import { Block } from "baseui/block";
import Login from "./components/Login";

const engine = new Styletron();

const Centered = styled("div", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  margin: "20px",
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("userid")
  );

  const handleLogin = (username) => {
    localStorage.setItem("userid", username); // Replace 'your_user_id' with actual user ID or username
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("userid");
    setIsLoggedIn(false);
  };

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <Centered>
          <Block width="100%" maxWidth="500px">
            {isLoggedIn ? (
              <SocketContext.Provider value={SocketContext._currentValue}>
                <TaskList onLogout={handleLogout} />
              </SocketContext.Provider>
            ) : (
              <Login onLogin={handleLogin} />
            )}
          </Block>
        </Centered>
      </BaseProvider>
    </StyletronProvider>
  );
}

export default App;
