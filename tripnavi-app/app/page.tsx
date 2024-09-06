'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // useRouterを使用

export default function Home() {
    const [location, setLocation] = useState('');
    const [result, setResult] = useState<any[]>([]); // 全観光地のリスト
    const [loading, setLoading] = useState(false);
    const [selectedSpots, setSelectedSpots] = useState<any[]>([]); // 選択された観光地
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
                setResult(spots);
                localStorage.setItem('touristSpots', JSON.stringify(spots)); // 観光地リストを保存
            } else {
                setResult([]);
            }
        } catch (error) {
            setResult([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCheck = (spot: any) => {
        if (selectedSpots.includes(spot)) {
            setSelectedSpots(selectedSpots.filter(s => s !== spot)); // すでに選択されていたら削除
        } else {
            setSelectedSpots([...selectedSpots, spot]); // 新たに選択
        }
    };

    const handleComplete = () => {
        // 選択リストを保存して `selected` ページに移動
        localStorage.setItem('selectedSpots', JSON.stringify(selectedSpots));
        router.push(`/selected`);
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
                ) : result && result.length > 0 ? (
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
                                        <div className="flex flex-wrap mt-4">
                                            {spot.tags.map((tag: string, tagIndex: number) => (
                                                <span
                                                    key={tagIndex}
                                                    className="text-xs font-medium bg-blue-100 text-blue-600 py-1 px-3 rounded-full mr-2 mb-2"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                        <button
                            onClick={handleComplete}
                            className="mt-6 w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            完了
                        </button>
                    </div>
                ) : (
                    <p className="text-center mt-6">結果がありません</p>
                )}
            </div>
        </div>
    );
}
