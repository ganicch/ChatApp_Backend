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
      console.log('Received message:', message, username);
      messages.push({username:username, message:message}); 
      io.emit('message', {username:username, message:message});
    });
  
    socket.on('user', (user) => {
      console.log('User joined', user);
      socket.username = user;
      users.push(user); 
      io.emit('users', users);
  
    });
    /*socket.on('notification', (user) => {
      socket.emit('notify', socket.username);
    });*/

  
    socket.on('disconnect', () => {
      users = users.filter(user => user !== socket.username);
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
