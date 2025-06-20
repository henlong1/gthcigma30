let currentLevel = 15 * 2; // 초기 레벨 2배
let currentStage = 1;
let currentBetUnit = 0;
let totalUnits = 15 * 2; // 시작 유닛 2배
let winStreak = 0; // 연속 승리 카운터 (0: 첫 베팅, 1: 첫 베팅 승리 후 다음 베팅)
let betHistory = []; // 이전 상태를 저장할 배열 (이전 단계 버튼용)

// 각 레벨 및 단계별 베팅 규칙 정의
// 모든 유닛 및 레벨 관련 숫자가 2배로 조정되었습니다.
const levelMap = {
    // 레벨 번호도 2배로 조정
    6: { // 3 * 2
        1: { bet: 3 * 2, win: { type: 'goto', level: 6 * 2 }, lose: { type: 'gameOver' } }
    },
    8: { // 4 * 2
        1: { bet: 4 * 2, win: { type: 'goto', level: 8 * 2 }, lose: { type: 'gameOver' } }
    },
    10: { // 5 * 2
        1: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [2 * 2, 4 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet: 3 * 2, win: { type: 'calcLevelSubUnit', subtract: 2 * 2 }, lose: { type: 'gameOver' } }
    },
    12: { // 6 * 2
        1: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [2 * 2, 4 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet: 4 * 2, win: { type: 'calcLevelSubUnit', subtract: 2 * 2 }, lose: { type: 'gameOver' } }
    },
    14: { // 7 * 2
        1: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [2 * 2, 4 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet: 5 * 2, win: { type: 'calcLevelSubUnit', subtract: 2 * 2 }, lose: { type: 'gameOver' } }
    },
    16: { // 8 * 2
        1: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [2 * 2, 4 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet: 6 * 2, win: { type: 'calcLevelSubUnit', subtract: 2 * 2 }, lose: { type: 'gameOver' } }
    },
    18: { // 9 * 2
        1: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [2 * 2, 4 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet: 7 * 2, win: { type: 'calcLevelSubUnit', subtract: 2 * 2 }, lose: { type: 'gameOver' } }
    },
    20: { // 10 * 2
        1: { bet1: 1 * 2, bet2: 2 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [1 * 2, 2 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2 * 2, 4 * 2], subtract: 1 * 2 }, lose: { type: 'goto', stage: 3 } },
        3: { bet: 7 * 2, win: { type: 'goto', level: 14 * 2 }, lose: { type: 'gameOver' } }
    },
    22: { // 11 * 2
        1: { bet: 2 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [2 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2 * 2, 4 * 2], subtract: 1 * 2 }, lose: { type: 'goto', stage: 3 } },
        3: { bet: 7 * 2, win: { type: 'goto', level: 14 * 2 }, lose: { type: 'gameOver' } }
    },
    24: { // 12 * 2
        1: { bet1: 1 * 2, bet2: 2 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [1 * 2, 2 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2 * 2, 4 * 2], subtract: 1 * 2 }, lose: { type: 'goto', stage: 3 } },
        3: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2 * 2, 4 * 2], subtract: 3 * 2 }, lose: { type: 'goto', stage: 4 } },
        4: { bet: 7 * 2, win: { type: 'goto', level: 14 * 2 }, lose: { type: 'gameOver' } }
    },
    26: { // 13 * 2
        1: { bet: 2 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [2 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2 * 2, 4 * 2], subtract: 1 * 2 }, lose: { type: 'goto', stage: 3 } },
        3: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2 * 2, 4 * 2], subtract: 3 * 2 }, lose: { type: 'goto', stage: 4 } },
        4: { bet: 7 * 2, win: { type: 'goto', level: 14 * 2 }, lose: { type: 'gameOver' } }
    },
    28: { // 14 * 2
        1: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [2 * 2, 4 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet: 3 * 2, win: { type: 'goto', level: 15 * 2 }, lose: { type: 'goto', stage: 3 } },
        3: { bet1: 3 * 2, bet2: 6 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2, 6 * 2], subtract: 5 * 2 }, lose: { type: 'gotoLevel', level: 6 * 2 } }
    },
    30: { // 15 * 2
        1: { bet1: 1 * 2, bet2: 2 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [1 * 2, 2 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2 * 2, 4 * 2], subtract: 1 * 2 }, lose: { type: 'goto', stage: 3 } },
        3: { bet: 3 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2], subtract: 3 * 2 }, lose: { type: 'goto', stage: 4 } },
        4: { bet1: 3 * 2, bet2: 6 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2, 6 * 2], subtract: 6 * 2 }, lose: { type: 'calcLevelSubCurrentLevel', subtract: 9 * 2 } }
    },
    32: { // 16 * 2
        1: { bet1: 1 * 2, bet2: 2 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [1 * 2, 2 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2 * 2, 4 * 2], subtract: 1 * 2 }, lose: { type: 'goto', stage: 3 } },
        3: { bet: 3 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2], subtract: 3 * 2 }, lose: { type: 'goto', stage: 4 } },
        4: { bet1: 3 * 2, bet2: 6 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2, 6 * 2], subtract: 6 * 2 }, lose: { type: 'calcLevelSubCurrentLevel', subtract: 9 * 2 } }
    },
    34: { // 17 * 2
        1: { bet1: 1 * 2, bet2: 2 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [1 * 2, 2 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2 * 2, 4 * 2], subtract: 1 * 2 }, lose: { type: 'goto', stage: 3 } },
        3: { bet: 3 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2], subtract: 3 * 2 }, lose: { type: 'goto', stage: 4 } },
        4: { bet1: 3 * 2, bet2: 6 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2, 6 * 2], subtract: 6 * 2 }, lose: { type: 'calcLevelSubCurrentLevel', subtract: 9 * 2 } }
    },
    36: { // 18 * 2
        1: { bet1: 1 * 2, bet2: 2 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [1 * 2, 2 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2 * 2, 4 * 2], subtract: 1 * 2 }, lose: { type: 'goto', stage: 3 } },
        3: { bet: 3 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2], subtract: 3 * 2 }, lose: { type: 'goto', stage: 4 } },
        4: { bet1: 3 * 2, bet2: 6 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2, 6 * 2], subtract: 6 * 2 }, lose: { type: 'calcLevelSubCurrentLevel', subtract: 9 * 2 } }
    },
    38: { // 19 * 2
        1: { bet1: 1 * 2, bet2: 2 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [1 * 2, 2 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2 * 2, 4 * 2], subtract: 1 * 2 }, lose: { type: 'goto', stage: 3 } },
        3: { bet: 3 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2], subtract: 3 * 2 }, lose: { type: 'goto', stage: 4 } },
        4: { bet1: 3 * 2, bet2: 6 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2, 6 * 2], subtract: 6 * 2 }, lose: { type: 'calcLevelSubCurrentLevel', subtract: 9 * 2 } }
    },
    40: { // 20 * 2
        1: { bet1: 1 * 2, bet2: 2 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [1 * 2, 2 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2 * 2, 4 * 2], subtract: 1 * 2 }, lose: { type: 'goto', stage: 3 } },
        3: { bet: 3 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2], subtract: 3 * 2 }, lose: { type: 'goto', stage: 4 } },
        4: { bet1: 3 * 2, bet2: 6 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2, 6 * 2], subtract: 6 * 2 }, lose: { type: 'calcLevelSubCurrentLevel', subtract: 9 * 2 } }
    },
    42: { // 21 * 2
        1: { bet1: 1 * 2, bet2: 2 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [1 * 2, 2 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2 * 2, 4 * 2], subtract: 1 * 2 }, lose: { type: 'goto', stage: 3 } },
        3: { bet: 3 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2], subtract: 3 * 2 }, lose: { type: 'goto', stage: 4 } },
        4: { bet1: 3 * 2, bet2: 6 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2, 6 * 2], subtract: 6 * 2 }, lose: { type: 'calcLevelSubCurrentLevel', subtract: 9 * 2 } }
    },
    44: { // 22 * 2
        1: { bet1: 1 * 2, bet2: 2 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [1 * 2, 2 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2 * 2, 4 * 2], subtract: 1 * 2 }, lose: { type: 'goto', stage: 3 } },
        3: { bet1: 3 * 2, bet2: 6 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2, 6 * 2], subtract: 3 * 2 }, lose: { type: 'goto', stage: 4 } },
        4: {
            bet1: 9 * 2, bet2: 3 * 2,
            win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9 * 2, 3 * 2], subtract: 6 * 2 },
            lose: { type: 'specialLoseLevel22_4' } // 1번째 패배, 2번째 패배 로직 분리
        }
    },
    46: { // 23 * 2
        1: { bet1: 1 * 2, bet2: 2 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [1 * 2, 2 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2 * 2, 4 * 2], subtract: 1 * 2 }, lose: { type: 'goto', stage: 3 } },
        3: { bet1: 3 * 2, bet2: 6 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2, 6 * 2], subtract: 3 * 2 }, lose: { type: 'goto', stage: 4 } },
        4: {
            bet1: 9 * 2, bet2: 3 * 2,
            win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9 * 2, 3 * 2], subtract: 6 * 2 },
            lose: { type: 'specialLoseLevel23_4' } // 1번째 패배, 2번째 패배 로직 분리
        }
    },
    48: { // 24 * 2
        1: { bet1: 1 * 2, bet2: 2 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [1 * 2, 2 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2 * 2, 4 * 2], subtract: 1 * 2 }, lose: { type: 'goto', stage: 3 } },
        3: { bet1: 3 * 2, bet2: 6 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2, 6 * 2], subtract: 3 * 2 }, lose: { type: 'goto', stage: 4 } },
        4: {
            bet1: 9 * 2, bet2: 3 * 2,
            win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9 * 2, 3 * 2], subtract: 6 * 2 },
            lose: { type: 'specialLoseLevel24_4' } // 1번째 패배, 2번째 패배 로직 분리
        }
    },
    50: { // 25 * 2
        1: { bet1: 1 * 2, bet2: 2 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [1 * 2, 2 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2 * 2, 4 * 2], subtract: 1 * 2 }, lose: { type: 'goto', stage: 3 } },
        3: { bet1: 3 * 2, bet2: 5 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2, 5 * 2], subtract: 3 * 2 }, lose: { type: 'goto', stage: 4 } },
        4: {
            bet1: 9 * 2, bet2: 2 * 2,
            win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9 * 2, 2 * 2], subtract: 6 * 2 },
            lose: { type: 'specialLoseLevel25_4' } // 1번째 패배, 2번째 패배 로직 분리
        }
    },
    52: { // 26 * 2
        1: { bet1: 1 * 2, bet2: 2 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [1 * 2, 2 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2 * 2, bet2: 3 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2 * 2, 3 * 2], subtract: 1 * 2 }, lose: { type: 'goto', stage: 3 } },
        3: { bet1: 3 * 2, bet2: 4 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2, 4 * 2], subtract: 3 * 2 }, lose: { type: 'goto', stage: 4 } },
        4: {
            bet1: 9 * 2, bet2: 1 * 2,
            win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9 * 2, 1 * 2], subtract: 6 * 2 },
            lose: { type: 'specialLoseLevel26_4' } // 1번째 패배, 2번째 패배 로직 분리
        }
    },
    54: { // 27 * 2
        1: { bet1: 1 * 2, bet2: 2 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [1 * 2, 2 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2 * 2, bet2: 2 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2 * 2, 2 * 2], subtract: 1 * 2 }, lose: { type: 'goto', stage: 3 } },
        3: { bet1: 3 * 2, bet2: 3 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2, 3 * 2], subtract: 3 * 2 }, lose: { type: 'goto', stage: 4 } },
        4: { bet: 9 * 2, win: { type: 'goto', level: 30 * 2 }, lose: { type: 'gotoLevel', level: 12 * 2 } } // 단일 베팅
    },
    56: { // 28 * 2
        1: { bet1: 1 * 2, bet2: 1 * 2, win: { type: 'calcLevelSumCurrentLevel', units: [1 * 2, 1 * 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2 * 2, bet2: 1 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2 * 2, 1 * 2], subtract: 1 * 2 }, lose: { type: 'goto', stage: 3 } },
        3: { bet1: 3 * 2, bet2: 2 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2, 2 * 2], subtract: 3 * 2 }, lose: { type: 'goto', stage: 4 } },
        4: { bet: 8 * 2, win: { type: 'goto', level: 30 * 2 }, lose: { type: 'gotoLevel', level: 14 * 2 } } // 단일 베팅
    },
    58: { // 29 * 2
        1: { bet: 1 * 2, win: { type: 'goto', level: 30 * 2 }, lose: { type: 'goto', stage: 2 } }, // 단일 베팅
        2: { bet: 2 * 2, win: { type: 'goto', level: 30 * 2 }, lose: { type: 'goto', stage: 3 } }, // 단일 베팅
        3: { bet1: 3 * 2, bet2: 1 * 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3 * 2, 1 * 2], subtract: 3 * 2 }, lose: { type: 'goto', stage: 4 } },
        4: { bet: 7 * 2, win: { type: 'goto', level: 30 * 2 }, lose: { type: 'gotoLevel', level: 16 * 2 } } // 단일 베팅
    },
    60: { // 30 * 2
        // 레벨 30은 승리 목표 레벨로, 특별한 베팅 규칙이 없을 수 있습니다.
        // 또는 최종 단계의 베팅 규칙을 정의할 수 있습니다.
        1: { bet: 10 * 2, win: { type: 'gameWin' }, lose: { type: 'gameOver' } } // 예시: 레벨 30의 최종 베팅
    }
};

