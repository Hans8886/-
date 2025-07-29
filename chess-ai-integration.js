// 這是一個示例，展示如何在chess.js中整合AI難度設置
// 假設chess.js中有一個AI相關的函數如下：

function makeAIMove() {
    // 顯示AI思考中提示
    showThinkingIndicator();
    
    // 獲取當前AI難度
    const difficulty = document.getElementById('ai-difficulty').value;
    
    // 設置AI難度
    if (window.AIDifficultyManager) {
        window.AIDifficultyManager.setDifficulty(difficulty);
    }
    
    // 使用setTimeout模擬AI思考時間
    setTimeout(() => {
        // 如果設置為簡單難度且隨機概率觸發，則隨機走棋
        if (window.AIDifficultyManager && window.AIDifficultyManager.shouldMakeRandomMove()) {
            const randomMove = getRandomValidMove(gameState.board, gameState.currentPlayer);
            if (randomMove) {
                makeMove(randomMove.piece, randomMove.fromRow, randomMove.fromCol, 
                         randomMove.toRow, randomMove.toCol);
                hideThinkingIndicator();
                return;
            }
        }
        
        // 否則使用AI算法尋找最佳移動
        const searchDepth = window.AIDifficultyManager ? 
                          window.AIDifficultyManager.getSearchDepth() : 2;
        
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
    }, window.AIDifficultyManager ? window.AIDifficultyManager.getThinkingTime() : 1500);
}

// 評估函數中使用難度設置
function evaluateBoard(board, player) {
    let score = 0;
    // 基本評估邏輯...
    
    // 根據難度添加噪聲
    if (window.AIDifficultyManager) {
        score = window.AIDifficultyManager.addEvaluationNoise(score);
    }
    
    return score;
}

// 在吃子評估中使用難度係數
function evaluateCapture(piece) {
    let value = getPieceValue(piece);
    
    // 根據難度調整吃子獎勵
    if (window.AIDifficultyManager) {
        value *= window.AIDifficultyManager.getCaptureBonus();
    }
    
    return value;
}

// 在將軍評估中使用難度係數
function evaluateCheck(isCheck, player) {
    let bonus = isCheck ? 50 : 0;
    
    // 根據難度調整將軍獎勵
    if (window.AIDifficultyManager) {
        bonus *= window.AIDifficultyManager.getCheckBonus();
    }
    
    return player === 'red' ? bonus : -bonus;
}