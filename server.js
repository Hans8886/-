// 中國象棋雲端連線對戰伺服器 (Node.js + socket.io)
// 支援房間、聊天、觀戰、玩家配對
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;

// 房間資料結構
const rooms = {};

// 棋盤初始化（前端也要有同樣的初始化）
function getInitialBoard() {
  // 這裡只給一個空陣列，實際可根據你的 initializeBoard.js 實作
  return Array.from({ length: 10 }, () => Array(9).fill(null));
}

io.on('connection', (socket) => {
  let currentRoom = null;
  let playerName = null;

  // 加入房間
  socket.on('joinRoom', ({ roomId, name, mode }) => {
    playerName = name;
    currentRoom = roomId;
    socket.join(roomId);
    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: [],
        spectators: [],
        chat: [],
        board: getInitialBoard(),
        turn: 'red',
        moveHistory: [],
        status: 'waiting', // waiting, playing, finished
      };
    }
    if (mode === 'spectate') {
      rooms[roomId].spectators.push({ id: socket.id, name });
      socket.emit('roomState', rooms[roomId]);
    } else {
      if (rooms[roomId].players.length < 2) {
        rooms[roomId].players.push({ id: socket.id, name });
        if (rooms[roomId].players.length === 2) {
          rooms[roomId].status = 'playing';
          io.to(roomId).emit('startGame', rooms[roomId]);
        } else {
          socket.emit('waitingForPlayer');
        }
      } else {
        // 房間已滿，加入觀戰
        rooms[roomId].spectators.push({ id: socket.id, name });
        socket.emit('roomState', rooms[roomId]);
      }
    }
    io.to(roomId).emit('roomState', rooms[roomId]);
  });

  // 玩家移動
  socket.on('move', ({ roomId, move, board, turn }) => {
    if (!rooms[roomId]) return;
    rooms[roomId].board = board;
    rooms[roomId].moveHistory.push(move);
    rooms[roomId].turn = turn;
    io.to(roomId).emit('move', { move, board, turn });
  });

  // 聊天
  socket.on('chat', ({ roomId, name, message }) => {
    if (!rooms[roomId]) return;
    const chatMsg = { name, message, time: Date.now() };
    rooms[roomId].chat.push(chatMsg);
    io.to(roomId).emit('chat', chatMsg);
  });

  // 悔棋
  socket.on('undo', ({ roomId, board, moveHistory, turn }) => {
    if (!rooms[roomId]) return;
    rooms[roomId].board = board;
    rooms[roomId].moveHistory = moveHistory;
    rooms[roomId].turn = turn;
    io.to(roomId).emit('undo', { board, moveHistory, turn });
  });

  // 離開房間
  socket.on('disconnect', () => {
    if (currentRoom && rooms[currentRoom]) {
      rooms[currentRoom].players = rooms[currentRoom].players.filter(p => p.id !== socket.id);
      rooms[currentRoom].spectators = rooms[currentRoom].spectators.filter(s => s.id !== socket.id);
      if (rooms[currentRoom].players.length === 0 && rooms[currentRoom].spectators.length === 0) {
        delete rooms[currentRoom];
      } else {
        io.to(currentRoom).emit('roomState', rooms[currentRoom]);
      }
    }
  });
});

// 靜態檔案（可用於本地測試，雲端請用 CDN 或前端部署）
app.use(express.static('.'));

server.listen(PORT, () => {
  console.log(`中國象棋伺服器已啟動，端口 ${PORT}`);
});
