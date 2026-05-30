/**
 * SIGN-X v8.40 62進数国文法カテゴリー大統一画面 - 149行目エラー修正版
 * パス: src/App.tsx
 */
import { useEffect } from 'react';
import { useSignxStore } from './store/useSignxStore';

const VEK_LAYOUT = [
  { label: '↑', tip: 'バースト（かなり/超/激）' }, 
  { label: '↓', tip: '抑制（ちょっと/少し/しんどい）' },
  { label: '+', tip: '肯定・願望（〜したい/欲しい）' },   
  { label: '-', tip: '否定・不足（〜したくない/無い）' },
  { label: '~', tip: 'ゆらぎ（曖昧/確率/夢）' },   
  { label: '*', tip: '極限突破（最大/無限/神）' },
  { label: '?', tip: '疑問（〜か？/問い）' },     
  { label: '→', tip: '能動射出（行く/出す/伝える）' },
  { label: '←', tip: '受動吸引（来る/貰う/聴く）' }, 
  { label: '↺', tip: '自己回帰（自分/戻る/ループ）' },
  { label: '↻', tip: '相手指向（相手/向かう）' }, 
  { label: '⇄', tip: '相互結合（会う/通信/同期）' },
  { label: '⚠', tip: '注意警告（危険/エラー/バグ）' }, 
  { label: '♡', tip: '萌え感情（好き/愛）' }, 
  { label: '🖤', tip: '孤独寂感（寂しい/虚無）' }, 
  { label: '⚡', tip: '至急強度（今すぐ/はやく）' }, 
  { label: '🙇', tip: '深謝丁寧（です/ます/お願い）' }, 
  { label: 'w', tip: '砕口語笑（やばい/草/マジ）' }, 
  { label: '💦', tip: '後悔焦燥（ごめん/すまん）' }, 
  { label: '⏳', tip: '因果時軸（時間/スケジュール）' },
  { label: '（！）', tip: '確信確約（絶対に/コミット）' }, 
  { label: '（？）', tip: '不確願望（〜かなぁ/未確定）' },
  { label: '❌', tip: '完全否定（ダメ/拒絶）' }
];

export default function App() {
  const { rawText, encodedPacket, isInitialized, dictCount, setRawText, injectVector, initSystem } = useSignxStore();

  useEffect(() => {
    initSystem();
  }, [initSystem]);

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-emerald-400 font-mono animate-pulse text-sm tracking-widest">
        🛰️ [SIGN-X Deep] GITHUB DIRECT STREAM INITIALIZING...
      </div>
    );
  }

  const ratio = rawText.length > 0 ? ((encodedPacket.replace(/\s+/g, '').length / rawText.length) * 100).toFixed(1) : '100.0';

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 text-slate-100 font-mono flex items-center justify-center">
      <div className="w-full max-w-4xl bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-md">
        
        {/* ヘッダー */}
        <header className="flex justify-between items-center border-b border-slate-800/60 pb-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-wider">
              3D-pocketbell — SIGN-X v8.40
            </h1>
            <p className="text-xs text-slate-500 mt-1">国文法62進数カテゴリー品詞圧縮 (Deep Edition)</p>
          </div>
          <div className="bg-slate-950 border border-emerald-500/30 px-3 py-1 rounded-full text-emerald-400 text-xs shadow-[0_0_15px_rgba(16,185,129,0.15)] font-bold">
            ● クラウド同期: {dictCount} 語彙
          </div>
        </header>

        {/* メイングリッド */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            
            {/* 自然言語入力層 */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 shadow-inner">
              <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                📥 Natural Language Input (自然言語入力層)
              </label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="例：私、今から電車で行くね！マスター、パンドラパンパン！"
                className="w-full h-24 bg-transparent border-none text-slate-200 placeholder-slate-200 focus:outline-none resize-none text-sm font-bold tracking-wide"
              />
            </div>

            {/* 62進数パケット出力層 */}
            <div className="bg-slate-950/80 border border-emerald-950 rounded-xl p-4 relative overflow-hidden shadow-inner group hover:border-emerald-500/30 transition-colors">
              <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-400 text-[9px] px-2 py-0.5 rounded-bl font-black tracking-wider border-l border-b border-slate-800">
                62BASE_DEEP_PACKET
              </div>
              <label className="block text-[11px] font-bold text-emerald-500/70 mb-2 uppercase tracking-wider">
                📟 SIGN-X PACKET STREAM (結晶化パケット出力)
              </label>
              <div className="w-full min-h-[3.5rem] flex items-center text-emerald-400 font-black tracking-widest text-2xl break-all select-all">
                {encodedPacket || '⚡ AWAIT MASTER SIGNAL...'}
              </div>
              <div className="flex gap-4 mt-3 pt-3 border-t border-slate-900 text-[10px] text-slate-600">
                <div>ORIGIN: <span className="text-slate-400 font-bold">{rawText.length}文字</span></div>
                <div>PACKET: <span className="text-slate-400 font-bold">{encodedPacket.replace(/\s+/g, '').length}文字</span></div>
                <div>帯域削減率: <span className="text-emerald-500 font-bold">{ratio}%</span></div>
              </div>
            </div>

          </div>

          {/* ベクトルキーボード層 */}
          <div className="md:col-span-1">
            <div className="bg-slate-950/50 border border-slate-800/60 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                <span>⚙️</span> 多次元修飾ベクトル層
              </h3>
              <div className="grid grid-cols-4 gap-1.5">
                {VEK_LAYOUT.map((v) => (
                  <button
                    key={v.label}
                    onClick={() => injectVector(v.label)}
                    title={v.tip}
                    className="h-11 flex flex-col justify-center items-center rounded-lg bg-slate-950 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900/60 text-slate-300 hover:text-emerald-400 transition-all active:scale-95 shadow-md group"
                  >
                    <span className="text-base font-black group-hover:scale-110 transition-transform">{v.label}</span>
                    <span className="text-[7px] text-slate-600 font-normal scale-90 block truncate max-w-full mt-0.5">{v.tip.split('（')[0]}</span>
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
