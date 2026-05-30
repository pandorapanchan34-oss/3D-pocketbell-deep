/**
 * SIGN-X v8.40 62進数カテゴリー大統一コアエンジン
 * パス: src/dict/loader.ts
 */

export interface DictEntry {
  id?: string;
  glyph: string;
  main?: string;
  mean?: string;
  category?: string;
  variants?: string | string[];
}

export interface MacroEntry {
  id?: string;
  trigger: string;
  replace_to?: string;
  replaceTo?: string;
}

const BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const GITHUB_BASE = "https://raw.githubusercontent.com/pandorapanchan34-oss/3D-pocketbell/main/public/dict";

// お兄ちゃん設計の国文法十品詞マッピングトポロジー
const CATEGORY_MAP: { [key: string]: string } = {
  "pronoun": "A", // 人間・代名詞（私=Aa, あなた=Ab）
  "life":    "B", // どうぶつ
  "nature":  "C", // 植物・自然
  "move":    "D", // 乗り物・移動
  "place":   "P", // 場所・施設
  "daily":   "N", // 日常生活・物
  "time":    "t", // 時間軸（今=tn, 未来=tf）
  "system":  "g", // 概念・システム
  "state":   "s", // 状態
};

class DictLoader {
  public encodeMap = new Map<string, string>();
  public glyphToCategoryMap = new Map<string, string>(); 
  public categoryEntries = new Map<string, DictEntry[]>(); 
  public macroEntries: MacroEntry[] = [];
  public allWords: string[] = []; 

  async load(): Promise<void> {
    try {
      const [resMacro, resCore, resVariants, resDynamic, resVectors] = await Promise.all([
        fetch(`${GITHUB_BASE}/macro.json`).then(r => r.json()).catch(() => ({ entries: [] })),
        fetch(`${GITHUB_BASE}/static_core.json`).then(r => r.json()).catch(() => ({ entries: [] })),
        fetch(`${GITHUB_BASE}/static_variants.json`).then(r => r.json()).catch(() => ({ entries: [] })),
        fetch(`${GITHUB_BASE}/dynamic.json`).then(r => r.json()).catch(() => ({ entries: [] })),
        fetch(`${GITHUB_BASE}/vectors.json`).then(r => r.json()).catch(() => ({ entries: [] }))
      ]);

      if (resMacro?.entries) this.macroEntries = resMacro.entries;

      const register = (res: { entries: DictEntry[] }) => {
        if (!res?.entries) return;
        res.entries.forEach(entry => {
          if (!entry || !entry.glyph) return;
          
          const cat = entry.category || 'unknown';
          if (!this.categoryEntries.has(cat)) this.categoryEntries.set(cat, []);
          this.categoryEntries.get(cat)!.push(entry);

          const vList: string[] = Array.isArray(entry.variants) ? [...entry.variants] : (entry.variants ? [entry.variants] : []);
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

      register(resCore);
      register(resVariants);
      register(resDynamic);
      register(resVectors);

      this.allWords = [...new Set(this.allWords)].sort((a, b) => b.length - a.length);
      console.log(`📡 [Deep Engine] 覚醒完了: 語彙数[${this.allWords.length}]`);
    } catch (e) {
      console.error("❌ 吸引断線:", e);
    }
  }

  // 🪐 お兄ちゃんの「国文法62進数カテゴリー圧縮」核心アルゴリズム
  public encode(text: string): string {
    if (!text) return '';
    let stream = text.trim();

    // Step 0: マクロ置換
    const sortedMacros = [...this.macroEntries].sort((a, b) => b.trigger.length - a.trigger.length);
    for (const m of sortedMacros) {
      const replaceTo = m.replace_to || m.replaceTo;
      if (m.trigger && replaceTo && stream.includes(m.trigger)) {
        stream = stream.replace(new RegExp(m.trigger, 'g'), ` ${replaceTo} `);
      }
    }

    stream = stream.replace(/[！!]/g, ' ↑ ').replace(/[？?]/g, ' ? ');

    // Step 1: 62進数自動写像
    const placeholderMap = new Map<string, string>();
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
        deepCode = prefix + suffix; // 例: Aa, Ab, Da
      }

      const placeholder = `__DEEP_TOKEN_${tokenCounter}__`;
      placeholderMap.set(placeholder, deepCode);
      tokenCounter++;
      stream = stream.replace(new RegExp(word, 'g'), ` ${placeholder} `);
    }

    stream = stream.replace(/\b(は|が|を|に|で|と|も|の|て|だよ|です|ます)\b/g, ' ');
    let tokens = stream.trim().split(/\s+/).filter(Boolean);

    let finalTokens = tokens.map(t => t.startsWith('__DEEP_TOKEN_') ? (placeholderMap.get(t) || t) : t);
    let joined = finalTokens.join(' ').replace(/\s+([↑↓+\-~*?→←↺↻⇄⚠♡🖤⚡🙇w💦⏳❌])/g, '$1');

    return joined.replace(/\s+/g, ' ').trim();
  }
}

export const dictLoader = new DictLoader();
