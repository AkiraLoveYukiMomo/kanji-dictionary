// --- 🚨パスワード保護に関する注意🚨 ---
// GitHub Pagesはファイル公開サービスなので、パスワードを完全に隠すことはできません。
// ここでは、パスワード 'yuu0908' をハッシュ化した**仮の文字列**を使っています。
// 実際の運用では、「yuu0908」をSHA-256などでハッシュ化してここに入れてね！
const HASHED_PASSWORD_HASH = '80949d034293f9c6e3b09069d72e77b8e1f570020612c3f760f381c85d820c74'; // "yuu0908"のSHA-256ハッシュ(仮)

let kanjiData = {}; 

// 1. パスワードチェックの関数
function checkPassword() {
    const input = document.getElementById('passInput').value;
    const loginMessage = document.getElementById('login-message');
    
    // シンプルにするため、今回は入力値を直接比較
    if (input === 'yuu0908') { // ★本来は input をハッシュ化して HASHED_PASSWORD_HASH と比較する
        document.getElementById('login-container').style.display = 'none'; 
        document.getElementById('search-container').style.display = 'block'; 
        loginMessage.textContent = 'ログイン成功！';
        loadData(); // データの読み込み
    } else {
        loginMessage.textContent = 'パスワードが違います。';
    }
}

// 2. データの読み込み
async function loadData() {
    try {
        const response = await fetch('kanji_data.json'); 
        kanjiData = await response.json();
    } catch (e) {
        document.getElementById('result').textContent = 'データファイルの読み込みに失敗しました。';
        console.error('JSONデータの読み込みエラー:', e);
    }
}
// 3. 検索を実行
async function searchKanji() { // ★ async キーワードを追加！
    // データの読み込みがまだなら、ここで待つようにする
    if (Object.keys(kanjiData).length === 0) {
        document.getElementById('result').textContent = 'データを読み込み中です。少々お待ちください...';
        await loadData(); // データが読み込まれるまで待つ
        if (Object.keys(kanjiData).length === 0) {
            document.getElementById('result').textContent = 'データファイルの読み込みに失敗しました。';
            return;
        }
    }
    
    const input = document.getElementById('searchInput').value.trim();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; 
function searchKanji() {
    const input = document.getElementById('searchInput').value.trim();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // 結果を一度クリア

    if (!input) {
        resultDiv.textContent = '漢字を入力してください。';
        return;
    }

    // スペースで区切って、探したい漢字のリストを作る
    const searchTerms = input.split(/\s+/).filter(term => term.length > 0);
    let foundResults = [];

    // 🔍 検索処理 (複数の漢字を一つずつ探す)
    for (const kanji of searchTerms) {
        let foundPage = null;
        
        // JSONのキー（ページ数）を全てチェック
        for (const page in kanjiData) {
            // そのページのリストに、探している漢字が含まれているかを確認
            if (kanjiData[page].includes(kanji)) { 
                foundPage = page;
                break; // 見つかったら次の漢字の検索へ
            }
        }

        if (foundPage) {
            foundResults.push(`「${kanji}」は **${foundPage}** ページにあります。`);
        } else {
            foundResults.push(`「${kanji}」は見つかりませんでした。`);
        }
    }
    
    // 結果の表示
    resultDiv.innerHTML = foundResults.join('<br>'); // 結果を改行で区切って表示
}
