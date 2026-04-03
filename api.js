/**
 * ========================================================
 * 檔案名稱: api.js
 * 專案名稱: 光旅 Lumina Voyage
 * 功能描述: 負責處理資料獲取 (API / 模擬資料)
 
 * ========================================================
 */

export async function fetchRecommendations() {
    try {
        // 嘗試去抓取外部檔案，如果找不到就會跳到 catch 區塊
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('找不到 data.json');
        return await response.json();
        
    } catch (error) {
        console.log('找不到外部 JSON，改用內建備用資料');
        
        // 終極備用資料：就算沒有 data.json 檔案，也保證畫面一定有卡片！
        return [
            {
                "id": 1,
                "title": "海島秘境｜峇里島五天四夜",
                "location": "印尼, 峇里島",
                "imageUrl": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80",
                "price": "NT$ 25,900",
                "duration": "5天4夜",
                "themeColor": "emerald",
                "tags": ["熱帶海島", "度假"]
            },
            {
                "id": 2,
                "title": "古都巡禮｜京都賞楓輕旅行",
                "location": "日本, 京都",
                "imageUrl": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
                "price": "NT$ 32,500",
                "duration": "4天3夜",
                "themeColor": "rose",
                "tags": ["文化之旅", "秋季限定"]
            }
        ];
    }
}
