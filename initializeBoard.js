// 初始化棋盤函數
window.initializeBoard = function() {
    // 創建一個10x9的空棋盤
    const board = Array(10).fill().map(() => Array(9).fill(null));

    // 紅方棋子（底部）
    board[9][0] = { type: 'rook', color: 'red', name: '車' };
    board[9][1] = { type: 'horse', color: 'red', name: '馬' };
    board[9][2] = { type: 'elephant', color: 'red', name: '相' };
    board[9][3] = { type: 'advisor', color: 'red', name: '仕' };
    board[9][4] = { type: 'king', color: 'red', name: '帥' };
    board[9][5] = { type: 'advisor', color: 'red', name: '仕' };
    board[9][6] = { type: 'elephant', color: 'red', name: '相' };
    board[9][7] = { type: 'horse', color: 'red', name: '馬' };
    board[9][8] = { type: 'rook', color: 'red', name: '車' };
    board[7][1] = { type: 'cannon', color: 'red', name: '炮' };
    board[7][7] = { type: 'cannon', color: 'red', name: '炮' };
    board[6][0] = { type: 'pawn', color: 'red', name: '兵' };
    board[6][2] = { type: 'pawn', color: 'red', name: '兵' };
    board[6][4] = { type: 'pawn', color: 'red', name: '兵' };
    board[6][6] = { type: 'pawn', color: 'red', name: '兵' };
    board[6][8] = { type: 'pawn', color: 'red', name: '兵' };

    // 黑方棋子（頂部）
    board[0][0] = { type: 'rook', color: 'black', name: '車' };
    board[0][1] = { type: 'horse', color: 'black', name: '馬' };
    board[0][2] = { type: 'elephant', color: 'black', name: '象' };
    board[0][3] = { type: 'advisor', color: 'black', name: '士' };
    board[0][4] = { type: 'king', color: 'black', name: '將' };
    board[0][5] = { type: 'advisor', color: 'black', name: '士' };
    board[0][6] = { type: 'elephant', color: 'black', name: '象' };
    board[0][7] = { type: 'horse', color: 'black', name: '馬' };
    board[0][8] = { type: 'rook', color: 'black', name: '車' };
    board[2][1] = { type: 'cannon', color: 'black', name: '炮' };
    board[2][7] = { type: 'cannon', color: 'black', name: '炮' };
    board[3][0] = { type: 'pawn', color: 'black', name: '卒' };
    board[3][2] = { type: 'pawn', color: 'black', name: '卒' };
    board[3][4] = { type: 'pawn', color: 'black', name: '卒' };
    board[3][6] = { type: 'pawn', color: 'black', name: '卒' };
    board[3][8] = { type: 'pawn', color: 'black', name: '卒' };

    return board;
};
