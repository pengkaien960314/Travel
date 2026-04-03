/**
 * ========================================================
 * 檔案名稱: ui.js
 * 專案名稱: 光旅 Lumina Voyage
 * 功能描述: 畫面渲染與互動層 (View)，負責操作 DOM、渲染卡片與綁定事件
 * 開發者: [你的名字/學號]
 * 更新日期: 2026-04-03
 * ========================================================
 */

// === 1. 動態渲染推薦卡片 ===
export function renderFeed(items) {
    const container = document.getElementById('feed-container');
    
    if (!container) return; 
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

        // 注意：這裡的卡片加入了 dark: 對應的 class，讓卡片完美支援深色模式
        const cardHTML = `
            <div class="travel-card bg-white dark:bg-slate-800 rounded-3xl overflow-hidden relative cursor-pointer border border-slate-100 dark:border-slate-700 shadow-sm transition-colors duration-300" onclick="alert('進入 ${item.title} 詳情頁')">
                <div class="relative h-40">
                    <img src="${item.imageUrl}" class="w-full h-full object-cover" loading="lazy" alt="${item.title}">
                    <div class="absolute top-3 right-3 ${tagColor} text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm font-medium">
                        ${item.tags[0]}
                    </div>
                </div>
                <div class="p-4 pt-3">
                    <span class="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md font-medium tracking-wide transition-colors">
                        <i class="fa-solid fa-location-dot mr-1"></i>${item.location}
                    </span>
                    <h3 class="font-bold text-slate-800 dark:text-white mt-2 text-sm leading-tight transition-colors">${item.title}</h3>
                    <div class="flex justify-between items-center mt-2">
                        <span class="text-[11px] text-slate-400 dark:text-slate-500 font-medium">${item.duration}</span>
                        <span class="text-xs text-teal-700 dark:text-teal-400 font-bold">${item.price}</span>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// === 2. 深色模式開關邏輯 ===
export function setupThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement; // 抓取 <html> 標籤

    // 檢查 localStorage 是否有儲存過使用者的偏好，有的話就套用
    if (localStorage.getItem('theme') === 'dark') {
        htmlElement.classList.add('dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 避免點擊開關時觸發關閉 popup 的事件
            
            // 切換 dark class
            htmlElement.classList.toggle('dark');
            
            // 記憶使用者的選擇
            if (htmlElement.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }
}

// === 3. Google 風格頭像彈出選單 ===
export function setupProfilePopup() {
    const avatarBtn = document.getElementById('avatar-btn');
    const profilePopup = document.getElementById('profile-popup');

    if (avatarBtn && profilePopup) {
        // 點擊頭像開關視窗
        avatarBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 防止點擊事件冒泡
            profilePopup.classList.toggle('hidden');
        });

        // 點擊視窗外部時，自動關閉視窗 (高級 UX 體驗)
        document.addEventListener('click', (e) => {
            if (!profilePopup.contains(e.target) && !avatarBtn.contains(e.target)) {
                profilePopup.classList.add('hidden');
            }
        });
    }
}

// === 4. 一般 UI 互動事件 ===
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
