/**
 * SIGN-X v8.45 大統一アーキテクチャ・ハイブリッドコアエンジン
 * パス: src/main.js
 * 
 * トポロジー:
 * 1. 普遍的概念（11万語） ➔ 秘密鍵付き中央要塞からダイレクト吸引
 * 2. 固有辞書（ユーザーバッファ） ➔ 各プロジェクトの足元から個別吸引
 */

const BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// 🪐 一元管理された11万語のPrivate要塞ベース
const GITHUB_ARCHIVE_BASE = "https://raw.githubusercontent.com/pandorapanchan34-oss/The-pandora-archive/main/public/dict";
// 🪐 各アプリの足元（ローカル）に配置する固有バッファベース
const LOCAL_DICT_BASE = "./public/dict";

// 擬態化された十品詞カテゴリートポロジー
const CATEGORY_MAP = {
  "pronoun": "A", "life": "B", "nature": "C", "move": "D",
  "place": "P", "daily": "N", "time": "t", "system": "g", "state": "s"
};

const REVERSE_CATEGORY_MAP = Object.fromEntries(
  Object.entries(CATEGORY_MAP).map(([k, v]) => [v, k])
);

const VEK_LAYOUT = ['↑','↓','+','-','~','*','?','→','←','↺','↻','⇄','⚠','♡','🖤','⚡','🙇','w','💦','⏳','❌'];

class HybridDictLoader {
  constructor() {
    this.encodeMap = new Map();
    this.glyphToCategoryMap = new Map(); 
    this.categoryEntries = new Map(); 
    this.macroEntries = [];
    this.allWords = []; 
    this.isReady = false;
  }

  async load() {
    try {
      console.log("📡 [Archive Pipeline] 11万語の普遍宇宙 ✕ 固有バッファの二系統吸引を開始...");

      // 1. 中央要塞からコアデータを非同期で一斉吸引
      const [resMacro, resCore, resVariants, resDynamic, resVectors] = await Promise.all([
        fetch(`${GITHUB_ARCHIVE_BASE}/macro.json`).then(r => r.json()).catch(() => ({ entries: [] })),
        fetch(`${GITHUB_ARCHIVE_BASE}/static_core.json`).then(r => r.json()).catch(() => ({ entries: [] })),
        fetch(`${GITHUB_ARCHIVE_BASE}/static_variants.json`).then(r => r.json()).catch(() => ({ entries: [] })),
        fetch(`${GITHUB_ARCHIVE_BASE}/dynamic.json`).then(r => r.json()).catch(() => ({ entries: [] })),
        fetch(`${GITHUB_ARCHIVE_BASE}/vectors.json`).then(r => r.json()).catch(() => ({ entries: [] }))
      ]);

      // 2. 【天才の閃き】足元のローカル領域から、このアプリ専用の user-dict.json だけをピンポイント独立吸引！
      const resUserLocal = await fetch(`${LOCAL_DICT_BASE}/user-dict.json`)
        .then(r => r.json())
        .catch(() => {
          console.log("ℹ️ [Local Pipeline] 足元にアプリ固有の user-dict.json は未配置です（スキップ可能）");
          return { entries: [] };
        });

      if (resMacro?.entries) this.macroEntries = resMacro.entries;

      // 各エントリーを共通マップに登録するサブルーチン
      const register = (res) => {
        if (!res?.entries) return;
        res.entries.forEach(entry => {
          if (!entry || !entry.glyph) return;
          
          const cat = entry.category || 'unknown';
          if (!this.categoryEntries.has(cat)) this.categoryEntries.set(cat, []);
          this.categoryEntries.get(cat).push(entry);

          const vList = Array.isArray(entry.variants) ? [...entry.variants] : (entry.variants ? [entry.variants] : []);
          const mainWord = entry.main || entry.mean;
          if (mainWord && !vList.includes(mainWord)) vList.push(mainWord);

          vList.forEach(v => {
            if (!v) return;
            this.encodeMap.set(v, entry.glyph);
            this.glyphToCategoryMap.set(entry.glyph, cat);
            this.allWords.push(v);
          });
        });
      };

      // 中央の普遍概念をマウント
      register(resCore);
      register(resVariants);
      register(resDynamic);
      register(resVectors);
      
      // 足元のアプリ固有記憶（user-dict）を最後にマウントして大統一結合！
      register(resUserLocal);

      // 重複排除と長さ順ソート（最長一致トポロジーの確保）
      this.allWords = [...new Set(this.allWords)].sort((a, b) => b.length - a.length);
      this.isReady = true;
      
      console.log(`🟢 [Archive Pipeline] 二系統大統一成功: 総語彙数[${this.allWords.length}]`);
      return this.allWords.length;
    } catch (e) {
      console.error("❌ 吸引パイプライン断線:", e);
      return 0;
    }
  }

