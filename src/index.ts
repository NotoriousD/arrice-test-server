import express, { Express, Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
const { v4: uuidv4 } = require('uuid');
import { Message, Room } from './types';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  path: '/socket',
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

const rooms: Room[] = [
  {
    id: "5e902e12-4874-4e87-b2e4-a5c22a1c0d42",
    name: "Javascript news"
  },
  {
    id: "31a40564-57cf-42fd-a223-6deca778b0f1",
    name: "NodeJS forum"
  }
];

const messages: Message[] = [
  {
    id: "2131231",
    username: "test",
    message: "asdasda",
    room: "31a40564-57cf-42fd-a223-6deca778b0f1"
  },
  {
    id: "21312332421",
    username: "test",
    message: "asdasda",
    room: "31a40564-57cf-42fd-a223-6deca778b0f1"
  },
];

io.on('connection', (socket) => {

  socket.on('room_join', (room) => {
    socket.join(room)

    const getMessagesByRoomId = messages.filter((message: Message) => message.room === room);

    socket.emit('messages_last', getMessagesByRoomId);

  })

  socket.on('send_message', (messageData) => {
    const { room } = messageData;

    const newMessage = {
      ...messageData,
      id: uuidv4()
    }

    messages.push(newMessage)

    io.in(room).emit('receive_message', newMessage);

    socket.on('room_leave', (room) => {
      socket.leave(room)
    })
  });
});

app.get('/rooms', (req: Request, res: Response) => {
  res.status(200).send(rooms)
})

server.listen(port, () => 'Server is running on port 4000');