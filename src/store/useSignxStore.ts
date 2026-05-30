/**
 * SIGN-X v8.40 状態管理大統一ストア
 * パス: src/store/useSignxStore.ts
 */
import { create } from 'zustand';
import { dictLoader } from '../dict/loader';
import { encode } from '../core/encoder';
import { decode } from '../core/decompressor';

interface SignxState {
  rawText: string;
  encodedPacket: string;
  decodedText: string;
  isInitialized: boolean;
  dictCount: number;
  setRawText: (text: string) => void;
  setEncodedPacket: (packet: string) => void;
  injectVector: (vector: string) => void;
  initSystem: () => Promise<void>;
}

export const useSignxStore = create<SignxState>((set, get) => ({
  rawText: '',
  encodedPacket: '',
  decodedText: '',
  isInitialized: false,
  dictCount: 0,

  // 日本語入力 ➔ 62進数パケット＆復元テストを同時実行
  setRawText: (text) => {
    const encoded = encode(text);
    const decoded = decode(encoded);
    set({ rawText: text, encodedPacket: encoded, decodedText: decoded });
  },

  // 62進数パケット直接入力 ➔ 日本語復元
  setEncodedPacket: (packet) => {
    const decoded = decode(packet);
    set({ encodedPacket: packet, decodedText: decoded });
  },

  // 多次元修飾ベクトル層の吸着インジェクション
  injectVector: (vector) => {
    const current = get().rawText;
    const nextText = current.trim() ? `${current.trim()} ${vector} ` : `${vector} `;
    get().setRawText(nextText);
  },

  initSystem: async () => {
    if (get().isInitialized) return;
    await dictLoader.load();
    set({ 
      isInitialized: true, 
      dictCount: dictLoader.allWords ? dictLoader.allWords.length : 76032 
    });
  }
}));
