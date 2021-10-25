import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000' },
});
const PORT = 4000;

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.get('/', (_, res) => {
  res.send('<h1>Hello React</h1>');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
