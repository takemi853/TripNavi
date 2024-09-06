import axios from 'axios';

// Nominatim API を使用して観光地の名前から緯度・経度を取得
export async function getCoordinates(placeName: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}`;
    try {
        console.log(`Fetching coordinates for: ${placeName}`); // デバッグ用ログ
        const response = await axios.get(url);
        const data = response.data;

        console.log(`API response for ${placeName}:`, data); // APIからのレスポンスをログに出力

        if (data && data.length > 0) {
            const { lat, lon } = data[0];
            console.log(`Coordinates for ${placeName}: Latitude = ${lat}, Longitude = ${lon}`); // 取得した緯度・経度をログ出力
            return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
        } else {
            console.warn(`No coordinates found for ${placeName}`); // 見つからなかった場合の警告
            return null;
        }
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}