// DOM 요소 가져오기
const currentLevelEl = document.getElementById('currentLevel');
const currentStageEl = document.getElementById('currentStage');
const currentBetUnitEl = document.getElementById('currentBetUnit');
const totalUnitsEl = document.getElementById('totalUnits');
const messageEl = document.getElementById('message');
const winButton = document.getElementById('winButton');
const loseButton = document.getElementById('loseButton');
const resetButton = document.getElementById('resetButton');
const undoButton = document.getElementById('undoButton');

// 게임 초기화 함수
function initializeGame() {
    currentLevel = 15 * 2; // 시작 레벨 2배
    currentStage = 1;
    totalUnits = 15 * 2; // 시작 유닛 2배
    winStreak = 0; // 연속 승리 카운터 리셋
    betHistory = []; // 기록 초기화
    updateDisplay(); // 화면 업데이트
    messageEl.textContent = `게임 시작! 레벨 ${currentLevel}, ${currentStage}단계.`;
    messageEl.classList.remove('win', 'lose'); // 메시지 클래스 초기화
    enableButtons(); // 버튼 활성화
}

// 디스플레이 업데이트 함수
function updateDisplay() {
    const levelData = levelMap[currentLevel];
    if (levelData && levelData[currentStage]) {
        const stageData = levelData[currentStage];
        // winStreak 값에 따라 bet1 또는 bet2를 사용
        if (stageData.bet) { // 단일 베팅이 정의된 경우
            currentBetUnit = stageData.bet;
        } else if (stageData.bet1 && stageData.bet2) { // 2단계 베팅이 정의된 경우
            currentBetUnit = winStreak === 0 ? stageData.bet1 : stageData.bet2;
        } else {
            currentBetUnit = 0; // 정의되지 않은 경우
        }
    } else {
        currentBetUnit = 0; // 정의되지 않은 레벨/단계 (새로운 레벨이 추가되어야 할 때 발생 가능)
    }

    currentLevelEl.textContent = currentLevel;
    currentStageEl.textContent = currentStage;
    currentBetUnitEl.textContent = currentBetUnit;
    totalUnitsEl.textContent = totalUnits;

    // 게임 승리 조건 확인
    if (totalUnits >= 30 * 2) { // 승리 유닛 2배
        gameWin("축하합니다! 총 유닛이 60에 도달하여 게임에 승리했습니다!");
        return; // 승리 시 추가 로직 실행 방지
    }
    // 게임 패배 조건 확인 (초기화 시점 제외)
    // totalUnits가 0 이하가 되면 게임 오버. 단, 초기 totalUnits가 30일 때는 예외.
    if (totalUnits <= 0 && !(currentLevel === 30 && currentStage === 1 && totalUnits === 30)) { // 초기 유닛도 2배로 고려
        gameOver("총 유닛이 0이거나 0 미만이 되어 게임에 패배했습니다.");
        return; // 패배 시 추가 로직 실행 방지
    }

    // 이전 단계 버튼 활성화/비활성화 상태 업데이트
    undoButton.disabled = betHistory.length === 0;
}

