// 中國象棋遊戲邏輯
document.addEventListener('DOMContentLoaded', function() {
    // 初始化遊戲狀態
    window.gameState = {
        board: window.initializeBoard(),
        selectedPiece: null,
        currentPlayer: 'red',
        moveHistory: [],
        isCheck: false,
        gameOver: false,
        winner: null,
        validMoves: [],
        checkingPiece: null,
        replayMode: false,
        aiMode: 'off'
    };

    // 初始化棋盤UI
    initializeUI();
    
    // 渲染初始棋盤
    renderBoard();
    
    // 綁定事件處理
    bindEvents();
    
    // 如果有音效管理器，播放背景音樂
    if (window.SoundManager) {
        setTimeout(() => {
            window.SoundManager.playBackground();
        }, 1000);
    }
    
    // 導出渲染函數到全局
    window.renderBoard = renderBoard;
    window.restartGame = restartGame;
    
    // 初始化UI元素
    function initializeUI() {
        const chessboard = document.getElementById('chessboard');
        if (!chessboard) return;
        
        // 清空棋盤
        chessboard.innerHTML = '';
        
        // 創建棋盤格子
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // 添加河流區域標記
                if (row === 4 || row === 5) {
                    cell.classList.add('river');
                }
                
                // 添加九宮區域標記
                if ((row <= 2 || row >= 7) && col >= 3 && col <= 5) {
                    cell.classList.add('palace');
                }
                
                // 添加點位標記（兵、炮的位置）
                if ((row === 3 || row === 6) && (col === 0 || col === 2 || col === 4 || col === 6 || col === 8)) {
                    const dot = document.createElement('div');
                    dot.className = 'dot-marker';
                    cell.appendChild(dot);
                }
                
                // 綁定點擊事件
                cell.addEventListener('click', function() {
                    handleCellClick(row, col);
                });
                
                chessboard.appendChild(cell);
            }
        }
        
        // 添加回放覆蓋層
        const container = document.getElementById('chessboard-container');
        if (container) {
            const overlay = document.createElement('div');
            overlay.className = 'replay-overlay';
            const message = document.createElement('div');
            message.className = 'replay-message';
            message.textContent = '回放模式';
            overlay.appendChild(message);
            container.appendChild(overlay);
        }
    }
    
    // 渲染棋盤
    function renderBoard() {
        const { board, selectedPiece, validMoves, isCheck, checkingPiece } = window.gameState;
        const chessboard = document.getElementById('chessboard');
        if (!chessboard) return;
        chessboard.innerHTML = '';
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // 添加河流區域標記
                if (row === 4 || row === 5) {
                    cell.classList.add('river');
                }
                
                // 添加九宮區域標記
                if ((row <= 2 || row >= 7) && col >= 3 && col <= 5) {
                    cell.classList.add('palace');
                }
                
                // 添加點位標記（兵、炮的位置）
                if ((row === 3 || row === 6) && (col === 0 || col === 2 || col === 4 || col === 6 || col === 8)) {
                    const dot = document.createElement('div');
                    dot.className = 'dot-marker';
                    cell.appendChild(dot);
                }
                
                // 產生棋子
                const piece = board[row][col];
                if (piece) {
                    const pieceDiv = document.createElement('div');
                    pieceDiv.className = 'piece ' + (piece.color === 'red' ? 'red-piece' : 'black-piece');
                    pieceDiv.textContent = piece.name || '';
                    cell.appendChild(pieceDiv);
                }
                
                // 綁定點擊事件
                cell.addEventListener('click', function() {
                    handleCellClick(row, col);
                });
                
                chessboard.appendChild(cell);
            }
        }
        
        // 添加回放覆蓋層
        const container = document.getElementById('chessboard-container');
        if (container) {
            const overlay = document.createElement('div');
            overlay.className = 'replay-overlay';
            const message = document.createElement('div');
            message.className = 'replay-message';
            message.textContent = '回放模式';
            overlay.appendChild(message);
            container.appendChild(overlay);
        }
    }
    
    // 處理格子點擊事件
    function handleCellClick(row, col) {
        // 如果在回放模式或遊戲結束，不處理點擊
        if (window.gameState.replayMode || window.gameState.gameOver) {
            return;
        }
        
        const { board, selectedPiece, currentPlayer } = window.gameState;
        const clickedPiece = board[row][col];
        
        // 如果點擊的是自己的棋子，選中它
        if (clickedPiece && clickedPiece.color === currentPlayer) {
            selectPiece(row, col);
            // 播放選擇音效
            if (window.SoundManager) {
                window.SoundManager.play('select');
            }
            return;
        }
        
        // 如果已經選中了棋子，嘗試移動
        if (selectedPiece) {
            // 檢查是否是有效移動
            const isValidMove = window.gameState.validMoves.some(
                move => move.row === row && move.col === col
            );
            
            if (isValidMove) {
                // 執行移動
                movePiece(selectedPiece.row, selectedPiece.col, row, col);
                // 清除選中狀態
                window.gameState.selectedPiece = null;
                window.gameState.validMoves = [];
                
                // 播放移動或吃子音效
                if (window.SoundManager) {
                    if (clickedPiece) {
                        window.SoundManager.play('capture');
                    } else {
                        window.SoundManager.play('move');
                    }
                }
            } else {
                // 無效移動，清除選中狀態
                window.gameState.selectedPiece = null;
                window.gameState.validMoves = [];
                // 播放錯誤音效
                if (window.SoundManager) {
                    window.SoundManager.play('error');
                }
            }
            
            // 重新渲染棋盤
            renderBoard();
        }
    }
    
    // 選中棋子
    function selectPiece(row, col) {
        const piece = window.gameState.board[row][col];
        
        // 確保選中的是當前玩家的棋子
        if (piece && piece.color === window.gameState.currentPlayer) {
            window.gameState.selectedPiece = { row, col, piece };
            
            // 計算有效移動
            window.gameState.validMoves = getValidMoves(row, col, piece);
            
            // 渲染棋盤
            renderBoard();
        }
    }
    
    // 移動棋子
    function movePiece(fromRow, fromCol, toRow, toCol) {
        // 線上對戰時，僅由主控端送出同步，不重複執行本地移動
        if (typeof sendOnlineMove === 'function' && window.onlineMode) {
            if (sendOnlineMove(fromRow, fromCol, toRow, toCol, window.gameState.board[fromRow][fromCol])) return;
        }
        const { board, currentPlayer } = window.gameState;
        const piece = board[fromRow][fromCol];
        const capturedPiece = board[toRow][toCol];
        
        // 記錄移動歷史，用於悔棋
        window.gameState.moveHistory.push({
            fromRow,
            fromCol,
            toRow,
            toCol,
            piece: JSON.parse(JSON.stringify(piece)),
            capturedPiece: capturedPiece ? JSON.parse(JSON.stringify(capturedPiece)) : null,
            isCheck: window.gameState.isCheck,
            checkingPiece: window.gameState.checkingPiece
        });
        
        // 執行移動
        board[toRow][toCol] = piece;
        board[fromRow][fromCol] = null;
        
        // 檢查是否將軍
        const checkResult = isKingInCheckDetailed(board, currentPlayer === 'red' ? 'black' : 'red');
        window.gameState.isCheck = checkResult.inCheck;
        window.gameState.checkingPiece = checkResult.checkingPiece;
        
        // 檢查是否將死（遊戲結束）
        if (window.gameState.isCheck) {
            const isCheckmate = isCheckmated(board, currentPlayer === 'red' ? 'black' : 'red');
            
            if (isCheckmate) {
                window.gameState.gameOver = true;
                window.gameState.winner = currentPlayer;
                
                // 播放勝利音效
                if (window.SoundManager) {
                    window.SoundManager.play('victory');
                }
                
                // 顯示遊戲結束訊息
                showGameOverMessage(currentPlayer);
                
                // 通知棋譜管理器遊戲結束
                if (window.NotationManager) {
                    window.NotationManager.onGameOver();
                }
            } else {
                // 播放將軍音效
                if (window.SoundManager) {
                    window.SoundManager.play('check');
                }
            }
        }
        
        // 添加到棋譜
        if (window.NotationManager) {
            window.NotationManager.addMove({
                piece,
                fromRow,
                fromCol,
                toRow,
                toCol,
                player: currentPlayer,
                isCheck: window.gameState.isCheck,
                checkingPiece: window.gameState.checkingPiece
            });
        }
        
        // 切換玩家
        window.gameState.currentPlayer = currentPlayer === 'red' ? 'black' : 'red';
        
        // 如果啟用了AI模式，且當前玩家是AI控制的，觸發AI移動
        if (!window.gameState.gameOver) {
            const aiMode = document.getElementById('ai-mode').value;
            
            if ((aiMode === 'black' && window.gameState.currentPlayer === 'black') ||
                (aiMode === 'red' && window.gameState.currentPlayer === 'red') ||
                (aiMode === 'both')) {
                // 延遲執行AI移動，讓玩家可以看到自己的移動結果
                setTimeout(makeAIMove, 500);
            }
        }
    }
    
    // 獲取有效移動
    function getValidMoves(row, col, piece) {
        const { board, currentPlayer } = window.gameState;
        
        // 獲取該棋子的所有可能移動
        const possibleMoves = getPossibleMoves(row, col, piece, board);
        
        // 過濾掉會導致自己被將軍的移動
        return possibleMoves.filter(move => {
            // 模擬移動
            const tempBoard = JSON.parse(JSON.stringify(board));
            tempBoard[move.row][move.col] = piece;
            tempBoard[row][col] = null;
            
            // 檢查移動後是否會被將軍
            return !isKingInCheck(tempBoard, currentPlayer);
        });
    }
    
    // 獲取棋子的所有可能移動（不考慮將軍）
    function getPossibleMoves(row, col, piece, board) {
        const { type, color } = piece;
        const moves = [];
        
        switch (type) {
            case 'king':
                // 將/帥只能在九宮內移動
                const kingDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                
                for (const [dr, dc] of kingDirections) {
                    const r = row + dr;
                    const c = col + dc;
                    
                    // 確保在棋盤範圍內
                    if (r >= 0 && r < 10 && c >= 0 && c < 9) {
                        // 確保在九宮內
                        if (color === 'red') {
                            // 紅方九宮：(7-9, 3-5)
                            if (r >= 7 && r <= 9 && c >= 3 && c <= 5) {
                                // 確保目標位置沒有自己的棋子
                                if (!board[r][c] || board[r][c].color !== color) {
                                    moves.push({ row: r, col: c });
                                }
                            }
                        } else {
                            // 黑方九宮：(0-2, 3-5)
                            if (r >= 0 && r <= 2 && c >= 3 && c <= 5) {
                                // 確保目標位置沒有自己的棋子
                                if (!board[r][c] || board[r][c].color !== color) {
                                    moves.push({ row: r, col: c });
                                }
                            }
                        }
                    }
                }
                
                // 檢查將帥是否面對面（隔河相望）
                const oppositeKingCol = findOppositeKing(board, row, col, color);
                if (oppositeKingCol !== -1) {
                    moves.push({ row: color === 'red' ? 0 : 9, col: oppositeKingCol });
                }
                break;
                
            case 'advisor':
                // 仕/士只能在九宮內沿對角線移動
                const advisorDirections = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
                
                for (const [dr, dc] of advisorDirections) {
                    const r = row + dr;
                    const c = col + dc;
                    
                    // 確保在棋盤範圍內
                    if (r >= 0 && r < 10 && c >= 0 && c < 9) {
                        // 確保在九宮內
                        if (color === 'red') {
                            // 紅方九宮：(7-9, 3-5)
                            if (r >= 7 && r <= 9 && c >= 3 && c <= 5) {
                                // 確保目標位置沒有自己的棋子
                                if (!board[r][c] || board[r][c].color !== color) {
                                    moves.push({ row: r, col: c });
                                }
                            }
                        } else {
                            // 黑方九宮：(0-2, 3-5)
                            if (r >= 0 && r <= 2 && c >= 3 && c <= 5) {
                                // 確保目標位置沒有自己的棋子
                                if (!board[r][c] || board[r][c].color !== color) {
                                    moves.push({ row: r, col: c });
                                }
                            }
                        }
                    }
                }
                break;
                
            case 'elephant':
                // 相/象只能在己方領地內沿田字格移動
                const elephantDirections = [[-2, -2], [-2, 2], [2, -2], [2, 2]];
                
                for (const [dr, dc] of elephantDirections) {
                    const r = row + dr;
                    const c = col + dc;
                    
                    // 確保在棋盤範圍內
                    if (r >= 0 && r < 10 && c >= 0 && c < 9) {
                        // 確保在己方領地內（不過河）
                        if ((color === 'red' && r >= 5) || (color === 'black' && r <= 4)) {
                            // 檢查象眼是否被塞住
                            const eyeRow = row + dr / 2;
                            const eyeCol = col + dc / 2;
                            
                            if (!board[eyeRow][eyeCol]) {
                                // 確保目標位置沒有自己的棋子
                                if (!board[r][c] || board[r][c].color !== color) {
                                    moves.push({ row: r, col: c });
                                }
                            }
                        }
                    }
                }
                break;
                
            case 'horse':
                // 馬走日字，但會被絆馬腿
                const horseDirections = [
                    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                    [1, -2], [1, 2], [2, -1], [2, 1]
                ];
                for (const [dr, dc] of horseDirections) {
                    const r = row + dr;
                    const c = col + dc;
                    
                    // 確保在棋盤範圍內
                    if (r >= 0 && r < 10 && c >= 0 && c < 9) {
                        // 檢查蹩馬腿
                        let legRow = row;
                        let legCol = col;
                        
                        if (Math.abs(dr) === 2) {
                            legRow = row + dr / 2;
                        } else {
                            legCol = col + dc / 2;
                        }
                        
                        if (!board[legRow][legCol]) {
                            // 確保目標位置沒有自己的棋子
                            if (!board[r][c] || board[r][c].color !== color) {
                                moves.push({ row: r, col: c });
                            }
                        }
                    }
                }
                break;
                
            case 'rook':
                // 車可以直線移動任意距離
                const rookDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                for (const [dr, dc] of rookDirections) {
                    for (let i = 1; i < 10; i++) {
                        const r = row + dr * i;
                        const c = col + dc * i;
                        
                        // 確保在棋盤範圍內
                        if (r >= 0 && r < 10 && c >= 0 && c < 9) {
                            // 如果遇到棋子
                            if (board[r][c]) {
                                // 如果是敵方棋子，可以吃掉
                                if (board[r][c].color !== color) {
                                    moves.push({ row: r, col: c });
                                }
                                // 無論是敵方還是己方棋子，都不能再往前走
                                break;
                            } else {
                                // 空位置可以移動
                                moves.push({ row: r, col: c });
                            }
                        } else {
                            // 超出棋盤範圍，停止
                            break;
                        }
                    }
                }
                break;
                
            case 'cannon':
                // 炮移動和車相似，但吃子需要隔一個棋子
                const cannonDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                for (const [dr, dc] of cannonDirections) {
                    let hasPlatform = false; // 是否有炮台
                    
                    for (let i = 1; i < 10; i++) {
                        const r = row + dr * i;
                        const c = col + dc * i;
                        
                        // 確保在棋盤範圍內
                        if (r >= 0 && r < 10 && c >= 0 && c < 9) {
                            // 如果還沒有炮台
                            if (!hasPlatform) {
                                // 遇到棋子，設置為炮台
                                if (board[r][c]) {
                                    hasPlatform = true;
                                } else {
                                    // 空位置可以移動
                                    moves.push({ row: r, col: c });
                                }
                            } else {
                                // 已經有炮台
                                // 遇到第二個棋子
                                if (board[r][c]) {
                                    // 如果是敵方棋子，可以吃掉
                                    if (board[r][c].color !== color) {
                                        moves.push({ row: r, col: c });
                                    }
                                    // 無論是敵方還是己方棋子，都不能再往前走
                                    break;
                                }
                                // 空位置繼續查找
                            }
                        } else {
                            // 超出棋盤範圍，停止
                            break;
                        }
                    }
                }
                break;
                
            case 'pawn':
                // 兵/卒只能向前移動，過河後可以左右移動
                // 紅方向上，黑方向下
                if (color === 'red') {
                    // 向上移動
                    if (row - 1 >= 0 && (!board[row - 1][col] || board[row - 1][col].color !== color)) {
                        moves.push({ row: row - 1, col });
                    }
                    
                    // 過河後可以左右移動
                    if (row < 5) {
                        // 向左移動
                        if (col - 1 >= 0 && (!board[row][col - 1] || board[row][col - 1].color !== color)) {
                            moves.push({ row, col: col - 1 });
                        }
                        // 向右移動
                        if (col + 1 < 9 && (!board[row][col + 1] || board[row][col + 1].color !== color)) {
                            moves.push({ row, col: col + 1 });
                        }
                    }
                } else {
                    // 向下移動
                    if (row + 1 < 10 && (!board[row + 1][col] || board[row + 1][col].color !== color)) {
                        moves.push({ row: row + 1, col });
                    }
                    
                    // 過河後可以左右移動
                    if (row > 4) {
                        // 向左移動
                        if (col - 1 >= 0 && (!board[row][col - 1] || board[row][col - 1].color !== color)) {
                            moves.push({ row, col: col - 1 });
                        }
                        // 向右移動
                        if (col + 1 < 9 && (!board[row][col + 1] || board[row][col + 1].color !== color)) {
                            moves.push({ row, col: col + 1 });
                        }
                    }
                }
                break;
        }
        
        return moves;
    }
    
    // 檢查是否將軍
    function isKingInCheck(board, playerColor) {
        // 找到指定顏色的將/帥
        let kingRow = -1;
        let kingCol = -1;
        
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = board[row][col];
                if (piece && piece.type === 'king' && piece.color === playerColor) {
                    kingRow = row;
                    kingCol = col;
                    break;
                }
            }
            if (kingRow !== -1) break;
        }
        
        // 如果找不到將/帥，返回false（理論上不應該發生）
        if (kingRow === -1) return false;
        
        // 檢查是否有任何敵方棋子可以吃掉將/帥
        const opponentColor = playerColor === 'red' ? 'black' : 'red';
        
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = board[row][col];
                if (piece && piece.color === opponentColor) {
                    const moves = getPossibleMoves(row, col, piece, board);
                    if (moves.some(move => move.row === kingRow && move.col === kingCol)) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    // 檢查是否將軍（詳細版，返回將軍的棋子位置）
    function isKingInCheckDetailed(board, playerColor) {
        // 找到指定顏色的將/帥
        let kingRow = -1;
        let kingCol = -1;
        
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = board[row][col];
                if (piece && piece.type === 'king' && piece.color === playerColor) {
                    kingRow = row;
                    kingCol = col;
                    break;
                }
            }
            if (kingRow !== -1) break;
        }
        
        // 如果找不到將/帥，返回false（理論上不應該發生）
        if (kingRow === -1) return { inCheck: false, checkingPiece: null };
        
        // 檢查是否有任何敵方棋子可以吃掉將/帥
        const opponentColor = playerColor === 'red' ? 'black' : 'red';
        
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = board[row][col];
                if (piece && piece.color === opponentColor) {
                    const moves = getPossibleMoves(row, col, piece, board);
                    if (moves.some(move => move.row === kingRow && move.col === kingCol)) {
                        return { inCheck: true, checkingPiece: { row, col } };
                    }
                }
            }
        }
        
        return { inCheck: false, checkingPiece: null };
    }
    
    // 檢查是否將死
    function isCheckmated(board, playerColor) {
        // 如果沒有被將軍，則沒有將死
        if (!isKingInCheck(board, playerColor)) {
            return false;
        }
        
        // 檢查是否有任何移動可以解除將軍
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                const piece = board[row][col];
                if (piece && piece.color === playerColor) {
                    // 獲取所有可能的移動
                    const possibleMoves = getPossibleMoves(row, col, piece, board);
                    
                    // 檢查每一個移動是否能解除將軍
                    for (const move of possibleMoves) {
                        // 模擬移動
                        const tempBoard = JSON.parse(JSON.stringify(board));
                        tempBoard[move.row][move.col] = piece;
                        tempBoard[row][col] = null;
                        
                        // 檢查移動後是否仍然被將軍
                        if (!isKingInCheck(tempBoard, playerColor)) {
                            // 找到一個可以解除將軍的移動
                            return false;
                        }
                    }
                }
            }
        }
        
        // 沒有找到任何可以解除將軍的移動，將死
        return true;
    }
    
    // 尋找對方的將/帥（用於檢查將帥是否面對面）
    function findOppositeKing(board, kingRow, kingCol, kingColor) {
        const oppositeColor = kingColor === 'red' ? 'black' : 'red';
        
        // 檢查同一列上是否有對方的將/帥
        for (let row = 0; row < 10; row++) {
            const piece = board[row][kingCol];
            if (piece && piece.type === 'king' && piece.color === oppositeColor) {
                // 檢查中間是否有其他棋子
                let hasObstacle = false;
                const startRow = Math.min(kingRow, row);
                const endRow = Math.max(kingRow, row);
                
                for (let r = startRow + 1; r < endRow; r++) {
                    if (board[r][kingCol]) {
                        hasObstacle = true;
                        break;
                    }
                }
                
                // 如果沒有障礙物，可以直接吃掉對方的將/帥
                if (!hasObstacle) {
                    return kingCol;
                }
            }
        }
        
        return -1;
    }
    
    // 悔棋
    function undoMove() {
        // 線上對戰時，僅由主控端送出同步，不重複執行本地悔棋
        if (typeof sendOnlineUndo === 'function' && window.onlineMode) {
            if (sendOnlineUndo()) return;
        }
        if (window.gameState.moveHistory.length === 0) {
            return;
        }
        
        // 獲取最後一步移動
        const lastMove = window.gameState.moveHistory.pop();
        
        // 恢復棋盤狀態
        window.gameState.board[lastMove.fromRow][lastMove.fromCol] = lastMove.piece;
        window.gameState.board[lastMove.toRow][lastMove.toCol] = lastMove.capturedPiece;
        
        // 恢復將軍狀態
        window.gameState.isCheck = lastMove.isCheck;
        window.gameState.checkingPiece = lastMove.checkingPiece;
        
        // 恢復當前玩家
        window.gameState.currentPlayer = window.gameState.currentPlayer === 'red' ? 'black' : 'red';
        
        // 如果遊戲已經結束，恢復為未結束狀態
        window.gameState.gameOver = false;
        window.gameState.winner = null;
        
        // 清除選中狀態
        window.gameState.selectedPiece = null;
        window.gameState.validMoves = [];
        
        // 播放悔棋音效
        if (window.SoundManager) {
            window.SoundManager.play('undo');
        }
        
        // 更新棋譜
        if (window.NotationManager) {
            window.NotationManager.clearNotation();
            
            // 重新添加所有移動到棋譜
            for (const move of window.gameState.moveHistory) {
                window.NotationManager.addMove({
                    piece: move.piece,
                    fromRow: move.fromRow,
                    fromCol: move.fromCol,
                    toRow: move.toRow,
                    toCol: move.toCol,
                    player: move.piece.color,
                    isCheck: move.isCheck,
                    checkingPiece: move.checkingPiece
                });
            }
        }
        
        // 重新渲染棋盤
        renderBoard();
    }
    
    // 重新開始遊戲
    function restartGame() {
        // 重置遊戲狀態
        window.gameState = {
            board: window.initializeBoard(),
            selectedPiece: null,
            currentPlayer: 'red',
            moveHistory: [],
            isCheck: false,
            gameOver: false,
            winner: null,
            validMoves: [],
            checkingPiece: null,
            replayMode: false,
            aiMode: document.getElementById('ai-mode').value
        };
        
        // 清空棋譜
        if (window.NotationManager) {
            window.NotationManager.clearNotation();
        }
        
        // 播放開始音效
        if (window.SoundManager) {
            window.SoundManager.play('start');
        }
        
        // 重新渲染棋盤
        renderBoard();
    }
    
    // 顯示遊戲結束訊息
    function showGameOverMessage(winner) {
        const winnerText = winner === 'red' ? '紅方' : '黑方';
        
        // 創建遊戲結束覆蓋層
        const overlay = document.createElement('div');
        overlay.className = 'game-over-overlay active';
        
        const message = document.createElement('div');
        message.className = 'game-over-message';
        
        const title = document.createElement('h2');
        title.textContent = '遊戲結束';
        
        const content = document.createElement('p');
        content.textContent = `${winnerText}獲勝！`;
        
        const restartBtn = document.createElement('button');
        restartBtn.textContent = '再來一局';
        restartBtn.addEventListener('click', function() {
            document.body.removeChild(overlay);
            restartGame();
        });
        
        message.appendChild(title);
        message.appendChild(content);
        message.appendChild(restartBtn);
        overlay.appendChild(message);
        
        document.body.appendChild(overlay);
    }
    
    // AI移動
    function makeAIMove() {
        if (window.gameState.gameOver || window.gameState.replayMode) {
            return;
        }
        
        // 顯示AI思考中
        const thinkingElement = document.createElement('div');
        thinkingElement.className = 'thinking';
        thinkingElement.textContent = 'AI思考中';
        document.body.appendChild(thinkingElement);
        
        // 延遲執行，以顯示思考動畫
        setTimeout(() => {
            // 獲取當前玩家所有可能的移動
            const allMoves = [];
            
            for (let row = 0; row < 10; row++) {
                for (let col = 0; col < 9; col++) {
                    const piece = window.gameState.board[row][col];
                    if (piece && piece.color === window.gameState.currentPlayer) {
                        const validMoves = getValidMoves(row, col, piece);
                        
                        validMoves.forEach(move => {
                            allMoves.push({
                                fromRow: row,
                                fromCol: col,
                                toRow: move.row,
                                toCol: move.col,
                                piece: piece
                            });
                        });
                    }
                }
            }
            
            // 如果沒有可用的移動，遊戲結束
            if (allMoves.length === 0) {
                window.gameState.gameOver = true;
                window.gameState.winner = window.gameState.currentPlayer === 'red' ? 'black' : 'red';
                showGameOverMessage(window.gameState.winner);
                
                // 移除思考中提示
                document.body.removeChild(thinkingElement);
                return;
            }
            
            // 隨機選擇一個移動
            const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
            
            // 執行移動
            movePiece(randomMove.fromRow, randomMove.fromCol, randomMove.toRow, randomMove.toCol);
            
            // 移除思考中提示
            document.body.removeChild(thinkingElement);
            
            // 重新渲染棋盤
            renderBoard();
        }, 1000);
    }
    
    // 綁定事件處理
    function bindEvents() {
        // 悔棋按鈕
        const undoBtn = document.getElementById('undo-btn');
        if (undoBtn) {
            undoBtn.addEventListener('click', undoMove);
        }
        
        // 重新開始按鈕
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', restartGame);
        }
        
        // AI模式選擇
        const aiModeSelect = document.getElementById('ai-mode');
        if (aiModeSelect) {
            aiModeSelect.addEventListener('change', function() {
                window.gameState.aiMode = this.value;
                
                // 如果選擇了AI執紅，且當前是紅方回合，立即執行AI移動
                if ((this.value === 'red' || this.value === 'both') && window.gameState.currentPlayer === 'red') {
                    setTimeout(makeAIMove, 500);
                }
                
                // 如果選擇了AI執黑，且當前是黑方回合，立即執行AI移動
                if ((this.value === 'black' || this.value === 'both') && window.gameState.currentPlayer === 'black') {
                    setTimeout(makeAIMove, 500);
                }
            });
        }
        
        // 音效開關
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle && window.SoundManager) {
            soundToggle.addEventListener('change', function() {
                window.SoundManager.toggleSound(this.checked);
            });
        }
    }
});
// 在 makeAIMove 函數中添加以下代碼
function makeAIMove() {
    // 顯示AI思考中提示
    showThinkingIndicator();
    
    // 使用AI難度管理器設置當前難度
    if (window.AIDifficultyManager) {
        // 獲取當前AI難度設置
        const settings = window.AIDifficultyManager.getCurrentSettings();
        console.log("AI難度設置:", settings);
        
        // 使用setTimeout模擬AI思考時間
        setTimeout(() => {
            // 如果設置為簡單難度且隨機概率觸發，則隨機走棋
            if (window.AIDifficultyManager.shouldMakeRandomMove()) {
                console.log("AI選擇隨機走棋");
                const randomMove = getRandomValidMove(gameState.board, gameState.currentPlayer);
                if (randomMove) {
                    makeMove(randomMove.piece, randomMove.fromRow, randomMove.fromCol, 
                             randomMove.toRow, randomMove.toCol);
                    hideThinkingIndicator();
                    return;
                }
            }
            
            // 否則使用AI算法尋找最佳移動
            const searchDepth = window.AIDifficultyManager.getSearchDepth();
            console.log("AI搜索深度:", searchDepth);
            
            const bestMove = findBestMove(gameState.board, gameState.currentPlayer, searchDepth);
            
            if (bestMove) {
                makeMove(bestMove.piece, bestMove.fromRow, bestMove.fromCol, 
                         bestMove.toRow, bestMove.toCol);
            } else {
                // 如果沒有找到最佳移動，宣布對方獲勝
                gameState.gameOver = true;
                gameState.winner = gameState.currentPlayer === 'red' ? 'black' : 'red';
                showGameOverMessage(gameState.winner);
            }
            
            // 隱藏AI思考中提示
            hideThinkingIndicator();
        }, window.AIDifficultyManager.getThinkingTime());
    } else {
        // 如果沒有AI難度管理器，使用原有的AI邏輯
        // 這裡應該是您原有的AI代碼
        // ...
    }
}

// 獲取隨機有效移動（用於簡單難度）
function getRandomValidMove(board, player) {
    const allPieces = [];
    
    // 收集所有當前玩家的棋子
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 9; col++) {
            const piece = board[row][col];
            if (piece && piece.player === player) {
                allPieces.push({ piece, row, col });
            }
        }
    }
    
    // 隨機打亂棋子順序
    shuffleArray(allPieces);
    
    // 尋找第一個有效移動
    for (const { piece, row, col } of allPieces) {
        const validMoves = getValidMoves(row, col, piece);
        if (validMoves.length > 0) {
            // 隨機選擇一個有效移動
            const randomIndex = Math.floor(Math.random() * validMoves.length);
            const move = validMoves[randomIndex];
            return {
                piece,
                fromRow: row,
                fromCol: col,
                toRow: move.row,
                toCol: move.col
            };
        }
    }
    
    return null;
}

// 輔助函數：打亂數組
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 在評估函數中使用難度設置
function evaluateBoard(board, player) {
    let score = 0;
    // 您原有的評估邏輯...
    
    // 根據難度添加噪聲
    if (window.AIDifficultyManager) {
        score = window.AIDifficultyManager.addEvaluationNoise(score);
    }
    
    return score;
}