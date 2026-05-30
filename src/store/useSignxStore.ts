/**
 * SIGN-X v8.40 状態管理大統一ストア (Vercel確定現成版)
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

  setRawText: (text) => {
    const encoded = encode(text);
    const decoded = decode(encoded);
    set({ rawText: text, encodedPacket: encoded, decodedText: decoded });
  },

  setEncodedPacket: (packet) => {
    const decoded = decode(packet);
    set({ encodedPacket: packet, decodedText: decoded });
  },

  injectVector: (vector) => {
    const current = get().rawText;
    const nextText = current.trim() ? `${current.trim()} ${vector} ` : `${vector} `;
    get().setRawText(nextText);
  },

  initSystem: async () => {
    if (get().isInitialized) return;
    await dictLoader.load();
    set({ isInitialized: true, dictCount: dictLoader.allWords ? dictLoader.allWords.length : 76032 });
  }
}));
