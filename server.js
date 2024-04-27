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
var io = new socketIo.Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

let messages = [];
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.emit('allMessages', messages);

  socket.on('message', (message) => {
    console.log('Received message:', message);
    messages.push(message); 
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


app.get("/", (req, res) => {
 res.send("hello")
});

server.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
