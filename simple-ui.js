// 簡化版遊戲界面
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM已加載，開始初始化簡化版界面");
    
    // 清除現有內容
    document.body.innerHTML = '';
    
    // 創建開始畫面
    const startScreen = document.createElement('div');
    startScreen.id = 'start-screen';
    startScreen.style.display = 'block';
    startScreen.style.width = '100%';
    startScreen.style.maxWidth = '600px';
    startScreen.style.margin = '0 auto';
    startScreen.style.padding = '20px';
    startScreen.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    startScreen.style.borderRadius = '15px';
    startScreen.style.textAlign = 'center';
    startScreen.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
    
    // 添加內容
    startScreen.innerHTML = `
        <h1 style="color: #8B0000; font-size: 3rem; margin-bottom: 30px;">中國象棋</h1>
        <div style="margin-bottom: 30px;">
            <img src="https://img.icons8.com/color/240/chinese-chess.png" alt="中國象棋" style="width: 150px; height: 150px;">
        </div>
        <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 30px;">
            <button id="start-pvp" style="background-color: #8B0000; color: white; border: none; border-radius: 50px; padding: 15px 30px; font-size: 1.2rem; cursor: pointer; margin-bottom: 10px;">雙人對戰</button>
            <button id="start-pve" style="background-color: #8B0000; color: white; border: none; border-radius: 50px; padding: 15px 30px; font-size: 1.2rem; cursor: pointer;">電腦對戰</button>
        </div>
        <div style="margin-bottom: 30px;">
            <label style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                <input type="checkbox" id="sound-toggle" checked>
                遊戲音效
            </label>
        </div>
        <div style="color: #666; font-size: 0.9rem; margin-top: 20px;">
            <p>© 2025 中國象棋 - 版權所有</p>
        </div>
    `;
    
    document.body.appendChild(startScreen);
    
    // 綁定按鈕事件
    document.getElementById('start-pvp').addEventListener('click', function() {
        alert('您點擊了雙人對戰按鈕');
        showAISelectionDialog('off');
    });
    
    document.getElementById('start-pve').addEventListener('click', function() {
        alert('您點擊了電腦對戰按鈕');
        showAISelectionDialog();
    });
    
    document.getElementById('sound-toggle').addEventListener('change', function() {
        alert('您切換了音效設置: ' + this.checked);
    });
    
    console.log("簡化版界面初始化完成");
});

