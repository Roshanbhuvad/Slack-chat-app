const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "Admin";

//Run when client connects
io.on("connection", (socket) => {
  //console.log("New WS connection ...");

  //this below emit for only single client who are going to connect or join the group
  socket.emit("message", formatMessage(botName, "Welcome to Slack chat")); //we are transferring welcome message to main.js socket.on method

  //Broadcast when a user connects
  socket.broadcast.emit(
    "message",
    formatMessage(botName, "A user has joined the chat")
  ); //this emit send message(broadcast) to all existing users except the connecting user

  // Runs when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "A user has left the chat"));
  });
  //io.emit(); //this emit for all the users including the connecting user also

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage("USER", msg));
  });
});
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
