/**
 * SIGN-X v8.40 62進数国文法カテゴリー圧縮エンジン
 * パス: src/core/encoder.ts
 */
import { dictLoader } from '../dict/loader';

// 62文字のマトリクス基準（有限帯域B）
const BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// お兄ちゃん設計の「品詞大分類トポロジー」マッピング
const CATEGORY_MAP: { [key: string]: string } = {
  // ❶ 名詞・代名詞（頭文字は大文字）
  "pronoun": "A", // 人間・代名詞（私=Aa, あなた=Ab）
  "life":    "B", // どうぶつ
  "nature":  "C", // 植物・自然
  "move":    "D", // 乗り物・移動
  "place":   "P", // 場所・施設
  "daily":   "N", // 日常生活・物
  
  // ❷ 時間・概念（頭文字は小文字）
  "time":    "t", // 時間軸（今=tn, 未来=tf）
  "system":  "g", // 概念・システム
  "state":   "s", // 状態
};

export function encode(text: string): string {
  if (!text) return '';
  let stream = text.trim();

  // 【Step 0: マクロ置換】
  const macros = dictLoader.getMacroEntries();
  const sortedMacros = [...macros].sort((a, b) => b.trigger.length - a.trigger.length);
  for (const m of sortedMacros) {
    const replaceTo = m.replace_to || m.replaceTo;
    if (m.trigger && replaceTo && stream.includes(m.trigger)) {
      stream = stream.replace(new RegExp(m.trigger, 'g'), ` ${replaceTo} `);
    }
  }

  // 記号の初期正規化（！や？をベクトル化）
  stream = stream.replace(/[！!]/g, ' ↑ ').replace(/[？?]/g, ' ? ');

  // 【Step 1: 62進数品詞コードへの自動写像】
  const placeholderMap = new Map<string, string>();
  let tokenCounter = 0;

  for (const word of dictLoader.allWords) {
    if (!word || !stream.includes(word)) continue;

    const glyph = dictLoader.getGlyph(word);
    if (!glyph) continue;

    const cat = dictLoader.getCategoryByGlyph(glyph) || 'unknown';
    let deepCode = glyph; // フォールバック

    // お兄ちゃんの品詞規則を厳密に自動適用
    if (CATEGORY_MAP[cat]) {
      const prefix = CATEGORY_MAP[cat];
      // そのカテゴリーの中での単語の固有インデックスを取得して62進数化
      const entries = dictLoader.getEntriesByCategory(cat);
      const index = entries.findIndex(e => e.glyph === glyph);
      const suffix = BASE62[index >= 0 ? index % 62 : 0];
      
      deepCode = prefix + suffix; // 例: Aa, Ab, Da
    } else if (cat === 'action' || cat === 'emotion' || cat === 'vector') {
      // ❸ 動詞・感情・副詞 ＝ ベクトル記号層へパージ
      deepCode = glyph; 
    }

    const placeholder = `__DEEP_TOKEN_${tokenCounter}__`;
    placeholderMap.set(placeholder, deepCode);
    tokenCounter++;

    stream = stream.replace(new RegExp(word, 'g'), ` ${placeholder} `);
  }

  // 助詞やノイズのパージ
  stream = stream.replace(/\b(は|が|を|に|で|と|も|の|て|だよ|です|ます)\b/g, ' ');

  let tokens = stream.trim().split(/\s+/).filter(Boolean);

  // プレースホルダーを「真のDeepパケット」に復元
  let finalTokens = tokens.map(t => {
    if (t.startsWith('__DEEP_TOKEN_')) {
      return placeholderMap.get(t) || t;
    }
    return t;
  });

  // ベクトル自動吸着（半角スペースを詰める）
  let joined = finalTokens.join(' ');
  joined = joined.replace(/\s+([↑↓+\-~*?→←↺↻⇄⚠♡🖤⚡🙇w💦⏳❌])/g, '$1');

  return joined.replace(/\s+/g, ' ').trim();
}
