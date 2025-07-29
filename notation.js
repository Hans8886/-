// 棋譜管理器
const NotationManager = (function() {
    // 棋譜數據
    let notationData = [];
    
    // 棋子類型映射到中文名稱
    const pieceTypeMap = {
        'king': { red: '帥', black: '將' },
        'advisor': { red: '仕', black: '士' },
        'elephant': { red: '相', black: '象' },
        'horse': { red: '馬', black: '馬' },
        'rook': { red: '車', black: '車' },
        'cannon': { red: '炮', black: '炮' },
        'pawn': { red: '兵', black: '卒' }
    };
    
    // 列數映射到中文數字
    const colNumberMap = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
    
    // 添加移動到棋譜
    function addMove(moveRecord) {
        const notation = convertMoveToNotation(moveRecord);
        notationData.push({
                moveNumber: notationData.length + 1,
            player: moveRecord.player,
            notation: notation,
            move: moveRecord
        });
        
        // 更新棋譜顯示
        updateNotationDisplay();
            
        return notation;
        }
    
    // 將移動轉換為中文棋譜格式
    function convertMoveToNotation(moveRecord) {
        const { piece, fromRow, fromCol, toRow, toCol, player } = moveRecord;
        
        // 獲取棋子中文名稱
        const pieceName = pieceTypeMap[piece.type][player];
        
        // 獲取列數的中文表示
        const fromColName = colNumberMap[fromCol];
        const toColName = colNumberMap[toCol];
        
        // 根據紅黑方向不同，行數表示也不同
        let fromRowDesc, toRowDesc, direction;
        
        if (player === 'red') {
            // 紅方從下往上數，9-0
            fromRowDesc = 9 - fromRow + 1;
            toRowDesc = 9 - toRow + 1;
            
            // 判斷移動方向
            if (fromRow > toRow) {
                direction = '進';
            } else if (fromRow < toRow) {
                direction = '退';
            } else {
                direction = '平';
        }
        } else {
            // 黑方從上往下數，0-9
            fromRowDesc = fromRow + 1;
            toRowDesc = toRow + 1;
            
            // 判斷移動方向
            if (fromRow < toRow) {
                direction = '進';
            } else if (fromRow > toRow) {
                direction = '退';
            } else {
                direction = '平';
            }
        }
            // 構建棋譜文本
        let notation;
        
        if (direction === '平') {
            // 平移格式：棋子名稱 + 原位置行數 + 平 + 目標位置列數
            notation = `${pieceName}${fromRowDesc}${direction}${toColName}`;
        } else {
            if (piece.type === 'pawn' || piece.type === 'king') {
                // 兵和將/帥的格式：棋子名稱 + 原位置列數 + 進/退 + 步數
                const steps = Math.abs(fromRow - toRow);
                notation = `${pieceName}${fromColName}${direction}${steps}`;
            } else if (fromCol === toCol) {
                // 同列移動：棋子名稱 + 原位置列數 + 進/退 + 目標位置行數
                notation = `${pieceName}${fromColName}${direction}${toRowDesc}`;
            } else {
                // 其他情況：棋子名稱 + 原位置行數 + 進/退 + 目標位置列數
                notation = `${pieceName}${fromRowDesc}${direction}${toColName}`;
            }
        }
        
        return notation;
    }
    
    // 更新棋譜顯示
    function updateNotationDisplay() {
        const notationList = document.getElementById('notation-list');
        if (!notationList) return;
        
        // 清空當前顯示
        notationList.innerHTML = '';
        
        // 添加每一步棋譜
        notationData.forEach((item, index) => {
            const moveElement = document.createElement('div');
            moveElement.className = 'notation-move';
            moveElement.dataset.index = index;
            
            // 添加點擊事件用於回放
            moveElement.addEventListener('click', function() {
                replayMove(index);
            });
            
            // 移動編號
            const numberElement = document.createElement('div');
            numberElement.className = 'move-number';
            numberElement.textContent = item.moveNumber;
            
            // 玩家標識
            const playerElement = document.createElement('div');
            playerElement.className = `move-player ${item.player}`;
            playerElement.textContent = item.player === 'red' ? '紅' : '黑';
            
            // 棋譜文本
            const textElement = document.createElement('div');
            textElement.className = 'move-text';
            textElement.textContent = item.notation;
            
            moveElement.appendChild(numberElement);
            moveElement.appendChild(playerElement);
            moveElement.appendChild(textElement);
            
            notationList.appendChild(moveElement);
        });
        
        // 滾動到最新的棋譜
        notationList.scrollTop = notationList.scrollHeight;
        }
    
    // 回放指定步驟
    function replayMove(index) {
        // 獲取所有棋譜元素
        const moveElements = document.querySelectorAll('.notation-move');
        
        // 移除當前標記
        moveElements.forEach(el => el.classList.remove('current'));
        
        // 標記當前回放的步驟
        if (moveElements[index]) {
            moveElements[index].classList.add('current');
    }
    
        // 如果還沒有進入回放模式，則進入
        if (!window.gameState || !window.gameState.replayMode) {
            enterReplayMode();
        }
        
        // 使用回放管理器回放到指定步驟
        if (window.ReplayModeManager && window.gameState) {
            window.ReplayModeManager.replayToMove(window.gameState, index);
            window.renderBoard();
        }
    }
    
    // 進入回放模式
    function enterReplayMode() {
        if (window.gameState && window.ReplayModeManager) {
            window.ReplayModeManager.enterReplayMode(window.gameState);
            
            // 顯示回放覆蓋層
            const overlay = document.querySelector('.replay-overlay');
            if (overlay) overlay.classList.add('active');
            
            // 禁用遊戲控制
            const undoBtn = document.getElementById('undo-btn');
            const aiModeSelect = document.getElementById('ai-mode');
            
            if (undoBtn) undoBtn.disabled = true;
            if (aiModeSelect) aiModeSelect.disabled = true;
        }
    }
    
    // 退出回放模式
    function exitReplayMode() {
        if (window.gameState && window.ReplayModeManager) {
            window.ReplayModeManager.exitReplayMode(window.gameState);
            
            // 隱藏回放覆蓋層
            const overlay = document.querySelector('.replay-overlay');
            if (overlay) overlay.classList.remove('active');
            
            // 啟用遊戲控制
            const undoBtn = document.getElementById('undo-btn');
            const aiModeSelect = document.getElementById('ai-mode');
            
            if (undoBtn) undoBtn.disabled = false;
            if (aiModeSelect) aiModeSelect.disabled = false;
            
            // 移除當前標記
            const moveElements = document.querySelectorAll('.notation-move');
            moveElements.forEach(el => el.classList.remove('current'));
            
            // 重新渲染棋盤
            if (window.renderBoard) window.renderBoard();
        }
    }
    
    // 自動回放
    function autoReplay() {
        let currentIndex = -1;
        const maxIndex = notationData.length - 1;
        
        // 進入回放模式
        enterReplayMode();
        
        // 定時器函數
        function playNextMove() {
            currentIndex++;
            
            if (currentIndex <= maxIndex) {
                replayMove(currentIndex);
                setTimeout(playNextMove, 1500); // 每1.5秒播放一步
            } else {
                // 回放結束
                setTimeout(exitReplayMode, 1000);
            }
        }
        
        // 開始播放
        playNextMove();
    }
    
    // 匯出棋譜
    function exportNotation() {
        if (notationData.length === 0) {
            alert('沒有棋譜可匯出');
            return;
        }
        
        // 構建棋譜文本
        let notationText = '中國象棋棋譜\n';
        notationText += '-------------\n';
        notationText += `日期: ${new Date().toLocaleDateString()}\n`;
        notationText += '-------------\n\n';
        
        notationData.forEach(item => {
            notationText += `${item.moveNumber}. ${item.player === 'red' ? '紅' : '黑'}: ${item.notation}\n`;
        });
        
        // 創建下載鏈接
        const blob = new Blob([notationText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `象棋棋譜_${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // 清空棋譜
    function clearNotation() {
        notationData = [];
        updateNotationDisplay();
    }
    
    // 獲取棋譜數據
    function getNotationData() {
        return notationData;
    }
    
    // 遊戲結束處理
    function onGameOver() {
        // 可以在這裡添加遊戲結束時的棋譜處理邏輯
        console.log('遊戲結束，棋譜記錄完成');
    }
    
    // 初始化棋譜控制按鈕
    function initNotationControls() {
        // 匯出棋譜按鈕
        const exportBtn = document.getElementById('export-notation');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportNotation);
        }
        
        // 回放控制按鈕
        const firstBtn = document.getElementById('replay-first');
        const prevBtn = document.getElementById('replay-prev');
        const nextBtn = document.getElementById('replay-next');
        const lastBtn = document.getElementById('replay-last');
        const autoBtn = document.getElementById('replay-auto');
        const exitBtn = document.getElementById('replay-exit');
        
        if (firstBtn) {
            firstBtn.addEventListener('click', function() {
                replayMove(-1); // 回到初始狀態
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                // 獲取當前選中的棋譜
                const current = document.querySelector('.notation-move.current');
                let index = current ? parseInt(current.dataset.index) : notationData.length - 1;
                
                // 上一步
                index = Math.max(-1, index - 1);
                replayMove(index);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                // 獲取當前選中的棋譜
                const current = document.querySelector('.notation-move.current');
                let index = current ? parseInt(current.dataset.index) : -1;
                
                // 下一步
                index = Math.min(notationData.length - 1, index + 1);
                replayMove(index);
            });
        }
        
        if (lastBtn) {
            lastBtn.addEventListener('click', function() {
                // 跳到最後一步
                if (notationData.length > 0) {
                    replayMove(notationData.length - 1);
                }
            });
        }
        
        if (autoBtn) {
            autoBtn.addEventListener('click', autoReplay);
        }
        
        if (exitBtn) {
            exitBtn.addEventListener('click', exitReplayMode);
        }
    }
    
    // 初始化
    function init() {
        // 初始化棋譜控制
        document.addEventListener('DOMContentLoaded', initNotationControls);
    }
    
    // 執行初始化
    init();
    
    // 公開API
    return {
        addMove,
        clearNotation,
        exportNotation,
        getNotationData,
        onGameOver,
        replayMove,
        enterReplayMode,
        exitReplayMode
    };
})();

// 導出棋譜管理器
window.NotationManager = NotationManager;