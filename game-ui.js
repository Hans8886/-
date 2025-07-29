                // 顯示AI選擇對話框
function showAISelectionDialog() {
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
        setTimeout(() => {
        dialog.classList.add('show');
    }, 10);
    
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
            
            // 播放選擇音效
        if (window.SoundManager) {
                window.SoundManager.play('select');
        }
        });
    });
    
    // 綁定按鈕事件
    document.getElementById('ai-black').addEventListener('click', () => {
        startGame('black', selectedDifficulty);
        document.body.removeChild(dialog);
    });
    
    document.getElementById('ai-red').addEventListener('click', () => {
        startGame('red', selectedDifficulty);
        document.body.removeChild(dialog);
    });
    
    document.getElementById('ai-both').addEventListener('click', () => {
        startGame('both', selectedDifficulty);
        document.body.removeChild(dialog);
    });
    
    document.getElementById('ai-cancel').addEventListener('click', () => {
        dialog.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(dialog);
        }, 300);
    });
}

// 開始遊戲
function startGame(aiMode, difficulty = 'medium') {
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
    }
    
    // 重置遊戲
    if (window.restartGame) {
        window.restartGame();
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
    
    // 創建或更新難度顯示元素
    let aiInfoDiv = document.querySelector('.ai-info');
    if (!aiInfoDiv) {
        aiInfoDiv = document.createElement('div');
        aiInfoDiv.className = 'ai-info';
        document.querySelector('.game-container').appendChild(aiInfoDiv);
    }
    
    if (aiMode !== 'off') {
        aiInfoDiv.innerHTML = `
            <div class="ai-status">
                <span>AI難度: ${difficultyText[difficulty]}</span>
            </div>
        `;
        aiInfoDiv.style.display = 'block';
    } else {
        aiInfoDiv.style.display = 'none';
    }
}
