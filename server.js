const express = require("express");
const app = express();
const PORT = 3001;
const http = require('http');
const socketIo = require('socket.io');

const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

const server = http.createServer(app);
if(!io){
var io = new socketIo.Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});}

let messages = [];
let users = [];

  io.on('connection', (socket) => {
    console.log('New client connected');
    socket.emit('allMessages', messages);
  
    socket.on('message', (message,username) => {
      messages.push({username:username, message:message}); 
      io.emit('message', {username:username, message:message});
    });
    socket.on('join', (user) => {
      messages.push({username:user, message: user  + " joined the chat",status: "joined"}); 
      io.emit('message', {username:user, message: user  + " joined the chat", status: "joined"});
    })
  
    socket.on('user', (user) => {
      socket.username = user;
      socket.username = user;
      users.push(user); 
      io.emit('users', users);
  
    });
  
    socket.on('disconnect', () => {
      users = users.filter(user => user !== socket.username);
      users.map(user => socket.username == user ?
        messages = messages.filter(mess => !(mess.status === "joined" && mess.username === socket.username))
        :
        null
      )
      console.log('Client disconnected');
      io.emit('users', users);
    });
  });




app.get("/", (req, res) => {
 res.send("hello")
});

server.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
