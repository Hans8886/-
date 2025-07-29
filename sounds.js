// 音效系統
const SoundManager = (function() {
    // 音效緩存
    const soundCache = {};
    // 是否啟用音效
    let soundEnabled = true;
    // 調試模式
    const debug = true;
    
    // 預加載所有音效
    const preloadSounds = function() {
        if (debug) console.log("開始預加載音效...");
        
        const sounds = {
            move: 'https://assets.mixkit.co/sfx/preview/mixkit-quick-jump-arcade-game-239.mp3',
            capture: 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-game-jump-coin-216.mp3',
            check: 'https://assets.mixkit.co/sfx/preview/mixkit-arcade-retro-changing-tab-206.mp3',
            victory: 'https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3',
            error: 'https://assets.mixkit.co/sfx/preview/mixkit-negative-tone-interface-tap-2569.mp3',
            select: 'https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3',
            start: 'https://assets.mixkit.co/sfx/preview/mixkit-game-level-music-689.mp3',
            undo: 'https://assets.mixkit.co/sfx/preview/mixkit-fast-small-sweep-transition-166.mp3'
        };
        
        // 預加載每個音效
        for (const [key, url] of Object.entries(sounds)) {
            try {
                const audio = new Audio();
                audio.src = url;
                audio.volume = 0.5; // 增加音量
                // 預加載
                audio.load();
                soundCache[key] = audio;
                if (debug) console.log(`音效 ${key} 已加載: ${url}`);
                
                // 添加錯誤處理
                audio.onerror = function() {
                    console.error(`音效 ${key} 加載失敗: ${url}`);
                };
            } catch (e) {
                console.error(`無法創建音效 ${key}: ${e.message}`);
            }
        }
        
        // 特殊處理背景音樂
        try {
            soundCache.background = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-game-level-music-689.mp3');
            soundCache.background.volume = 0.2; // 增加背景音樂音量
            soundCache.background.loop = true;
            if (debug) console.log("背景音樂已加載");
        } catch (e) {
            console.error(`無法創建背景音樂: ${e.message}`);
        }
    };
    
    // 播放音效
    const play = function(soundName) {
        if (!soundEnabled) {
            if (debug) console.log(`音效已禁用，不播放 ${soundName}`);
            return;
        }
        
        if (debug) console.log(`嘗試播放音效: ${soundName}`);
        
        try {
            // 如果音效已經在播放，創建一個新的實例
            if (soundCache[soundName] && soundCache[soundName].currentTime > 0) {
                const newSound = soundCache[soundName].cloneNode();
                newSound.volume = soundCache[soundName].volume;
                const playPromise = newSound.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        if (debug) console.log(`音效 ${soundName} 播放成功 (新實例)`);
                    }).catch(error => {
                        console.error(`無法播放音效 ${soundName} (新實例): ${error}`);
                    });
                }
            } else if (soundCache[soundName]) {
                soundCache[soundName].currentTime = 0;
                const playPromise = soundCache[soundName].play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        if (debug) console.log(`音效 ${soundName} 播放成功`);
                    }).catch(error => {
                        console.error(`無法播放音效 ${soundName}: ${error}`);
                    });
                }
            } else {
                console.error(`音效 ${soundName} 不存在`);
            }
        } catch (e) {
            console.error(`嘗試播放音效 ${soundName} 時出錯: ${e.message}`);
        }
    };
    
    // 播放背景音樂
    const playBackground = function() {
        if (!soundEnabled) {
            if (debug) console.log("音效已禁用，不播放背景音樂");
            return;
        }
        
        if (debug) console.log("嘗試播放背景音樂");
        
        try {
            if (!soundCache.background) {
                console.error("背景音樂未加載");
                return;
            }
            
            soundCache.background.currentTime = 0;
            const playPromise = soundCache.background.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    if (debug) console.log("背景音樂播放成功");
                }).catch(error => {
                    console.error(`無法播放背景音樂: ${error}`);
                    if (debug) console.log("提示: 瀏覽器可能需要用戶交互才能播放音頻");
                });
            }
        } catch (e) {
            console.error(`嘗試播放背景音樂時出錯: ${e.message}`);
        }
    };
    
    // 暫停背景音樂
    const pauseBackground = function() {
        try {
            if (soundCache.background) {
                soundCache.background.pause();
                if (debug) console.log("背景音樂已暫停");
            }
        } catch (e) {
            console.error(`嘗試暫停背景音樂時出錯: ${e.message}`);
        }
    };
    
    // 啟用/禁用音效
    const toggleSound = function(enabled) {
        soundEnabled = enabled;
        if (debug) console.log(`音效已${enabled ? '啟用' : '禁用'}`);
        
        if (!soundEnabled) {
            pauseBackground();
        } else {
            playBackground();
        }
    };
    
    // 初始化
    preloadSounds();
    
    // 公開API
    return {
        play,
        playBackground,
        pauseBackground,
        toggleSound,
        // 添加一個測試方法
        testSound: function() {
            if (debug) console.log("執行音效測試");
            play('select');
            setTimeout(() => play('move'), 500);
            setTimeout(() => play('capture'), 1000);
            setTimeout(() => play('check'), 1500);
        }
    };
})();

// 導出音效管理器
window.SoundManager = SoundManager;

// 添加頁面加載完成後的音效測試
document.addEventListener('DOMContentLoaded', function() {
    console.log("頁面加載完成，等待用戶交互以測試音效");
    
    // 創建一個測試按鈕
    const testButton = document.createElement('button');
    testButton.textContent = '測試音效';
    testButton.style.position = 'fixed';
    testButton.style.bottom = '10px';
    testButton.style.left = '10px';
    testButton.style.zIndex = '1000';
    
    testButton.addEventListener('click', function() {
        console.log("用戶點擊了音效測試按鈕");
        SoundManager.testSound();
    });
    
    document.body.appendChild(testButton);
});