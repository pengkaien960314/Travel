/**
 * ========================================================
 * 檔案名稱: main.js
 * 專案名稱: 光旅 Lumina Voyage
 * 功能描述: 系統主控中心：負責初始化 App、串接資料與畫面
 * 開發者: [彭楷恩/D1144242706]
 * 更新日期: 2026-04-03
 * ========================================================
 */

// 從拆分好的模組中引入需要的工具
import { fetchRecommendations } from './api.js';
import { renderFeed, setupUIEvents, setupThemeToggle, setupProfilePopup } from './ui.js';

// 確保 HTML DOM 完全載入後才開始執行 JS 邏輯
document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. 註冊 PWA Service Worker (若未來有 sw.js 可離線使用)
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('sw.js');
        } catch (err) {
            console.log('SW 註冊失敗 (目前可忽略，未來實作離線功能時使用)', err);
        }
    }

    // 2. 初始化 UI 與互動事件
    setupThemeToggle();   // 啟動深色模式功能
    setupProfilePopup();  // 啟動頭像彈出視窗功能
    setupAuthLogic();     // 啟用登入註冊系統
    setupUIEvents();      // 啟動搜尋列、語音按鈕等事件

    // 3. 從 API (或 data.json) 獲取資料
    const recommendations = await fetchRecommendations();
    
    // 4. 將獲取到的資料交給 UI 模組進行渲染
    if (recommendations && recommendations.length > 0) {
        renderFeed(recommendations);
    } else {
        // 如果沒有資料或是發生錯誤，顯示空狀態提示
        document.getElementById('feed-container').innerHTML = `
            <div class="col-span-2 text-center py-8">
                <p class="text-slate-500 dark:text-slate-400 text-sm">目前沒有推薦資料</p>
            </div>
        `;
    }
});
