// main.js

// 從拆分好的模組中引入需要的工具
import { fetchRecommendations } from './api.js';
import { renderFeed, setupUIEvents } from './ui.js';

// 等待 HTML 載入完成後再執行
document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. 註冊 PWA Service Worker
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('sw.js');
        } catch (err) {
            console.log('SW 註冊失敗 (可能是尚未建立 sw.js 檔案)', err);
        }
    }

    // 2. 啟動畫面互動事件 (按鈕監聽)
    setupUIEvents();

    // 3. 從 API 獲取資料
    const recommendations = await fetchRecommendations();
    
    // 4. 將獲取到的資料交給 UI 模組進行渲染
    if (recommendations && recommendations.length > 0) {
        renderFeed(recommendations);
    } else {
        document.getElementById('feed-container').innerHTML = '<p class="text-slate-500 text-sm">目前沒有推薦資料</p>';
    }
});