// 게임 승리 처리 함수
function gameWin(msg) {
    messageEl.textContent = msg;
    messageEl.classList.remove('lose');
    messageEl.classList.add('win'); // 승리 메시지 스타일 적용
    disableButtons();
    currentLevelEl.textContent = "승리";
    currentStageEl.textContent = "승리";
    currentBetUnitEl.textContent = "0";
}

// 게임 패배 처리 함수
function gameOver(msg) {
    messageEl.textContent = msg;
    messageEl.classList.remove('win');
    messageEl.classList.add('lose'); // 패배 메시지 스타일 적용
    disableButtons();
    currentLevelEl.textContent = "패배";
    currentStageEl.textContent = "패배";
    currentBetUnitEl.textContent = "0";
}

// 버튼 비활성화 함수
function disableButtons() {
    winButton.disabled = true;
    loseButton.disabled = true;
    undoButton.disabled = true;
}

// 버튼 활성화 함수
function enableButtons() {
    winButton.disabled = false;
    loseButton.disabled = false;
    // 이전 단계 버튼은 기록이 있을 때만 활성화
    undoButton.disabled = betHistory.length === 0;
}

// 현재 게임 상태 저장 (이전 단계 버튼용)
function saveState() {
    betHistory.push({
        level: currentLevel,
        stage: currentStage,
        totalUnits: totalUnits,
        winStreak: winStreak
    });
}

