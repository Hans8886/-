// 棋譜回放模式管理
const ReplayModeManager = (function() {
    // 原始棋盤狀態
    let originalBoard = null;
    // 原始遊戲狀態
    let originalGameState = null;
    
    // 進入回放模式
    function enterReplayMode(gameState) {
        // 保存當前棋盤和遊戲狀態
        originalBoard = JSON.parse(JSON.stringify(gameState.board));
        originalGameState = {
            currentPlayer: gameState.currentPlayer,
            isCheck: gameState.isCheck,
            gameOver: gameState.gameOver,
            winner: gameState.winner,
            checkingPiece: gameState.checkingPiece
        };
        
        // 禁用遊戲控制
        const undoBtn = document.getElementById('undo-btn');
        const aiModeSelect = document.getElementById('ai-mode');
        
        if (undoBtn) undoBtn.disabled = true;
        if (aiModeSelect) aiModeSelect.disabled = true;
        
        // 清空棋盤
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                gameState.board[row][col] = null;
            }
        }
        
        // 設置回放模式標誌
        gameState.replayMode = true;
        
        return gameState;
    }
    
    // 退出回放模式
    function exitReplayMode(gameState) {
        // 恢復原始棋盤和遊戲狀態
        if (originalBoard) {
            gameState.board = originalBoard;
            originalBoard = null;
        }
        
        if (originalGameState) {
            gameState.currentPlayer = originalGameState.currentPlayer;
            gameState.isCheck = originalGameState.isCheck;
            gameState.gameOver = originalGameState.gameOver;
            gameState.winner = originalGameState.winner;
            gameState.checkingPiece = originalGameState.checkingPiece;
            originalGameState = null;
        }
        
        // 啟用遊戲控制
        const undoBtn = document.getElementById('undo-btn');
        const aiModeSelect = document.getElementById('ai-mode');
        
        if (undoBtn) undoBtn.disabled = false;
        if (aiModeSelect) aiModeSelect.disabled = false;
        
        // 清除回放模式標誌
        gameState.replayMode = false;
        
        return gameState;
    }
    
    // 回放到指定步驟
    function replayToMove(gameState, moveIndex) {
        // 確保在回放模式
        if (!gameState.replayMode) return gameState;
        
        // 獲取棋譜數據
        const notationData = window.NotationManager.getNotationData();
        
        // 清空棋盤
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 9; col++) {
                gameState.board[row][col] = null;
            }
        }
        
        if (moveIndex < 0) {
            // 如果是初始狀態，顯示初始棋盤
            gameState.board = window.initializeBoard();
            gameState.currentPlayer = 'red';
            gameState.isCheck = false;
            gameState.checkingPiece = null;
        } else {
            // 重新初始化棋盤
            gameState.board = window.initializeBoard();
            
            // 執行到指定步驟的所有移動
            for (let i = 0; i <= moveIndex; i++) {
                if (i < notationData.length) {
                    const move = notationData[i].move;
                    
                    // 模擬移動
                    gameState.board[move.toRow][move.toCol] = move.piece;
                    gameState.board[move.fromRow][move.fromCol] = null;
                    
                    // 更新當前玩家
                    gameState.currentPlayer = move.player === 'red' ? 'black' : 'red';
                    
                    // 更新將軍狀態
                    if (i === moveIndex) {
                        gameState.isCheck = move.isCheck;
                        gameState.checkingPiece = move.checkingPiece;
                    }
                }
            }
        }
        
        return gameState;
    }
    
    // 公開API
    return {
        enterReplayMode,
        exitReplayMode,
        replayToMove
    };
})();

// 導出回放模式管理器
window.ReplayModeManager = ReplayModeManager;