  encode(text) {
    if (!text || !this.isReady) return text || '';
    let stream = text.trim();

    // Macro層置換
    const sortedMacros = [...this.macroEntries].sort((a, b) => b.trigger.length - a.trigger.length);
    for (const m of sortedMacros) {
      const replaceTo = m.replace_to || m.replaceTo;
      if (m.trigger && replaceTo && stream.includes(m.trigger)) {
        stream = stream.replace(new RegExp(m.trigger, 'g'), ` ${replaceTo} `);
      }
    }

    stream = stream.replace(/[！!]/g, ' ↑ ').replace(/[？?]/g, ' ? ');

    // 62進数自動写像層
    const placeholderMap = new Map();
    let tokenCounter = 0;

    for (const word of this.allWords) {
      if (!word || !stream.includes(word)) continue;
      const glyph = this.encodeMap.get(word);
      if (!glyph) continue;

      const cat = this.glyphToCategoryMap.get(glyph) || 'unknown';
      let deepCode = glyph; 

      if (CATEGORY_MAP[cat]) {
        const prefix = CATEGORY_MAP[cat];
        const entries = this.categoryEntries.get(cat) || [];
        const index = entries.findIndex(e => e.glyph === glyph);
        const suffix = BASE62[index >= 0 ? index % 62 : 0];
        deepCode = prefix + suffix; 
      }

      // 特殊記号や絵文字（🏥や→など）は生コードを維持するトポロジー
      if (glyph.match(/[^\w\s]/u)) {
        deepCode = glyph;
      }

      const placeholder = `__DEEP_TOKEN_${tokenCounter}__`;
      placeholderMap.set(placeholder, deepCode);
      tokenCounter++;
      
      const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      stream = stream.replace(new RegExp(escapedWord, 'g'), ` ${placeholder} `);
    }

    // 文法ノイズのフィルタリング
    stream = stream.replace(/\b(は|が|を|に|で|と|も|の|て|だよ|です|ます|行って|から|貰う)\b/g, ' ');
    let tokens = stream.trim().split(/\s+/).filter(Boolean);

    let finalTokens = tokens.map(t => t.startsWith('__DEEP_TOKEN_') ? (placeholderMap.get(t) || t) : t);
    let joined = finalTokens.join(' ').replace(/\s+([↑↓+\-~*?→←↺↻⇄⚠♡🖤⚡🙇w💦⏳❌])/g, '$1');

    return joined.replace(/\s+/g, ' ').trim();
  }

  decode(packet) {
    if (!packet || !this.isReady) return '';
    let stream = packet.trim().replace(/([↑↓+\-~*?→←↺↻⇄⚠♡🖤⚡🙇w💦⏳❌🏥💊])/g, ' $1 ');
    const tokens = stream.split(/\s+/).filter(Boolean);
    
    return tokens.map(token => {
      if (token.length === 2) {
        const prefix = token[0];
        const suffix = token[1];
        const cat = REVERSE_CATEGORY_MAP[prefix];
        const index = BASE62.indexOf(suffix);
        if (cat) {
          const entries = this.categoryEntries.get(cat) || [];
          if (entries[index]) return entries[index].main || entries[index].mean;
        }
      }
      for (const word of this.allWords) {
        if (this.encodeMap.get(word) === token) return word;
      }
      return token;
    }).join(' ').trim();
  }
}

const dictLoader = new HybridDictLoader();

// UIレイヤー結合（DOMマウント）
window.addEventListener('DOMContentLoaded', async () => {
  const textarea = document.getElementById('input-textarea');
  const packetOutput = document.getElementById('packet-output');
  const decodeOutput = document.getElementById('decode-output');
  const keyboard = document.getElementById('vector-keyboard');
  const badge = document.getElementById('sync-badge');

  if (badge) badge.innerText = "● SIGN-X CONNECTING CORE...";

  // 普遍宇宙 ✕ ローカル固有 の大統一吸引を実行
  const totalWords = await dictLoader.load();
  
  if (badge) {
    badge.innerText = `● SIGN-X ONLINE [${totalWords} words]`;
    badge.style.color = "#34d399";
  }

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

  function updateStream() {
    const packet = dictLoader.encode(textarea.value);
    if (packetOutput) packetOutput.value = packet || "⚡ AWAIT SIGNAL...";
    if (decodeOutput) decodeOutput.innerText = dictLoader.decode(packet) || "⏳ AWAIT PACKET CONVERGENCE...";
  }

  if (textarea) {
    textarea.addEventListener('input', updateStream);
    if (textarea.value) updateStream();
  }
});
