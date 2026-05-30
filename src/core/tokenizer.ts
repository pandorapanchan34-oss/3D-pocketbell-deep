/**
 * SIGN-X v8.40 品詞分離トークナイザー
 * パス: src/core/tokenizer.ts
 */
import { dictLoader } from '../dict/loader';

export function tokenize(text: string): string[] {
  if (!text) return [];
  let stream = text.trim();

  // 記号（ベクトル）の初期切り出し
  stream = stream.replace(/[！!]/g, ' ↑ ').replace(/[？?]/g, ' ? ');

  // プレースホルダーを用いた最長一致マッピング
  const placeholderMap = new Map<string, string>();
  let counter = 0;

  // 辞書の全語彙（長い順）で走査
  for (const word of dictLoader.allWords) {
    if (!word || !stream.includes(word)) continue;
    
    const placeholder = `__TOKEN_${counter}__`;
    placeholderMap.set(placeholder, word);
    counter++;

    // 単語の前後をスペースで保護して置換
    stream = stream.replace(new RegExp(word, 'g'), ` ${placeholder} `);
  }

  // 日本語独自の助詞・不要ノイズを完全パージ
  stream = stream.replace(/\b(は|が|を|に|で|と|も|の|て|だよ|です|ます)\b/g, ' ');

  // 空白でトークンに分割
  const rawTokens = stream.trim().split(/\s+/).filter(Boolean);

  // プレースホルダーを元の単語（または結晶コード用単語）に復元
  return rawTokens.map(t => {
    if (t.startsWith('__TOKEN_')) {
      return placeholderMap.get(t) || t;
    }
    return t;
  });
}