// 顯示AI選擇對話框
function showAISelectionDialog(aiMode) {
    // 如果是雙人模式，直接返回
    if (aiMode === 'off') {
        alert('開始雙人對戰模式');
        return;
    }
    
    // 創建對話框
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.top = '0';
    dialog.style.left = '0';
    dialog.style.width = '100%';
    dialog.style.height = '100%';
    dialog.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    dialog.style.display = 'flex';
    dialog.style.alignItems = 'center';
    dialog.style.justifyContent = 'center';
    dialog.style.zIndex = '1000';
    
    // 對話框內容
    const content = document.createElement('div');
    content.style.backgroundColor = 'white';
    content.style.borderRadius = '15px';
    content.style.padding = '30px';
    content.style.width = '90%';
    content.style.maxWidth = '500px';
    content.style.textAlign = 'center';
    content.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
    
    content.innerHTML = `
        <h2>選擇對戰模式</h2>
        <div style="display: flex; justify-content: center; gap: 20px; margin: 30px 0; flex-wrap: wrap;">
            <button id="ai-black" style="background-color: #f5f5f5; border: 2px solid #ddd; border-radius: 10px; padding: 20px; cursor: pointer; width: 120px; display: flex; flex-direction: column; align-items: center; gap: 10px;">
                <div style="width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; background-color: #f0f0f0; color: #333; border: 2px solid #333;">將</div>
                <span>電腦執黑</span>
            </button>
            <button id="ai-red" style="background-color: #f5f5f5; border: 2px solid #ddd; border-radius: 10px; padding: 20px; cursor: pointer; width: 120px; display: flex; flex-direction: column; align-items: center; gap: 10px;">
                <div style="width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; background-color: #ffeeee; color: #8B0000; border: 2px solid #8B0000;">帥</div>
                <span>電腦執紅</span>
            </button>
            <button id="ai-both" style="background-color: #f5f5f5; border: 2px solid #ddd; border-radius: 10px; padding: 20px; cursor: pointer; width: 120px; display: flex; flex-direction: column; align-items: center; gap: 10px;">
                <div style="width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold; background: linear-gradient(to right, #ffeeee 50%, #f0f0f0 50%); border: 2px solid #666; position: relative;">
                    <span style="position: absolute; left: 10px; color: #8B0000;">帥</span>
                    <span style="position: absolute; right: 10px; color: #333;">將</span>
                </div>
                <span>電腦對戰</span>
            </button>
        </div>
        
        <div style="margin: 20px 0; text-align: center;">
            <h3 style="margin-bottom: 15px; color: #333; font-size: 1.1rem;">選擇難度級別</h3>
            <div style="display: flex; justify-content: center; gap: 15px;">
                <button id="difficulty-easy" style="display: flex; flex-direction: column; align-items: center; gap: 5px; background-color: #f5f5f5; border: 2px solid #8B0000; border-radius: 8px; padding: 10px 15px; cursor: pointer; width: 80px; background-color: #fff8f8; box-shadow: 0 5px 10px rgba(139, 0, 0, 0.2);">
                    <i style="font-style: normal; color: #27ae60; font-size: 1.2rem;">★</i>
                    <span>簡單</span>
                </button>
                <button id="difficulty-medium" style="display: flex; flex-direction: column; align-items: center; gap: 5px; background-color: #f5f5f5; border: 2px solid #ddd; border-radius: 8px; padding: 10px 15px; cursor: pointer; width: 80px;">
                    <i style="font-style: normal; color: #f39c12; font-size: 1.2rem;">★★</i>
                    <span>普通</span>
                </button>
                <button id="difficulty-hard" style="display: flex; flex-direction: column; align-items: center; gap: 5px; background-color: #f5f5f5; border: 2px solid #ddd; border-radius: 8px; padding: 10px 15px; cursor: pointer; width: 80px;">
                    <i style="font-style: normal; color: #c0392b; font-size: 1.2rem;">★★★</i>
                    <span>困難</span>
                </button>
            </div>
        </div>
        
        <button id="ai-cancel" style="background-color: #f0f0f0; border: none; border-radius: 50px; padding: 10px 20px; font-size: 1rem; cursor: pointer; margin-top: 20px;">取消</button>
    `;
    
    dialog.appendChild(content);
    document.body.appendChild(dialog);
    
    // 當前選擇的難度
    let selectedDifficulty = 'easy';
    
    // 綁定難度選擇按鈕事件
    document.querySelectorAll('#difficulty-easy, #difficulty-medium, #difficulty-hard').forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有選中狀態
            document.querySelectorAll('#difficulty-easy, #difficulty-medium, #difficulty-hard').forEach(b => {
                b.style.border = '2px solid #ddd';
                b.style.backgroundColor = '#f5f5f5';
                b.style.boxShadow = 'none';
            });
            
            // 添加當前選中狀態
            this.style.border = '2px solid #8B0000';
            this.style.backgroundColor = '#fff8f8';
            this.style.boxShadow = '0 5px 10px rgba(139, 0, 0, 0.2)';
            
            // 更新選擇的難度
            selectedDifficulty = this.id.replace('difficulty-', '');
            alert('選擇難度: ' + selectedDifficulty);
        });
    });
    
    // 綁定按鈕事件
    document.getElementById('ai-black').addEventListener('click', function() {
        alert('選擇電腦執黑，難度: ' + selectedDifficulty);
        document.body.removeChild(dialog);
    });
    
    document.getElementById('ai-red').addEventListener('click', function() {
        alert('選擇電腦執紅，難度: ' + selectedDifficulty);
        document.body.removeChild(dialog);
    });
    
    document.getElementById('ai-both').addEventListener('click', function() {
        alert('選擇電腦對戰，難度: ' + selectedDifficulty);
        document.body.removeChild(dialog);
    });
    
    document.getElementById('ai-cancel').addEventListener('click', function() {
        alert('取消選擇');
        document.body.removeChild(dialog);
    });
}