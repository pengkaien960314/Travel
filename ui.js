// ui.js

// 渲染推薦卡片的函式
export function renderFeed(items) {
    const container = document.getElementById('feed-container');
    
    if (!container) return; // 錯誤防範
    container.innerHTML = ''; 

    // 只取前兩個展示
    const displayItems = items.slice(0, 2);

    displayItems.forEach(item => {
        const badgeColors = {
            emerald: 'bg-emerald-500',
            purple: 'bg-purple-500',
            rose: 'bg-rose-500',
            amber: 'bg-amber-500'
        };
        const tagColor = badgeColors[item.themeColor] || 'bg-teal-500';

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
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// 綁定 UI 互動事件的函式
export function setupUIEvents() {
    const voiceBtn = document.getElementById('voice-btn');
    const searchBar = document.getElementById('search-bar');

    if (voiceBtn) {
        voiceBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            alert('🎤 [模擬語音輸入] 正在聆聽您的目的地需求...');
        });
    }

    if (searchBar) {
        searchBar.addEventListener('click', () => {
            alert('🔍 [開啟搜尋模組] 這裡可以展開全螢幕的搜尋對話框');
        });
    }
}
