const express = require("express");
const socketIo = require("socket.io");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow your frontend domain
    methods: ["GET", "POST"],
  },
});

const schedule = require("./services/schedule");

require("./db");

app.use(cors());
app.use(express.json());

app.use("/api", require("./route"));

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("authenticate", (userId) => {
    console.log(userId);
    socket.join(userId);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// schedule.reSchedule();

server.listen(5000, () => {
  console.log("Server is running on PORT 5000");
});
