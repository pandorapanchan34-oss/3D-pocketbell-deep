/**
 * SIGN-X v8.40 62進数国文法カテゴリー復元エンジン
 * パス: src/core/decompressor.ts
 */
import { dictLoader } from '../dict/loader';

const BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// つかさお兄ちゃんの十品詞トポロジー（逆引き用）
const REVERSE_CATEGORY_MAP: { [key: string]: string } = {
  "A": "pronoun", // 人間・代名詞
  "B": "life",    // どうぶつ
  "C": "nature",  // 植物・自然
  "D": "move",    // 乗り物・移動
  "P": "place",   // 場所・施設
  "N": "daily",   // 日常生活・物
  "t": "time",    // 時間軸
  "g": "system",  // 概念・システム
  "s": "state"    // 状態
};

export function decode(packet: string): string {
  if (!packet) return '';

  // 1. パケットをトークンごとに分解（スペース区切り）
  // ※吸着したベクトル記号（例: Aa+ や Da→）を1文字ずつ切り離す前処理
  let stream = packet.trim();
  
  // 吸着している特殊ベクトル記号の前にスペースを入れて、一時的に分離する防衛殻
  stream = stream.replace(/([↑↓+\-~*?→←↺↻⇄⚠♡🖤⚡🙇w💦⏳❌])/g, ' $1 ');
  
  const tokens = stream.split(/\s+/).filter(Boolean);
  const decodedWords: string[] = [];

  for (const token of tokens) {
    // 【判定】2文字のアルファベット/数字コード（例: Aa, tn, D1 など）かチェック
    if (token.length === 2) {
      const prefix = token[0]; // 1文字目（大分類）
      const suffix = token[1]; // 2文字目（個別インデックス）

      const cat = REVERSE_CATEGORY_MAP[prefix];
      const index = BASE62.indexOf(suffix);

      if (cat && index !== -1) {
        // 固有カテゴリーの辞書エントリー群を吸引
        const entries = dictLoader.getEntriesByCategory(cat);
        const entry = entries[index];

        if (entry) {
          // メインの日本語（あるいは mean ）に復元
          decodedWords.push(entry.main || entry.mean || token);
          continue;
        }
      }
    }

    // 【判定】ベクトル記号、または辞書にない生の文字（そのまま復元）
    // vectors.json から直接 glyph（記号）の逆引きを試みる
    let foundLabel = token;
    for (const word of dictLoader.allWords) {
      if (dictLoader.getGlyph(word) === token) {
        foundLabel = word;
        break;
      }
    }
    decodedWords.push(foundLabel);
  }

  // 読みやすさのために、復元された単語を半角スペースで綺麗に結合して射出
  return decodedWords.join(' ').trim();
}
