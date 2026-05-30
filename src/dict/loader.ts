/**
 * SIGN-X v8.40 GitHubダイレクト吸引型ローダー
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

// 🪐 お兄ちゃんのGitHub大元データを直接ロックオン
const GITHUB_BASE = "https://raw.githubusercontent.com/pandorapanchan34-oss/3D-pocketbell/main/public/dict";

class DictLoader {
  public encodeMap = new Map<string, string>();
  public glyphToCategoryMap = new Map<string, string>(); // 品詞仕分け用
  public categoryEntries = new Map<string, DictEntry[]>(); // カテゴリーごとの単語格納庫
  public macroEntries: MacroEntry[] = [];
  public allWords: string[] = [];

  async load(): Promise<void> {
    console.log("🛰️ [GitHub Direct] クラウド・リポジトリから多次元データ層を直接吸引中...");

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
          if (!this.categoryEntries.has(cat)) {
            this.categoryEntries.set(cat, []);
          }
          this.categoryEntries.get(cat)!.push(entry);

          const vList: string[] = Array.isArray(entry.variants) 
            ? [...entry.variants] 
            : (entry.variants ? [entry.variants] : []);
          
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

      // 長い単語から順にマッチするようにソート（最重要防衛殻）
      this.allWords = [...new Set(this.allWords)].sort((a, b) => b.length - a.length);

      console.log(`🚀 [GitHub Direct] 同期完了: 総語彙数[${this.allWords.length}] (Q.E.D.)`);
    } catch (e) {
      console.error("❌ GitHubからの吸引中に通信断線を感知:", e);
    }
  }

  getGlyph(key: string): string | undefined { return this.encodeMap.get(key); }
  getCategoryByGlyph(glyph: string): string | undefined { return this.glyphToCategoryMap.get(glyph); }
  getMacroEntries(): MacroEntry[] { return this.macroEntries; }
  getEntriesByCategory(cat: string): DictEntry[] { return this.categoryEntries.get(cat) || []; }
}

export const dictLoader = new DictLoader();
