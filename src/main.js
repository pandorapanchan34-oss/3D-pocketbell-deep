/**
 * SIGN-X v8.40 大統一ピュア・コアロジック
 * パス: src/main.js
 */

// 62文字のマトリクス基準（有限帯域B）
const BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const CATEGORY_MAP = {
  "pronoun": "A", "life": "B", "nature": "C", "move": "D",
  "place": "P", "daily": "N", "time": "t", "system": "g", "state": "s"
};

const REVERSE_CATEGORY_MAP = Object.fromEntries(
  Object.entries(CATEGORY_MAP).map(([k, v]) => [v, k])
);

// ベクトルキーの定義
const VEK_LAYOUT = ['↑','↓','+','-','~','*','?','→','←','↺','↻','⇄','⚠','♡','🖤','⚡','🙇','w','💦','⏳','❌'];

// 擬似辞書ローダー（外部モジュールがなくても動く防衛殻）
const mockDict = {
  allWords: ["私", "あなた", "犬", "電車", "家", "今", "未来", "パンドラ", "パンドラパンパン", "行く", "来る"],
  getGlyph(w) {
    const map = { "私":"Aa", "あなた":"Ab", "犬":"Ba", "電車":"Da", "家":"Pa", "今":"tn", "未来":"tf", "パンドラ":"ga", "パンドラパンパン":"Hello World", "行く":"→", "来る":"←" };
    return map[w] || null;
  },
  getCategoryByGlyph(g) {
    if (g === "Aa" || g === "Ab") return "pronoun";
    if (g === "Ba") return "life";
    if (g === "Da") return "move";
    if (g === "Pa") return "place";
    if (g === "tn" || g === "tf") return "time";
    if (g === "ga" || g === "Hello World") return "system";
    return "unknown";
  },
  getEntriesByCategory(cat) {
    if (cat === "pronoun") return [{glyph:"Aa", main:"私"}, {glyph:"Ab", main:"あなた"}];
    if (cat === "life") return [{glyph:"Ba", main:"犬"}];
    if (cat === "move") return [{glyph:"Da", main:"電車"}];
    if (cat === "place") return [{glyph:"Pa", main:"家"}];
    if (cat === "time") return [{glyph:"tn", main:"今"}, {glyph:"tf", main:"未来"}];
    if (cat === "system") return [{glyph:"ga", main:"パンドラ"}, {glyph:"Hello World", main:"パンドラパンパン"}];
    return [];
  }
};

// ❶ 大統一圧縮（エンコーダー）
function encode(text) {
  if (!text) return '';
  let stream = text.trim();

  // マクロ置換（パンドラパンパン ➔ Hello World）
  if (stream.includes("パンドラパンパン")) {
    stream = stream.replace(/パンドラパンパン/g, " Hello World ");
  }

  stream = stream.replace(/[！!]/g, ' ↑ ').replace(/[？?]/g, ' ? ');

  for (const word of mockDict.allWords) {
    if (!word || !stream.includes(word)) continue;
    const glyph = mockDict.getGlyph(word);
    if (!glyph) continue;

    const placeholder = ` __DEEP_${glyph}__ `;
    stream = stream.replace(new RegExp(word, 'g'), placeholder);
  }

  // 助詞パージ
  stream = stream.replace(/\b(は|が|を|に|で|と|も|の|て|だよ|です|ます|ね)\b/g, ' ');
  let tokens = stream.trim().split(/\s+/).filter(Boolean);

  let finalTokens = tokens.map(t => {
    if (t.startsWith('__DEEP_') && t.endsWith('__')) {
      return t.replace(/__DEEP_(.*)__/g, '$1');
    }
    return t;
  });

  let joined = finalTokens.join(' ');
  // ベクトル自動吸着
  joined = joined.replace(/\s+([↑↓+\-~*?→←↺↻⇄⚠♡🖤⚡🙇w💦⏳❌])/g, '$1');
  return joined.replace(/\s+/g, ' ').trim();
}

// ❷ 大統一復元（デコーダー）
function decode(packet) {
  if (!packet) return '';
  let stream = packet.trim().replace(/([↑↓+\-~*?→←↺↻⇄⚠♡🖤⚡🙇w💦⏳❌])/g, ' $1 ');
  const tokens = stream.split(/\s+/).filter(Boolean);
  
  return tokens.map(token => {
    if (token === "Hello World") return "パンドラパンパン";
    if (token.length === 2) {
      const prefix = token[0];
      const suffix = token[1];
      const cat = REVERSE_CATEGORY_MAP[prefix];
      const index = BASE62.indexOf(suffix);
      if (cat && index !== -1) {
        const entries = mockDict.getEntriesByCategory(cat);
        if (entries[index]) return entries[index].main;
      }
    }
    // ベクトル逆引き
    for (const word of mockDict.allWords) {
      if (mockDict.getGlyph(word) === token) return word;
    }
    return token;
  }).join(' ').trim();
}

// ❸ UIマウント駆動
document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('input-textarea');
  const packetOutput = document.getElementById('packet-output');
  const decodeOutput = document.getElementById('decode-output');
  const keyboard = document.getElementById('vector-keyboard');

  // キーボード生成
  VEK_LAYOUT.forEach(v => {
    const btn = document.createElement('button');
    btn.innerHTML = `<span style="font-size:1.25rem; font-weight:900;">${v}</span>`;
    btn.style.cssText = "height: 3rem; background: #020617; border: 1px solid #1e293b; color: #cbd5e1; border-radius: 0.5rem; cursor: pointer;";
    btn.addEventListener('click', () => {
      textarea.value = (textarea.value.trim() ? textarea.value.trim() + " " : "") + v + " ";
      updateStream();
    });
    keyboard.appendChild(btn);
  });

  function updateStream() {
    const text = textarea.value;
    const packet = encode(text);
    packetOutput.value = packet || "⚡ AWAIT SIGNAL...";
    decodeOutput.innerText = decode(packet) || "⏳ AWAIT PACKET CONVERGENCE...";
  }

  textarea.addEventListener('input', updateStream);
});