// 승리 버튼 클릭 핸들러
function handleWin() {
    saveState(); // 현재 상태 저장

    const levelData = levelMap[currentLevel];
    if (!levelData || !levelData[currentStage]) {
        messageEl.textContent = "오류: 현재 레벨/단계 데이터가 정의되지 않았습니다.";
        gameOver("시스템 오류로 게임 종료.");
        return;
    }

    const stageData = levelData[currentStage];
    let unitsWon = currentBetUnit; // 기본적으로 현재 베팅 유닛만큼 획득

    // 총 유닛 증가
    totalUnits += unitsWon;

    // 승리 로직 처리
    if (stageData.win.type === 'goto') {
        currentLevel = stageData.win.level;
        currentStage = 1;
        winStreak = 0; // 레벨 이동 시 연속 승리 리셋
        messageEl.textContent = `승리! 레벨 ${currentLevel}로 이동합니다.`;
    } else if (stageData.win.type === 'calcLevelSumCurrentLevel') {
        winStreak++;
        if (winStreak === 2) { // 2연승
            const sumOfBetUnits = stageData.win.units.reduce((sum, u) => sum + u, 0);
            currentLevel += sumOfBetUnits;
            currentStage = 1;
            winStreak = 0; // 2연승 달성 후 연속 승리 리셋
            messageEl.textContent = `2연승! 레벨 ${currentLevel}로 이동합니다.`;
        } else { // 1연승
            // stageData.bet2는 이미 2배로 조정되었으므로 그대로 사용
            messageEl.textContent = `승리! 2번째 베팅(${stageData.bet2 || stageData.bet}유닛)을 시도합니다.`;
        }
    } else if (stageData.win.type === 'calcLevelSumCurrentLevelSubtract') {
        winStreak++;
        if (winStreak === 2 || (!stageData.bet1 && !stageData.bet2)) { // 2연승이거나 단일 베팅인데 해당 타입인 경우
            const sumOfBetUnits = stageData.win.units.reduce((sum, u) => sum + u, 0);
            currentLevel += sumOfBetUnits - stageData.win.subtract;
            currentStage = 1;
            winStreak = 0;
            messageEl.textContent = `승리! 레벨 ${currentLevel}로 이동합니다.`;
        } else { // 1연승
            // stageData.bet2는 이미 2배로 조정되었으므로 그대로 사용
            messageEl.textContent = `승리! 2번째 베팅(${stageData.bet2 || stageData.bet}유닛)을 시도합니다.`;
        }
    } else if (stageData.win.type === 'gameWin') {
        gameWin("최종 목표 달성! 게임에 승리했습니다!");
        return;
    } else {
        messageEl.textContent = "오류: 알 수 없는 승리 규칙입니다.";
        gameOver("시스템 오류로 게임 종료.");
        return;
    }

    updateDisplay();
}

