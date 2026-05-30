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

// 🪐 GitHubの大元データを直接ロックオン
const GITHUB_BASE = "https://raw.githubusercontent.com/pandorapanchan34-oss/3D-pocketbell/main/public/dict";

class DictLoader {
  public encodeMap = new Map<string, string>();
  public glyphToEntryMap = new Map<string, DictEntry>();
  public coreKeys: string[] = [];
  public variantKeys: string[] = [];
  public macroEntries: MacroEntry[] = [];

  async load(): Promise<void> {
    console.log("🛰️ [GitHub Direct] クラウド・リポジトリから多次元データ層を直接吸引中...");

    try {
      // お兄ちゃんのGitHubから直接パラレルフェッチ！
      const [resMacro, resCore, resVariants, resDynamic, resVectors] = await Promise.all([
        fetch(`${GITHUB_BASE}/macro.json`).then(r => r.json()).catch(() => ({ entries: [] })),
        fetch(`${GITHUB_BASE}/static_core.json`).then(r => r.json()).catch(() => ({ entries: [] })),
        fetch(`${GITHUB_BASE}/static_variants.json`).then(r => r.json()).catch(() => ({ entries: [] })),
        fetch(`${GITHUB_BASE}/dynamic.json').then(r => r.json()).catch(() => ({ entries: [] })),
        fetch(`${GITHUB_BASE}/vectors.json`).then(r => r.json()).catch(() => ({ entries: [] }))
      ]);

      if (resMacro?.entries) this.macroEntries = resMacro.entries;

      const register = (res: { entries: DictEntry[] }, isCore = false) => {
        if (!res?.entries) return;
        res.entries.forEach(entry => {
          if (!entry || !entry.glyph) return;
          this.glyphToEntryMap.set(entry.glyph, entry);

          const vList: string[] = Array.isArray(entry.variants) 
            ? [...entry.variants] 
            : (entry.variants ? [entry.variants] : []);
          
          const mainWord = entry.main || entry.mean;
          if (mainWord && !vList.includes(mainWord)) vList.push(mainWord);

          vList.forEach(v => {
            if (!v) return;
            this.encodeMap.set(v, entry.glyph);
            if (isCore) {
              this.coreKeys.push(v);
            } else {
              this.variantKeys.push(v);
            }
          });
        });
      };

      register(resCore, true);      // 特権原子防衛殻
      register(resVariants, false);  // 複合分子層
      register(resDynamic, false);   // 動的変調層
      register(resVectors, false);   // 独立ベクトル大群

      this.coreKeys = [...new Set(this.coreKeys)].sort((a, b) => b.length - a.length);
      this.variantKeys = [...new Set(this.variantKeys)].sort((a, b) => b.length - a.length);

      console.log(`🚀 [GitHub Direct] クラウド大宇宙と完全同期: 原子[${this.coreKeys.length}] / 分子[${this.variantKeys.length}] (Q.E.D.)`);
    } catch (e) {
      console.error("❌ GitHubからの吸引中に通信断線を感知:", e);
    }
  }

  getGlyph(key: string): string | undefined { return this.encodeMap.get(key); }
  getMacroEntries(): MacroEntry[] { return this.macroEntries; }
}

export const dictLoader = new DictLoader();
