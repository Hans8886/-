// AI難度管理器
const AIDifficultyManager = (function() {
    // 難度設置
    const difficultySettings = {
        easy: {
            searchDepth: 1,          // 搜索深度
            randomMoveProbability: 0.3,  // 隨機走棋概率
            evaluationNoise: 0.2,    // 評估函數噪聲
            captureBonus: 0.5,       // 吃子獎勵
            checkBonus: 0.5,         // 將軍獎勵
            kingThreatPenalty: 0.5,  // 王受威脅懲罰
            thinkingTimeMin: 500,    // 最小思考時間(毫秒)
            thinkingTimeMax: 1500    // 最大思考時間(毫秒)
        },
        medium: {
            searchDepth: 2,
            randomMoveProbability: 0.1,
            evaluationNoise: 0.1,
            captureBonus: 1.0,
            checkBonus: 1.0,
            kingThreatPenalty: 1.0,
            thinkingTimeMin: 1000,
            thinkingTimeMax: 2500
        },
        hard: {
            searchDepth: 3,
            randomMoveProbability: 0,
            evaluationNoise: 0,
            captureBonus: 1.5,
            checkBonus: 1.5,
            kingThreatPenalty: 1.5,
            thinkingTimeMin: 1500,
            thinkingTimeMax: 3500
        }
    };
    
    // 當前難度
    let currentDifficulty = 'medium';
    
    // 設置難度
    function setDifficulty(difficulty) {
        if (difficultySettings[difficulty]) {
            currentDifficulty = difficulty;
            console.log(`AI難度設置為: ${difficulty}`);
            return true;
        }
        return false;
    }
    
    // 獲取當前難度設置
    function getCurrentSettings() {
        return difficultySettings[currentDifficulty];
    }
    
    // 獲取搜索深度
    function getSearchDepth() {
        return difficultySettings[currentDifficulty].searchDepth;
    }
    
    // 是否應該隨機走棋
    function shouldMakeRandomMove() {
        return Math.random() < difficultySettings[currentDifficulty].randomMoveProbability;
    }
    
    // 添加評估噪聲
    function addEvaluationNoise(score) {
        const noise = difficultySettings[currentDifficulty].evaluationNoise;
        if (noise === 0) return score;
        
        // 添加 -noise 到 +noise 範圍內的隨機值
        const randomNoise = (Math.random() * 2 - 1) * noise * 100;
        return score + randomNoise;
    }
    
    // 獲取吃子獎勵係數
    function getCaptureBonus() {
        return difficultySettings[currentDifficulty].captureBonus;
    }
    
    // 獲取將軍獎勵係數
    function getCheckBonus() {
        return difficultySettings[currentDifficulty].checkBonus;
    }
    
    // 獲取王受威脅懲罰係數
    function getKingThreatPenalty() {
        return difficultySettings[currentDifficulty].kingThreatPenalty;
    }
    
    // 獲取思考時間
    function getThinkingTime() {
        const { thinkingTimeMin, thinkingTimeMax } = difficultySettings[currentDifficulty];
        return Math.floor(Math.random() * (thinkingTimeMax - thinkingTimeMin + 1)) + thinkingTimeMin;
    }
    
    // 公開API
    return {
        setDifficulty,
        getCurrentSettings,
        getSearchDepth,
        shouldMakeRandomMove,
        addEvaluationNoise,
        getCaptureBonus,
        getCheckBonus,
        getKingThreatPenalty,
        getThinkingTime
    };
})();

// 導出AI難度管理器
window.AIDifficultyManager = AIDifficultyManager;