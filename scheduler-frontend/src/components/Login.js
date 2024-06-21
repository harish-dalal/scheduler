import React, { useState } from "react";
import { Button } from "baseui/button";
import { Input, SIZE } from "baseui/input";
import { Block } from "baseui/block";
import { useStyletron } from "baseui";
import { signin } from "../services/auth";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [css, theme] = useStyletron();

  const handleSubmit = async () => {
    if (!username) return;
    const response = await signin(username);
    if (response.status === 200) {
      onLogin(response.data.userId);
    }
  };

  return (
    <Block>
      <Input
        value={username}
        size={SIZE.mini}
        onChange={(e) => setUsername(e.target.value)}
      />
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
        Signin / Signup
      </Button>
    </Block>
  );
};

export default Login;
