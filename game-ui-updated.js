// 遊戲界面管理器
const GameUIManager = (function() {
    // 遊戲狀態
    const gameStates = {
        START_SCREEN: 'start-screen',
        GAME_SCREEN: 'game-screen',
        END_SCREEN: 'end-screen'
    };
    
    let currentState = gameStates.START_SCREEN;
    
    // 初始化界面
    function initUI() {
        console.log("初始化遊戲界面...");
        
        // 清除可能存在的舊畫面
        document.querySelectorAll('.game-screen').forEach(screen => {
            document.body.removeChild(screen);
        });
        
        createStartScreen();
        createGameScreen();
        createEndScreen();
        
        // 初始顯示開始畫面
        showScreen(gameStates.START_SCREEN);
        console.log("初始化完成，顯示開始畫面");
    }
    
    // 創建開始畫面
    function createStartScreen() {
        console.log("創建開始畫面...");
        
        // 檢查是否已存在
        const existingScreen = document.getElementById(gameStates.START_SCREEN);
        if (existingScreen) {
            document.body.removeChild(existingScreen);
        }
        
        const startScreen = document.createElement('div');
        startScreen.id = gameStates.START_SCREEN;
        startScreen.className = 'game-screen';
        
        const content = `
            <div class="start-container">
                <h1 class="game-title">中國象棋</h1>
                <div class="game-logo">
                    <img src="https://img.icons8.com/color/240/chinese-chess.png" alt="中國象棋">
                </div>
                <div class="start-buttons">
                    <button id="start-pvp" class="start-button">雙人對戰</button>
                    <button id="start-pve" class="start-button">電腦對戰</button>
                </div>
                <div class="game-settings">
                    <div class="setting-item">
                        <input type="checkbox" id="start-sound-toggle" checked>
                        <label for="start-sound-toggle">遊戲音效</label>
                    </div>
                </div>
                <div class="game-footer">
                    <p>© 2025 中國象棋 - 版權所有</p>
                </div>
            </div>
        `;
        
        startScreen.innerHTML = content;
        document.body.appendChild(startScreen);
        
        // 立即綁定按鈕事件，不使用setTimeout
        const pvpButton = document.getElementById('start-pvp');
        if (pvpButton) {
            pvpButton.addEventListener('click', () => {
                console.log("點擊雙人對戰按鈕");
                // 雙人對戰模式
                startGame('off');
            });
        } else {
            console.error("找不到雙人對戰按鈕");
        }
        
        const pveButton = document.getElementById('start-pve');
        if (pveButton) {
            pveButton.addEventListener('click', () => {
                console.log("點擊電腦對戰按鈕");
                // 顯示AI選擇對話框
                showAISelectionDialog();
            });
        } else {
            console.error("找不到電腦對戰按鈕");
        }
        
        // 音效設置
        const soundToggle = document.getElementById('start-sound-toggle');
        if (soundToggle) {
            soundToggle.addEventListener('change', function() {
                if (window.SoundManager) {
                    window.SoundManager.toggleSound(this.checked);
                }
            });
        }
    }
    
    // 顯示AI選擇對話框
    function showAISelectionDialog() {
        console.log("顯示AI選擇對話框...");
        
        // 移除可能存在的舊對話框
        const oldDialog = document.querySelector('.ai-selection-dialog');
        if (oldDialog) {
            document.body.removeChild(oldDialog);
        }
        
        const dialog = document.createElement('div');
        dialog.className = 'ai-selection-dialog';
        
        const content = `
            <div class="dialog-content">
                <h2>選擇對戰模式</h2>
                <div class="ai-options">
                    <button id="ai-black" class="ai-option">
                        <div class="ai-icon black">將</div>
                        <span>電腦執黑</span>
                    </button>
                    <button id="ai-red" class="ai-option">
                        <div class="ai-icon red">帥</div>
                        <span>電腦執紅</span>
                    </button>
                    <button id="ai-both" class="ai-option">
                        <div class="ai-icon both">
                            <span class="red">帥</span>
                            <span class="black">將</span>
                        </div>
                        <span>電腦對戰</span>
                    </button>
                </div>
                <div class="difficulty-selection">
                    <h3>選擇難度級別</h3>
                    <div class="difficulty-options">
                        <button id="difficulty-easy" class="difficulty-option selected">
                            <i class="difficulty-icon">★</i>
                            <span>簡單</span>
                        </button>
                        <button id="difficulty-medium" class="difficulty-option">
                            <i class="difficulty-icon">★★</i>
                            <span>普通</span>
                        </button>
                        <button id="difficulty-hard" class="difficulty-option">
                            <i class="difficulty-icon">★★★</i>
                            <span>困難</span>
                        </button>
                    </div>
                </div>
                <button id="ai-cancel" class="dialog-button">取消</button>
            </div>
        `;
        
        dialog.innerHTML = content;
        document.body.appendChild(dialog);
        
        // 添加動畫效果
        requestAnimationFrame(() => {
            dialog.classList.add('show');
        });
        
        // 當前選擇的難度
        let selectedDifficulty = 'easy';
        
        // 綁定難度選擇按鈕事件
        document.querySelectorAll('.difficulty-option').forEach(btn => {
            btn.addEventListener('click', function() {
                // 移除所有選中狀態
                document.querySelectorAll('.difficulty-option').forEach(b => {
                    b.classList.remove('selected');
                });
                
                // 添加當前選中狀態
                this.classList.add('selected');
                
                // 更新選擇的難度
                selectedDifficulty = this.id.replace('difficulty-', '');
                console.log("選擇難度:", selectedDifficulty);
                
                // 播放選擇音效
                if (window.SoundManager) {
                    window.SoundManager.play('select');
                }
            });
        });
        
        // 綁定按鈕事件
        const blackButton = document.getElementById('ai-black');
        if (blackButton) {
            blackButton.addEventListener('click', () => {
                console.log("選擇電腦執黑，難度:", selectedDifficulty);
                if (window.GameUIManager && typeof window.GameUIManager.startGame === 'function') {
                    window.GameUIManager.startGame('black', selectedDifficulty);
                }
                document.body.removeChild(dialog);
            });
        }
        
        const redButton = document.getElementById('ai-red');
        if (redButton) {
            redButton.addEventListener('click', () => {
                console.log("選擇電腦執紅，難度:", selectedDifficulty);
                if (window.GameUIManager && typeof window.GameUIManager.startGame === 'function') {
                    window.GameUIManager.startGame('red', selectedDifficulty);
                }
                document.body.removeChild(dialog);
            });
        }
        
        const bothButton = document.getElementById('ai-both');
        if (bothButton) {
            bothButton.addEventListener('click', () => {
                console.log("選擇電腦對戰，難度:", selectedDifficulty);
                if (window.GameUIManager && typeof window.GameUIManager.startGame === 'function') {
                    window.GameUIManager.startGame('both', selectedDifficulty);
                }
                document.body.removeChild(dialog);
            });
        }
        
        const cancelButton = document.getElementById('ai-cancel');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                console.log("取消選擇");
                dialog.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(dialog);
                }, 300);
            });
        }
    }
    
    // 創建遊戲畫面
    function createGameScreen() {
        console.log("創建遊戲畫面...");
        
        // 檢查是否已存在
        const existingScreen = document.getElementById(gameStates.GAME_SCREEN);
        if (existingScreen) {
            document.body.removeChild(existingScreen);
        }
        
        const gameScreen = document.createElement('div');
        gameScreen.id = gameStates.GAME_SCREEN;
        gameScreen.className = 'game-screen';
        gameScreen.style.display = 'none';  // 初始隱藏
        
        const content = `
            <div class="game-container">
                <div class="game-header">
                    <h1>中國象棋</h1>
                    <button id="back-to-menu" class="menu-button">返回主選單</button>
                </div>
                <div class="game-info">
                    <div id="current-player" class="game-status">當前回合: 紅方</div>
                    <div class="game-controls">
                        <button id="undo-btn">悔棋</button>
                        <button id="restart-btn">重新開始</button>
                        <select id="ai-mode" style="display:none;">
                            <option value="off">雙人對戰</option>
                            <option value="black">電腦執黑</option>
                            <option value="red">電腦執紅</option>
                            <option value="both">電腦對戰</option>
                        </select>
                        <div class="sound-control">
                            <input type="checkbox" id="sound-toggle" checked>
                            <label for="sound-toggle">音效</label>
                        </div>
                    </div>
                </div>
                
                <div class="game-layout">
                    <div id="chessboard-container">
                        <div id="chessboard"></div>
                        <div class="replay-overlay">
                            <div class="replay-message">回放模式</div>
                        </div>
                    </div>
            
                    <div class="notation-panel">
                        <div class="notation-header">
                            <h3>棋譜記錄</h3>
                            <div class="notation-controls">
                                <button id="replay-first">開始</button>
                                <button id="replay-prev">上一步</button>
                                <button id="replay-next">下一步</button>
                                <button id="replay-last">最新</button>
                                <button id="replay-auto">自動回放</button>
                                <button id="replay-exit">退出回放</button>
                            </div>
                        </div>
                        <div class="notation-list" id="notation-list"></div>
                        <div class="notation-export">
                            <button id="export-notation">匯出棋譜</button>
                        </div>
                    </div>
                </div>
                
                <div class="ai-info">
                    <div class="ai-status">
                        <span class="ai-difficulty-display"></span>
                    </div>
                </div>
            </div>
        `;
        
        gameScreen.innerHTML = content;
        document.body.appendChild(gameScreen);
        
        // 綁定返回按鈕事件
        const backButton = document.getElementById('back-to-menu');
        if (backButton) {
            backButton.addEventListener('click', () => {
                // 確認對話框
                if (confirm('確定要返回主選單嗎？當前遊戲進度將會丟失！')) {
                    showScreen(gameStates.START_SCREEN);
                }
            });
        }
        
        // 綁定音效切換
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            soundToggle.addEventListener('change', function() {
                if (window.SoundManager) {
                    window.SoundManager.toggleSound(this.checked);
                }
            });
        }
    }
    
    // 創建結束畫面
    function createEndScreen() {
        console.log("創建結束畫面...");
        
        // 檢查是否已存在
        const existingScreen = document.getElementById(gameStates.END_SCREEN);
        if (existingScreen) {
            document.body.removeChild(existingScreen);
        }
        
        const endScreen = document.createElement('div');
        endScreen.id = gameStates.END_SCREEN;
        endScreen.className = 'game-screen';
        endScreen.style.display = 'none';  // 初始隱藏
        
        const content = `
            <div class="end-container">
                <h1 id="end-title">遊戲結束</h1>
                <div id="winner-display" class="winner-display">
                    <div class="winner-icon red">帥</div>
                    <h2>紅方獲勝！</h2>
                </div>
                <div class="end-buttons">
                    <button id="play-again" class="end-button">再來一局</button>
                    <button id="view-notation" class="end-button">查看棋譜</button>
                    <button id="back-to-start" class="end-button">返回主選單</button>
                </div>
            </div>
        `;
        
        endScreen.innerHTML = content;
        document.body.appendChild(endScreen);
        
        // 綁定按鈕事件
        const playAgainButton = document.getElementById('play-again');
        if (playAgainButton) {
            playAgainButton.addEventListener('click', () => {
                // 重新開始遊戲
                showScreen(gameStates.GAME_SCREEN);
                if (window.restartGame) {
                    window.restartGame();
                }
            });
        }
        
        const viewNotationButton = document.getElementById('view-notation');
        if (viewNotationButton) {
            viewNotationButton.addEventListener('click', () => {
                // 查看棋譜
                showScreen(gameStates.GAME_SCREEN);
                if (window.NotationManager) {
                    window.NotationManager.enterReplayMode();
                }
            });
        }
        
        const backToStartButton = document.getElementById('back-to-start');
        if (backToStartButton) {
            backToStartButton.addEventListener('click', () => {
                // 返回主選單
                showScreen(gameStates.START_SCREEN);
            });
        }
    }
    
    // 顯示指定畫面
    function showScreen(screenId) {
        console.log("切換到畫面:", screenId);
        
        // 隱藏所有畫面
        document.querySelectorAll('.game-screen').forEach(screen => {
            screen.style.display = 'none';
        });

        // 顯示指定畫面
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.style.display = 'block';
            currentState = screenId;

            // 強制刷新開始畫面內容（避免被覆蓋或未正確顯示）
            if (screenId === gameStates.START_SCREEN) {
                // 檢查按鈕是否存在，若不存在則重建開始畫面
                if (!document.getElementById('start-pvp') || !document.getElementById('start-pve')) {
                    createStartScreen();
                }
            }

            // 如果切換到遊戲畫面，初始化棋盤
            if (screenId === gameStates.GAME_SCREEN && window.renderBoard) {
                console.log("初始化棋盤...");
                setTimeout(() => {
                    window.renderBoard();
                }, 100);
            }
        } else {
            console.error("找不到畫面:", screenId);
        }
    }
    
    // 開始遊戲
    function startGame(aiMode, difficulty = 'medium') {
        console.log("開始遊戲，模式:", aiMode, "難度:", difficulty);
        
        // 顯示遊戲畫面
        showScreen(gameStates.GAME_SCREEN);
        
        // 設置AI模式
        const aiModeSelect = document.getElementById('ai-mode');
        if (aiModeSelect) {
            aiModeSelect.value = aiMode;
            
            // 觸發change事件
            const event = new Event('change');
            aiModeSelect.dispatchEvent(event);
        }
        
        // 設置AI難度
        if (window.AIDifficultyManager) {
            window.AIDifficultyManager.setDifficulty(difficulty);
            console.log(`設置AI難度: ${difficulty}`);
        } else {
            console.warn("找不到AIDifficultyManager");
        }
        
        // 重置遊戲
        if (window.restartGame) {
            window.restartGame();
        } else {
            console.warn("找不到restartGame函數");
        }
        
        // 播放開始音效
        if (window.SoundManager) {
            window.SoundManager.play('start');
        }
        
        // 顯示AI難度信息
        const difficultyText = {
            'easy': '簡單',
            'medium': '普通',
            'hard': '困難'
        };
        
        // 更新難度顯示元素
        const aiInfoDiv = document.querySelector('.ai-info');
        const difficultyDisplay = document.querySelector('.ai-difficulty-display');
        
        if (aiInfoDiv && difficultyDisplay) {
            if (aiMode !== 'off') {
                let modeText = '';
                switch (aiMode) {
                    case 'black':
                        modeText = '電腦執黑';
                        break;
                    case 'red':
                        modeText = '電腦執紅';
                        break;
                    case 'both':
                        modeText = '電腦對戰';
                        break;
                }
                
                difficultyDisplay.textContent = `模式: ${modeText} | 難度: ${difficultyText[difficulty]}`;
                aiInfoDiv.style.display = 'block';
            } else {
                aiInfoDiv.style.display = 'none';
            }
        }
    }
    
    // 顯示遊戲結束畫面
    function showGameEnd(winner) {
        console.log("遊戲結束，獲勝方:", winner);
        
        // 更新獲勝方顯示
        const winnerDisplay = document.getElementById('winner-display');
        if (winnerDisplay) {
            if (winner === 'red') {
                winnerDisplay.innerHTML = `
                    <div class="winner-icon red">帥</div>
                    <h2>紅方獲勝！</h2>
                `;
            } else {
                winnerDisplay.innerHTML = `
                    <div class="winner-icon black">將</div>
                    <h2>黑方獲勝！</h2>
                `;
            }
        }
        
        // 顯示結束畫面
        showScreen(gameStates.END_SCREEN);
    }
    
    // 初始化
    function init() {
        console.log("遊戲界面管理器初始化...");
        
        // 初始化界面
        initUI();
        
        // 覆蓋原有的遊戲結束處理函數
        window.showGameOverMessage = function(winner) {
            // 播放勝利音效
            if (window.SoundManager) {
                window.SoundManager.play('victory');
            }
            
            // 延遲顯示結束畫面，讓玩家看到最後的棋盤狀態
            setTimeout(() => {
                showGameEnd(winner);
            }, 1500);
        };
        
        console.log("遊戲界面管理器初始化完成");
    }
    
    // 立即執行初始化
    init();
    
    // 公開API
    return {
        showStartScreen: () => showScreen(gameStates.START_SCREEN),
        showGameScreen: () => showScreen(gameStates.GAME_SCREEN),
        showEndScreen: (winner) => showGameEnd(winner),
        startGame
    };
})();

// 導出遊戲界面管理器
window.GameUIManager = GameUIManager;

// 確保DOM加載完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM加載完成，確保界面已初始化");
    // 如果界面沒有正確初始化，再次嘗試
    const startScreen = document.getElementById('start-screen');
    if (!startScreen || startScreen.style.display === 'none') {
        console.log("開始畫面未顯示，重新初始化");
        if (window.GameUIManager) {
            window.GameUIManager.showStartScreen();
        }
    }
});