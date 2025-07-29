// 前端 socket.io 連線與同步邏輯
// 請將此檔案在 index.html 的 chess.js 之後引入

const socket = io();
let onlineMode = false;
let onlineRoomId = null;
let onlinePlayerName = null;
let onlineSpectator = false;

// UI 綁定
window.addEventListener('DOMContentLoaded', () => {
  const entry = document.getElementById('online-entry');
  const joinBtn = document.getElementById('join-btn');
  const spectateBtn = document.getElementById('spectate-btn');
  const statusDiv = document.getElementById('online-status');

  joinBtn.onclick = () => {
    const roomId = document.getElementById('room-id').value.trim();
    const name = document.getElementById('player-name').value.trim();
    if (!roomId || !name) {
      statusDiv.textContent = '請輸入房號與暱稱';
      return;
    }
    socket.emit('joinRoom', { roomId, name, mode: 'play' });
    statusDiv.textContent = '正在加入房間...';
  };
  spectateBtn.onclick = () => {
    const roomId = document.getElementById('room-id').value.trim();
    const name = document.getElementById('player-name').value.trim() || '觀眾';
    if (!roomId) {
      statusDiv.textContent = '請輸入房號';
      return;
    }
    socket.emit('joinRoom', { roomId, name, mode: 'spectate' });
    statusDiv.textContent = '正在觀戰...';
  };

  // 伺服器回傳房間狀態
  socket.on('roomState', (room) => {
    if (room.status === 'playing' || room.players.length === 2) {
      entry.style.display = 'none';
      onlineMode = true;
      onlineRoomId = room.roomId;
      // 你可以根據 room.players 決定紅黑方
    } else if (room.status === 'waiting') {
      statusDiv.textContent = '等待另一位玩家加入...';
    }
  });

  socket.on('waitingForPlayer', () => {
    statusDiv.textContent = '等待另一位玩家加入...';
  });

  socket.on('startGame', (room) => {
    entry.style.display = 'none';
    onlineMode = true;
    statusDiv.textContent = '';
    // 你可以根據 room.players 決定紅黑方
    window.restartGame();
  });

  // 棋盤同步
  socket.on('move', ({ move, board, turn }) => {
    if (!window.gameState) return;
    window.gameState.board = board;
    window.gameState.currentPlayer = turn;
    window.gameState.moveHistory.push(move);
    window.renderBoard();
  });

  // 悔棋同步
  socket.on('undo', ({ board, moveHistory, turn }) => {
    if (!window.gameState) return;
    window.gameState.board = board;
    window.gameState.moveHistory = moveHistory;
    window.gameState.currentPlayer = turn;
    window.renderBoard();
  });

  // 聊天同步
  socket.on('chat', (msg) => {
    // 你可以在這裡顯示聊天訊息
    // 例如 appendChat(msg)
  });
});

// 攔截本地移動，改為送出 socket
function sendOnlineMove(fromRow, fromCol, toRow, toCol, piece) {
  if (!onlineMode) return false;
  const move = { fromRow, fromCol, toRow, toCol, piece };
  socket.emit('move', {
    roomId: onlineRoomId,
    move,
    board: window.gameState.board,
    turn: window.gameState.currentPlayer
  });
  return true;
}

// 攔截本地悔棋
function sendOnlineUndo() {
  if (!onlineMode) return false;
  socket.emit('undo', {
    roomId: onlineRoomId,
    board: window.gameState.board,
    moveHistory: window.gameState.moveHistory,
    turn: window.gameState.currentPlayer
  });
  return true;
}

// 你可以在 chess.js 的 movePiece、undoMove 內呼叫 sendOnlineMove/sendOnlineUndo 來同步
// 也可以根據 onlineMode 決定是否允許本地操作
