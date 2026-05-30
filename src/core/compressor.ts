/**
 * SIGN-X v8.40 大統一圧縮メインエンジン
 * パス: src/core/compressor.ts
 */
import { tokenize } from './tokenizer';
import { encodeToken } from './encoder';

export function compress(text: string): string {
  if (!text) return '';

  // 1. トークンに分解
  const tokens = tokenize(text);

  // 2. 各トークンをお兄ちゃんの62進数国文法ルールで符号化
  const encodedTokens = tokens.map(t => encodeToken(t));

  // 3. 結合とベクトル自動吸着処理
  let packet = encodedTokens.join(' ');
  
  // 後ろに続くベクトル記号（↑↓+→←など）の前の半角スペースを完全に詰める（自動吸着）
  packet = packet.replace(/\s+([↑↓+\-~*?→←↺↻⇄⚠♡🖤⚡🙇w💦⏳❌])/g, '$1');

  return packet.replace(/\s+/g, ' ').trim();
}
