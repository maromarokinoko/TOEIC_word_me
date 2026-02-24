// --- 1. データの初期化 ---
// 保存されたデータがあれば読み込み、なければ初期リスト（サンプル）を表示
let words = JSON.parse(localStorage.getItem('myToeicWords')) || [
    { en: "expedite", jp: "早める / 促進させる", ex: "We need to expedite the delivery process." },
    { en: "mandatory", jp: "義務的な / 強制の", ex: "Attendance at the meeting is mandatory." },
    { en: "precaution", jp: "予防措置 / 用心", ex: "Take every precaution to avoid errors." }
];

let currentIndex = 0;
const cardElement = document.getElementById('card');

// --- 2. 音声読み上げ機能 ---
const speak = (text) => {
    // 前の音声をキャンセルして重なりを防止
    window.speechSynthesis.cancel();
    const uttr = new SpeechSynthesisUtterance(text);
    uttr.lang = 'en-US'; // 英語(アメリカ)
    uttr.rate = 0.9;     // 読み上げ速度
    window.speechSynthesis.speak(uttr);
};

// --- 3. データの保存機能 ---
const saveToLocalStorage = () => {
    localStorage.setItem('myToeicWords', JSON.stringify(words));
};

// --- 4. 画面の更新（描画） ---
const updateCard = () => {
    const statsDiv = document.getElementById('stats');
    
    // 全単語クリア時の表示
    if (words.length === 0) {
        document.body.innerHTML = `
            <div style="text-align:center; padding:50px;">
                <h1>全単語マスター！🎉</h1>
                <p>素晴らしい継続力です！</p>
                <button onclick="resetList()" style="background:#333; color:white; padding:10px 20px; border-radius:5px;">最初からやり直す</button>
            </div>`;
        return;
    }

    // 表示の更新
    statsDiv.innerText = `残り: ${words.length}語`;
    document.getElementById('word-front').innerText = words[currentIndex].en;
    document.getElementById('meaning-back').innerText = words[currentIndex].jp;
    document.getElementById('example-back').innerText = words[currentIndex].ex || "No example available.";
    
    // カードが出た瞬間に英単語を読み上げ
    speak(words[currentIndex].en);
};

// --- 5. インタラクション（動き） ---

// カードをめくる
const flipCard = () => {
    const isFlipped = cardElement.classList.toggle('is-flipped');
    // 裏返った（意味を見た）ときに例文を読み上げ
    if (isFlipped) {
        speak(words[currentIndex].ex);
    }
};

// 次のカードへ（スキップ）
const nextCard = () => {
    cardElement.classList.remove('is-flipped');
    setTimeout(() => {
        currentIndex = (currentIndex + 1) % words.length;
        updateCard();
    }, 200);
};

// 覚えた！ボタン
const markAsLearned = () => {
    cardElement.classList.remove('is-flipped');
    setTimeout(() => {
        // 今の単語を配列から削除
        words.splice(currentIndex, 1);
        saveToLocalStorage(); // 削除後の状態を保存
        
        if (words.length > 0) {
            currentIndex = currentIndex % words.length;
            updateCard();
        } else {
            updateCard(); // 終了画面へ
        }
    }, 200);
};

// 新しい単語を追加する（スマホ用入力欄から呼び出し）
const addNewWord = () => {
    const enInput = document.getElementById('new-en');
    const jpInput = document.getElementById('new-jp');
    
    if (enInput.value && jpInput.value) {
        words.push({
            en: enInput.value,
            jp: jpInput.value,
            ex: "" // 必要なら例文入力欄も作れます
        });
        saveToLocalStorage(); // 追加したリストを保存
        
        // 入力欄を空にする
        enInput.value = "";
        jpInput.value = "";
        
        alert("単語帳に追加しました！");
        updateCard();
    } else {
        alert("単語と意味の両方を入力してください。");
    }
};

// データを初期状態に戻す
const resetList = () => {
    localStorage.removeItem('myToeicWords');
    location.reload();
};

// --- 6. 起動 ---
updateCard();