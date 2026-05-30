/**
 * SIGN-X v8.40 メイン・マウントゲート（ビルドエラー完全パージ版）
 * パス: src/main.tsx
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css' // 🛡️ スタイル層を完全結合！

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
