'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCoordinates } from '../helpers/getCoordinates';  // ヘルパーファイルをインポート

// 観光地のデータ型を定義
interface TouristSpot {
    id: number;
    name: string;
    description: string;
    latitude?: number | null;
    longitude?: number | null;
  }

export default function Home() {
    const [location, setLocation] = useState('');
    const [result, setResult] = useState<TouristSpot[]>([]);  // 観光地のデータを格納
    const [loading, setLoading] = useState(false);
    const [selectedSpots, setSelectedSpots] = useState<TouristSpot[]>([]);  // 選択された観光地
    const router = useRouter();

    // 初期化時に localStorage から観光地リストと選択リストを復元
    useEffect(() => {
      const savedTouristSpots = localStorage.getItem('touristSpots');
      if (savedTouristSpots) {
          setResult(JSON.parse(savedTouristSpots));
      }
      // 戻ってきたときに選択リストをクリーンアップ
      localStorage.removeItem('selectedSpots');
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      setLoading(true);
  
      try {
          const response = await fetch('/api/get-tourist-spots', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ location }),
          });
  
          const data = await response.json();
          if (data.success) {
              const spots = JSON.parse(data.data);
              console.log("Fetched tourist spots:", spots); // 取得した観光地のリストをログに出力
  
              // 各観光地の緯度・経度を取得し、リストに追加
              const spotsWithCoordinates = await Promise.all(spots.map(async (spot: TouristSpot) => {
                const coordinates = await getCoordinates(spot.name);
                
                // 緯度・経度が取得できない場合はnullを設定
                const updatedSpot: TouristSpot = {
                    ...spot,
                    latitude: coordinates ? coordinates.latitude : null,
                    longitude: coordinates ? coordinates.longitude : null,
                };
            
                console.log(`Updated spot with coordinates:`, updatedSpot); // 更新後の観光地情報をログに出力
                return updatedSpot;
            }));
              
              setResult(spotsWithCoordinates);
              localStorage.setItem('touristSpots', JSON.stringify(spotsWithCoordinates)); // 緯度・経度付きの観光地リストを保存
          } else {
              console.warn("No tourist spots found");
              setResult([]);
          }
      } catch (error) {
          console.error("Error fetching tourist spots:", error);
          setResult([]);
      } finally {
          setLoading(false);
      }
  };

    const handleCheck = (spot: TouristSpot) => {
        if (selectedSpots.includes(spot)) {
            const updatedSpots = selectedSpots.filter(s => s !== spot);  // すでに選択されていたら削除
            setSelectedSpots(updatedSpots);
            localStorage.setItem('selectedSpots', JSON.stringify(updatedSpots));  // 選択リストを更新
        } else {
            const updatedSpots = [...selectedSpots, spot];  // 新たに選択
            setSelectedSpots(updatedSpots);
            localStorage.setItem('selectedSpots', JSON.stringify(updatedSpots));  // 選択リストを更新
        }
    };
    
    const handleComplete = () => {
        router.push(`/selected`);  // selected ページに遷移
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-green-200 to-blue-300">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-center mb-6">観光地検索アプリ</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                            場所または緯度・経度を入力してください:
                        </label>
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                            className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {loading ? '検索中...' : '検索'}
                        </button>
                    </div>
                </form>

                {loading ? (
                    <p className="text-center mt-6">検索中...</p>
                ) : result.length > 0 ? (
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">観光地リスト:</h3>
                        <div className="space-y-6">
                            {result.map((spot, index) => (
                                <label
                                    key={index}
                                    className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4 hover:shadow-lg transition-shadow cursor-pointer"
                                >
                                    <div className="custom-checkbox-wrapper">
                                        <input
                                            type="checkbox"
                                            checked={selectedSpots.includes(spot)}
                                            onChange={() => handleCheck(spot)}
                                            className="hidden"
                                        />
                                        <div
                                            className={`custom-checkbox ${
                                                selectedSpots.includes(spot) ? 'checked' : ''
                                            }`}
                                        ></div>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold text-gray-900">{spot.name}</h2>
                                        <p className="text-gray-600 mt-2">{spot.description}</p>
                                        {spot.latitude && spot.longitude ? (
                                            <p className="text-gray-500">緯度: {spot.latitude}, 経度: {spot.longitude}</p>
                                        ) : (
                                            <p className="text-red-500">緯度・経度が見つかりませんでした</p>
                                        )}
                                    </div>
                                </label>
                            ))}
                        </div>

                        {/* 観光地選択を完了して selected ページに移動するボタン */}
                        <button
                            className="mt-6 w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            onClick={handleComplete}
                        >
                            選択
                        </button>

                        {/* ルート探索ページに直接移動するボタン */}
                        <button
                            className="mt-4 w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => router.push(`/route-search`)}
                        >
                            ルート探索ページに移動
                        </button>
                    </div>
                ) : (
                    <p className="text-center mt-6">結果がありません</p>
                )}
            </div>
        </div>
    );
}
