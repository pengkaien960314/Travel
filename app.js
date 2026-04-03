document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 註冊 Service Worker (PWA 必備)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(err => console.log('SW 註冊失敗', err));
    }

    // 2. 模擬語音搜尋功能
    const voiceBtn = document.getElementById('voice-btn');
    const searchBar = document.getElementById('search-bar');

    voiceBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 防止觸發外層 searchBar 的點擊事件
        alert('🎤 [模擬語音輸入] 正在聆聽您的目的地需求...');
    });

    searchBar.addEventListener('click', () => {
        alert('🔍 [開啟搜尋模組] 這裡可以展開全螢幕的搜尋與 AI 對話框');
    });

    // 3. 非同步讀取 JSON 資料並渲染 UI (展現資管系處理 API 的能力)
    fetch('data.json')
        .then(response => response.json())
        .then(data => renderFeed(data.recommendations))
        .catch(error => console.error('無法載入資料:', error));

});

// 渲染推薦卡片的函數
function renderFeed(items) {
    const container = document.getElementById('feed-container');
    container.innerHTML = ''; // 清空載入中狀態

    // 只取前兩個展示 (配合原本 UI 設計)
    const displayItems = items.slice(0, 2);

    displayItems.forEach(item => {
        // 設定標籤顏色對應 (Tailwind class)
        const badgeColors = {
            emerald: 'bg-emerald-500',
            purple: 'bg-purple-500',
            rose: 'bg-rose-500',
            amber: 'bg-amber-500'
        };
        const tagColor = badgeColors[item.themeColor] || 'bg-teal-500';

        // 建立卡片 HTML
        const cardHTML = `
            <div class="travel-card bg-white rounded-3xl overflow-hidden relative cursor-pointer border border-slate-100 shadow-sm" onclick="alert('進入 ${item.title} 詳情頁')">
                <div class="relative h-40">
                    <img src="${item.imageUrl}" class="w-full h-full object-cover" loading="lazy" alt="${item.title}">
                    <div class="absolute top-3 right-3 ${tagColor} text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm font-medium">
                        ${item.tags[0]}
                    </div>
                </div>
                <div class="p-4 pt-3">
                    <span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium tracking-wide">
                        <i class="fa-solid fa-location-dot mr-1"></i>${item.location}
                    </span>
                    <h3 class="font-bold text-slate-800 mt-2 text-sm leading-tight">${item.title}</h3>
                    <div class="flex justify-between items-center mt-2">
                        <span class="text-[11px] text-slate-400 font-medium">${item.duration}</span>
                        <span class="text-xs text-teal-700 font-bold">${item.price}</span>
                    </div>
                </div>
                
                <button class="absolute top-3 left-3 bg-black/30 backdrop-blur-md text-white px-2 py-1 text-[10px] rounded-full flex items-center hover:bg-black/50 transition border border-white/20" onclick="event.stopPropagation(); alert('啟動 ${item.location} AR 預覽模式')">
                    <i class="fa-solid fa-vr-cardboard mr-1"></i> AR 預覽
                </button>
            </div>
        `;
        
        // 將卡片加入 DOM 中
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}
