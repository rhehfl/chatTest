import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});
io.on('connection', (client) => {
  const connectedClientUserName = client.handshake.query.userName;
  console.log(`${connectedClientUserName}님이 들어왔습니다.`);
  client.broadcast.emit('new message', {
    userName: '관리자',
    message: `${connectedClientUserName}님이 들어왔습니다.`,
  });

  client.on('new message', (data) => {
    console.log(`보낸 유저 ${data.userName}`);
    console.log(data.userInput);
    io.emit('new message', {
      userName: data.userName,
      message: data.userInput,
    });
  });

  client.on('disconnect', () => {
    console.log(`${connectedClientUserName}님이 나갔습니다.`);
    io.emit('new message', {
      userName: '관리자',
      message: `${connectedClientUserName}님이 나갔습니다.`,
    });
  });
});
app.get('/message', (_, res) => res.send('Hello from express!'));

httpServer.listen(3000, () => {
  console.log('3000번 포트에서 실행 중입니다.');
});