// 패배 버튼 클릭 핸들러
function handleLose() {
    saveState(); // 현재 상태 저장

    const levelData = levelMap[currentLevel];
    if (!levelData || !levelData[currentStage]) {
        messageEl.textContent = "오류: 현재 레벨/단계 데이터가 정의되지 않았습니다.";
        gameOver("시스템 오류로 게임 종료.");
        return;
    }

    const stageData = levelData[currentStage];
    let unitsLost = currentBetUnit; // 현재 베팅 유닛만큼 손실

    // 총 유닛 감소
    totalUnits -= unitsLost;

    // 연속 승리 카운터 리셋
    winStreak = 0;

    // 패배 로직 처리
    if (stageData.lose.type === 'gameOver') {
        gameOver("베팅 패배로 유닛이 소진되었습니다.");
    } else if (stageData.lose.type === 'goto') {
        currentStage = stageData.lose.stage;
        messageEl.textContent = `패배! ${currentStage}단계로 이동합니다.`;
    } else if (stageData.lose.type === 'gotoLevel') {
        currentLevel = stageData.lose.level;
        currentStage = 1; // 레벨 이동 시 1단계로 리셋
        messageEl.textContent = `패배! 레벨 ${currentLevel}로 이동합니다.`;
    } else if (stageData.lose.type === 'calcLevelSubCurrentLevel') {
        currentLevel -= stageData.lose.subtract;
        currentStage = 1; // 레벨 이동 시 1단계로 리셋
        messageEl.textContent = `패배! 레벨 ${currentLevel}로 이동합니다.`;
    }
    // 레벨 44-52 (기존 22-26)의 4단계 특수 패배 로직
    else if (stageData.lose.type && stageData.lose.type.startsWith('specialLoseLevel')) {
        let nextLevel = currentLevel;
        // 패배한 베팅 유닛이 첫 번째 베팅 유닛(bet1)과 같으면 1번째 패배로 간주
        // 아니면 (대부분 2번째 베팅 유닛 bet2에서 패배한 경우) 2번째 패배로 간주
        if (unitsLost === (stageData.bet1)) { // bet1도 2배로 계산된 값과 비교
            nextLevel = currentLevel - (15 * 2); // 15 * 2 레벨 감소
            messageEl.textContent = `패배! (1번째 베팅 실패) 레벨 ${nextLevel}로 이동합니다.`;
        } else if (unitsLost === (stageData.bet2)) { // bet2도 2배로 계산된 값과 비교
            if (stageData.lose.type === 'specialLoseLevel25_4') { // 기존 25레벨
                nextLevel = currentLevel + (1 * 2); // 1 * 2 레벨 증가
                messageEl.textContent = `패배! (2번째 베팅 실패) 레벨 ${nextLevel}로 이동합니다.`;
            } else if (stageData.lose.type === 'specialLoseLevel26_4') { // 기존 26레벨
                nextLevel = currentLevel + (2 * 2); // 2 * 2 레벨 증가
                messageEl.textContent = `패배! (2번째 베팅 실패) 레벨 ${nextLevel}로 이동합니다.`;
            } else { // 22, 23, 24의 4단계 2번째 베팅 패배 시 (2배된 레벨 기준 44, 46, 48)
                nextLevel = currentLevel; // 현재 레벨 유지
                messageEl.textContent = `패배! (2번째 베팅 실패) 현재 레벨 ${nextLevel}을 유지합니다.`;
            }
        } else {
            messageEl.textContent = "오류: 알 수 없는 4단계 패배 규칙입니다.";
            gameOver("시스템 오류로 게임 종료.");
            return;
        }
        currentLevel = nextLevel;
        currentStage = 1; // 특수 패배 후 다음 레벨의 1단계로 이동
    }
    else {
        messageEl.textContent = "알 수 없는 패배 규칙입니다.";
        gameOver("시스템 오류로 게임 종료.");
        return;
    }

    updateDisplay();
}

// 리셋 버튼 클릭 핸들러
function handleReset() {
    if (confirm("정말로 게임을 리셋하시겠습니까?")) {
        initializeGame();
    }
}

// 이전 단계 버튼 클릭 핸들러
function handleUndo() {
    if (betHistory.length > 0) {
        const prevState = betHistory.pop(); // 가장 최근 상태 가져오기
        currentLevel = prevState.level;
        currentStage = prevState.stage;
        totalUnits = prevState.totalUnits;
        winStreak = prevState.winStreak;
        messageEl.textContent = "이전 상태로 돌아갑니다.";
        messageEl.classList.remove('win', 'lose'); // 메시지 클래스 초기화
        updateDisplay();
        enableButtons(); // 이전 단계 후 버튼 활성화
    } else {
        messageEl.textContent = "더 이상 돌아갈 이전 상태가 없습니다.";
        undoButton.disabled = true; // 기록이 없으면 비활성화
    }
}

// 이벤트 리스너 연결
winButton.addEventListener('click', handleWin);
loseButton.addEventListener('click', handleLose);
resetButton.addEventListener('click', handleReset);
undoButton.addEventListener('click', handleUndo);

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', initializeGame);