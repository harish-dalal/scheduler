import "./App.css";
import React, { useState } from "react";
import TaskList from "./components/TaskList";
import SocketContext from "./services/socket";
import { Client as Styletron } from "styletron-engine-monolithic";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider, styled } from "baseui";
import { Block } from "baseui/block";
import Login from "./components/Login";
import { HeadingLarge } from "baseui/typography";

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

  const handleLogin = (userid, username = "user") => {
    localStorage.setItem("userid", userid);
    localStorage.setItem("username", username);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("userid");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
  };

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <Centered>
          <Block width="100%" maxWidth="500px">
            <HeadingLarge>Scheduler</HeadingLarge>
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
