const express = require("express");
const app = express();
const PORT = 3001;
const http = require('http');
const socketIo = require('socket.io');
const pool = require('./config/database_config')
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
    socket.emit('allMessages', messages);
  
    socket.on('message', (message,username) => {
      messages.push({username:username, message:message});
      pool.query('insert into messages (message,username) values($1,$2)',
      [message,username]) 
      io.emit('message', {username:username, message:message});
    });
    socket.on('join', (user) => {
      messages.push({username:user, message: user  + " joined the chat",status: "joined"});
      pool.query('insert into messages (message,status,username) values($1,$2,$3)',
      [user  + " joined the chat","joined",user]) 
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
      io.emit('users', users);
    });
  });

const userRouter = require("./routes/user")
app.use("/user",userRouter);

app.get("/", async (req, res) => {
   const mess = await pool.query('select * from messages');
   messages = mess.rows;
});

server.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
