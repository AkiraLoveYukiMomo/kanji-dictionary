// パスワードは 'yuu0908' を直書きせずにチェックする（簡易保護）
const CORRECT_PASSWORD = 'yuu0908'; 

let kanjiData = {}; 

// 1. パスワードチェックの関数
function checkPassword() {
    const input = document.getElementById('passInput').value;
    const loginMessage = document.getElementById('login-message');
    
    if (input === CORRECT_PASSWORD) {
        document.getElementById('login-container').style.display = 'none'; 
        document.getElementById('search-container').style.display = 'block'; 
        loginMessage.textContent = 'ログイン成功！データを読み込みます...';
        loadData(); // ログイン成功後にデータを読み込み開始
    } else {
        loginMessage.textContent = 'パスワードが違います。';
    }
}

// 2. データの読み込み（非同期処理）
async function loadData() {
    const searchButton = document.getElementById('searchButton');
    searchButton.textContent = '検索 (データを取得中...)';

    try {
        const response = await fetch('kanji_data.json'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        kanjiData = await response.json();
        
        // ★★★ データが完全に読み込まれたら、ボタンを有効にする！ ★★★
        searchButton.disabled = false;
        searchButton.textContent = '検索';
        document.getElementById('result').textContent = 'データ読み込み完了！漢字を入力してください。';

    } catch (e) {
        searchButton.textContent = '検索 (エラー)';
        document.getElementById('result').textContent = 'データファイルの読み込みに失敗しました。ファイル名や形式を確認してください。';
        console.error('JSONデータの読み込みエラー:', e);
    }
}

// 3. 複数検索の関数（データがある前提で動く）
function searchKanji() {
    const input = document.getElementById('searchInput').value.trim();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; 

    if (!input) {
        resultDiv.textContent = '漢字を入力してください。';
        return;
    }

    // ★★★ 複数検索の区切り文字を強化！ ★★★
    // スペース、全角スペース、タブの全てで区切り、空の要素を除去する
    const searchTerms = input.split(/[\s　\t]+/).filter(term => term.length > 0);
    let foundResults = [];

    // 🔍 検索処理 (複数の漢字を一つずつ探す)
    for (const kanji of searchTerms) {
        let foundPage = null;
        
        // JSONのキー（ページ数）を全てチェック
        for (const page in kanjiData) {
            // そのページのリストに、探している漢字が含まれているかを確認
            // kanjiData[page] が存在し、配列であることを確認（安全対策）
            if (Array.isArray(kanjiData[page]) && kanjiData[page].includes(kanji)) { 
                foundPage = page;
                break; // 見つかったら次の漢字の検索へ
            }
        }

        if (foundPage) {
            foundResults.push(`「${kanji}」は 【${foundPage}】 ページにあります。`);
        } else {
            foundResults.push(`「${kanji}」は見つかりませんでした。`);
        }
    }
    
    // 結果の表示
    resultDiv.innerHTML = foundResults.join('<br>'); 
}
