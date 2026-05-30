/**
 * SIGN-X v8.40 大統一デバッグメインUI (Deep Edition)
 * パス: src/App.tsx
 */
import { useEffect } from 'react';
import { useSignxStore } from './store/useSignxStore';

const VEK_LAYOUT = [
  { label: '↑', tip: 'バースト（かなり/超/激）' }, { label: '↓', tip: '抑制（ちょっと/少し）' },
  { label: '+', tip: '肯定・願望（〜したい）' },   { label: '-', tip: '否定・不足（〜ない）' },
  { label: '~', tip: 'ゆらぎ（確率/夢）' },       { label: '*', tip: '極限突破（最大/神）' },
  { label: '?', tip: '疑問（〜か？）' },           { label: '→', tip: '能動射出（行く/出す）' },
  { label: '←', tip: '受動吸引（来る/貰う）' },     { label: '↺', tip: '自己回帰（ループ）' },
  { label: '↻', tip: '相手指向（向かう）' },       { label: '⇄', tip: '相互結合（会う/同期）' },
  { label: '⚠', tip: '注意警告（エラー）' },       { label: '♡', tip: '萌え感情（好き/愛）' },
  { label: '🖤', tip: '孤独寂感（寂しい）' },      { label: '⚡', tip: '至急強度（今すぐ）' },
  { label: '🙇', tip: '深謝丁寧（お願い）' },       { label: 'w', tip: '砕口語笑（草）' },
  { label: '💦', tip: '後悔焦燥（ごめん）' },       { label: '⏳', tip: '因果時軸（時間）' },
  { label: '❌', tip: '完全否定（ダメ）' }
];

export default function App() {
  const { rawText, encodedPacket, decodedText, isInitialized, dictCount, setRawText, setEncodedPacket, injectVector, initSystem } = useSignxStore();

  useEffect(() => {
    initSystem();
  }, [initSystem]);

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-emerald-400 font-mono animate-pulse text-sm tracking-widest">
        🛰️ [SIGN-X DEEP-CORE] GITHUB CLOUD DATA ATTACHING...
      </div>
    );
  }

  const ratio = rawText.length > 0 ? ((encodedPacket.replace(/\s+/g, '').length / rawText.length) * 100).toFixed(1) : '100.0';

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-100 font-mono flex items-center justify-center">
      <div className="w-full max-w-5xl bg-slate-900/30 border border-slate-800/80 p-6 rounded-2xl shadow-[0_0_60px_rgba(16,185,129,0.05)] backdrop-blur-md">
        
        {/* HEADER */}
        <header className="flex justify-between items-center border-b border-slate-800/60 pb-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-wider">
              3D-pocketbell — SIGN-X v8.40
            </h1>
            <p className="text-xs text-slate-500 mt-1">国文法62進数カテゴリー品詞圧縮（Deepリアルタイムデバッグ形態）</p>
          </div>
          <div className="bg-slate-950 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-400 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            ● クラウド同期: {dictCount} 語彙
          </div>
        </header>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* LEFT: INPUT & OUTPUT PANELS */}
          <div className="md:col-span-2 space-y-6">
            
            {/* InputArea */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 shadow-inner">
              <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wider">📥 Input Layer (自然言語入力層)</label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="例：私、今から電車で行くね！マスター、パンドラパンパン！"
                className="w-full h-24 bg-transparent border-none text-slate-200 placeholder-slate-800 focus:outline-none text-sm font-bold tracking-wide resize-none"
              />
            </div>

            {/* ResultPanel (ENCODE) */}
            <div className="bg-slate-950/90 border border-emerald-950/80 rounded-xl p-4 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
              <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 text-[8px] px-2 py-0.5 rounded-bl font-black tracking-wider border-l border-b border-slate-900">
                ENCODER_STREAM
              </div>
              <label className="block text-[10px] font-bold text-emerald-500/70 mb-2 uppercase tracking-wider">📟 Packet Stream (62進数パケット出力層)</label>
              <input
                type="text"
                value={encodedPacket}
                onChange={(e) => setEncodedPacket(e.target.value)}
                className="w-full bg-transparent border-none text-emerald-400 font-black tracking-widest text-2xl focus:outline-none select-all"
                placeholder="⚡ AWAIT SIGNAL..."
              />
              <div className="flex gap-4 mt-3 pt-3 border-t border-slate-900 text-[10px] text-slate-600">
                <div>ORIGIN: <span className="text-slate-400 font-bold">{rawText.length}字</span></div>
                <div>PACKET: <span className="text-slate-400 font-bold">{encodedPacket.replace(/\s+/g, '').length}字</span></div>
                <div>帯域削減率: <span className="text-emerald-500 font-bold">{ratio}%</span></div>
              </div>
            </div>

            {/* ResultPanel (DECODE TEST) */}
            <div className="bg-slate-950/90 border border-cyan-950/80 rounded-xl p-4 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
              <div className="absolute top-0 right-0 bg-cyan-500/10 text-cyan-400 text-[8px] px-2 py-0.5 rounded-bl font-black tracking-wider border-l border-b border-slate-900">
                DECOMPRESSOR_TEST
              </div>
              <label className="block text-[10px] font-bold text-cyan-500/70 mb-2 uppercase tracking-wider">🔓 Decoded Test Output (復元逆写像検証層)</label>
              <div className="w-full min-h-[2rem] flex items-center text-cyan-400 font-bold tracking-wide text-sm break-all">
                {decodedText || '⏳ AWAIT PACKET CONVERGENCE...'}
              </div>
            </div>

          </div>

          {/* RIGHT: VECTOR PANEL */}
          <div className="md:col-span-1">
            {/* VectorPanel */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                <span>⚙️</span> Vector Keyboard (多次元修飾ベクトル層)
              </h3>
              <div className="grid grid-cols-4 gap-1.5">
                {VEK_LAYOUT.map((v) => (
                  <button
                    key={v.label}
                    onClick={() => injectVector(v.label)}
                    title={v.tip}
                    className="h-11 flex flex-col justify-center items-center rounded-lg bg-slate-950 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900 text-slate-300 hover:text-emerald-400 transition-all active:scale-95 shadow-md group"
                  >
                    <span className="text-base font-black group-hover:scale-110 transition-transform">{v.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
