const express = require("express");
const socketIo = require("socket.io");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"],
  },
});

require("./db");

app.use(cors());
app.use(express.json());

app.use("/api", require("./route"));

const schedule = require("./services/schedule");
schedule.setIo(io);

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("authenticate", (userId) => {
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

module.exports = { server, io }; 
