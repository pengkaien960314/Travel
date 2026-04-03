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

// === 3.狀態管理：更新 UI 以符合登入/登出狀態 ===
function updateAuthStateUI() {
    const userJson = localStorage.getItem('currentUser');
    
    // 抓取 DOM 元素
    const loggedOutMenu = document.getElementById('logged-out-menu');
    const loggedInMenu = document.getElementById('logged-in-menu');
    const avatarImg = document.getElementById('avatar-img');
    const popupAvatar = document.getElementById('popup-avatar');
    const nameDisplay = document.getElementById('user-name-display');
    const emailDisplay = document.getElementById('user-email-display');

    if (userJson) {
        // [已登入狀態]
        const user = JSON.parse(userJson);
        loggedOutMenu.classList.add('hidden');
        loggedInMenu.classList.remove('hidden');
        
        // 替換頭像與資訊 (使用 Dicebear API 動態生成專屬頭像)
        const avatarUrl = `https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}&backgroundColor=0f766e`;
        avatarImg.src = avatarUrl;
        popupAvatar.src = avatarUrl;
        nameDisplay.textContent = user.name;
        emailDisplay.textContent = user.email;
    } else {
        // [未登入狀態]
        loggedOutMenu.classList.remove('hidden');
        loggedInMenu.classList.add('hidden');
        
        // 替換成匿名頭像
        avatarImg.src = 'https://api.dicebear.com/7.x/initials/svg?seed=User&backgroundColor=slate';
    }
}

// === 頭像彈出選單控制 ===
export function setupProfilePopup() {
    const avatarBtn = document.getElementById('avatar-btn');
    const profilePopup = document.getElementById('profile-popup');

    // 每次畫面載入時，先檢查一次登入狀態
    updateAuthStateUI();

    if (avatarBtn && profilePopup) {
        avatarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profilePopup.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!profilePopup.contains(e.target) && !avatarBtn.contains(e.target)) {
                profilePopup.classList.add('hidden');
            }
        });
    }
}

// === 登入/註冊 Modal 流程控制 (最核心的高端寫法) ===
export function setupAuthLogic() {
    const authModal = document.getElementById('auth-modal');
    const authModalContent = document.getElementById('auth-modal-content');
    const openLoginBtn = document.getElementById('open-login-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const profilePopup = document.getElementById('profile-popup');

    // 表單視窗切換
    const loginView = document.getElementById('login-form-view');
    const registerView = document.getElementById('register-form-view');
    const goToRegisterBtn = document.getElementById('go-to-register');
    const goToLoginBtn = document.getElementById('go-to-login');

    // 表單提交與登出按鈕
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');

    // 1. 打開 Modal
    function openModal() {
        authModal.classList.remove('hidden');
        // 加上一點延遲讓 Tailwind 的 opacity 動畫生效
        setTimeout(() => {
            authModal.classList.remove('opacity-0');
            authModalContent.classList.remove('scale-95');
        }, 10);
        profilePopup.classList.add('hidden'); // 關閉頭像選單
        
        // 預設顯示登入頁
        loginView.classList.remove('hidden');
        registerView.classList.add('hidden');
    }

    // 2. 關閉 Modal
    function closeModal() {
        authModal.classList.add('opacity-0');
        authModalContent.classList.add('scale-95');
        setTimeout(() => {
            authModal.classList.add('hidden');
        }, 300); // 等待動畫結束再隱藏
    }

    // 綁定開關事件
    if(openLoginBtn) openLoginBtn.addEventListener('click', openModal);
    if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    
    // 點擊 Modal 黑色半透明背景也能關閉
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) closeModal();
    });

    // 3. 視窗內部切換 (登入 <-> 註冊)
    goToRegisterBtn.addEventListener('click', () => {
        loginView.classList.add('hidden');
        registerView.classList.remove('hidden');
    });

    goToLoginBtn.addEventListener('click', () => {
        registerView.classList.add('hidden');
        loginView.classList.remove('hidden');
    });

    // 4. 處理「註冊」事件 (儲存資料到 localStorage)
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault(); // 阻止網頁重新整理
        
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;

        // 模擬註冊成功，把資料存進瀏覽器
        const userData = { name: name, email: email };
        localStorage.setItem('currentUser', JSON.stringify(userData));

        alert('🎉 註冊成功！歡迎加入光旅。');
        closeModal();
        updateAuthStateUI(); // 立刻更新右上角頭像
        registerForm.reset(); // 清空表單
    });

    // 5. 處理「登入」事件 (為了展示，輸入任意帳密都會當作剛註冊的人登入)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // 如果沒有註冊過，我們給一個預設帳號
        let userData = JSON.parse(localStorage.getItem('currentUser'));
        if (!userData) {
            userData = { name: 'VIP 會員', email: 'user@example.com' };
            localStorage.setItem('currentUser', JSON.stringify(userData));
        }

        alert('✅ 登入成功！');
        closeModal();
        updateAuthStateUI();
        loginForm.reset();
    });

    // 6. 處理「登出」事件
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // 清除瀏覽器記憶
            localStorage.removeItem('currentUser');
            alert('您已登出，期待下次見面！');
            updateAuthStateUI(); // 立刻變回未登入頭像
            profilePopup.classList.add('hidden');
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
