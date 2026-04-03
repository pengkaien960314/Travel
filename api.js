// api.js

/**
 * 負責從伺服器或本地 JSON 獲取推薦行程資料
 * 使用 export 將這個函式開放給其他檔案使用
 */
export async function fetchRecommendations() {
    try {
        const response = await fetch('data.json');
        
        if (!response.ok) {
            throw new Error(`HTTP 錯誤！狀態碼：${response.status}`);
        }
        
        const data = await response.json();
        return data.recommendations;
        
    } catch (error) {
        console.error('API 請求失敗:', error);
        return []; // 發生錯誤時回傳空陣列，避免整個系統崩潰
    }
}
