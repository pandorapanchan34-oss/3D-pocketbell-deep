/**
 * SIGN-X v8.50-deep フロントエンド・マウントレイヤー
 * パス: src/main.js
 * * トポロジー:
 * 1. 脳（ロジック）と普遍宇宙（11万語）は、Private要塞から一本釣り（完全ブラックボックス）
 * 2. 固有辞書（ユーザーバッファ）は、足元から個別に吸い上げて要塞へインジェクション
 */

// 🪐 先ほどデプロイに成功したお兄ちゃんの空中要塞URLから、コア知能を一本釣り！
const FORTRESS_CORE = "https://3-d-pocketbell-deep-bssv.vercel.app/core.js";
const LOCAL_USER_DICT_PATH = "./public/dict/user-dict.json";

const VEK_LAYOUT = ['↑','↓','+','-','~','*','?','→','←','↺','↻','⇄','⚠','♡','🖤','⚡','🙇','w','💦','⏳','❌'];

window.addEventListener('DOMContentLoaded', async () => {
  const textarea = document.getElementById('input-textarea');
  const packetOutput = document.getElementById('packet-output');
  const decodeOutput = document.getElementById('decode-output');
  const keyboard = document.getElementById('vector-keyboard');
  const badge = document.getElementById('sync-badge');

  if (badge) badge.innerText = "● SIGN-X CONNECTING FORTRESS...";

  try {
    // 1. 動的にPrivate要塞のブラックボックス知能をブラウザへマウント
    const { initSystem, encode, decode } = await import(FORTRESS_CORE);

    // 2. お兄ちゃん設計：足元の固有ユーザー辞書（user-dict.json）をローカルから吸引
    const localUserDict = await fetch(LOCAL_USER_DICT_PATH)
      .then(r => r.json())
      .catch(() => {
        console.log("ℹ️ 足元にアプリ固有の user-dict.json は未配置です（空で続行します）");
        return { entries: [] };
      });

    // 3. 要塞の心臓部に固有辞書をブチ込みつつ、11万語の大統一宇宙を起動！
    const syncResult = await initSystem(localUserDict);

    if (badge && syncResult.success) {
      badge.innerText = `● SIGN-X ONLINE [${syncResult.totalWords} words]`;
      badge.style.color = "#34d399";
    }

    // 4. ベクトルキーボード生成
    if (keyboard && keyboard.children.length === 0) {
      VEK_LAYOUT.forEach(v => {
        const btn = document.createElement('button');
        btn.innerText = v;
        btn.style.cssText = "height: 3rem; background: #0f172a; border: 1px solid #1e293b; color: #cbd5e1; border-radius: 0.5rem; cursor: pointer; font-weight: bold; font-family: monospace; font-size: 1.1rem;";
        btn.addEventListener('click', () => {
          textarea.value = (textarea.value.trim() ? textarea.value.trim() + " " : "") + v + " ";
          updateStream();
        });
        keyboard.appendChild(btn);
      });
    }

    // 5. リアルタイムエンコード・デコードパイプライン
    function updateStream() {
      const packet = encode(textarea.value);
      if (packetOutput) packetOutput.value = packet || "⚡ AWAIT SIGNAL...";
      if (decodeOutput) decodeOutput.innerText = decode(packet) || "⏳ AWAIT PACKET CONVERGENCE...";
    }

    if (textarea) {
      textarea.addEventListener('input', updateStream);
      if (textarea.value) updateStream();
    }

  } catch (error) {
    console.error("❌ 要塞との結合に失敗しました:", error);
    if (badge) {
      badge.innerText = "● SIGN-X CORE OFFLINE (CONNECTION ERROR)";
      badge.style.color = "#ef4444";
    }
  }
});
