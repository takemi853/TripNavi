'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const [location, setLocation] = useState('');
    const [result, setResult] = useState<any[]>([]); // 観光地のデータを格納する
    const [loading, setLoading] = useState(false);
    const [selectedSpots, setSelectedSpots] = useState<any[]>([]); // 選択された観光地を格納
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/get-tourist-spots', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ location }), // フォームに入力されたデータを送信
            });

            const data = await response.json();
            if (data.success) {
                setResult(JSON.parse(data.data)); // JSONデータをパースしてセット
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
        router.push({
            pathname: '/selected',
            query: { spots: JSON.stringify(selectedSpots) }, // 選択されたスポットを次のページに送信
        });
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-green-200 to-blue-300">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-center mb-4">観光地検索アプリ</h1>
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
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {loading ? '検索中...' : '検索'}
                        </button>
                    </div>
                </form>

                {loading ? (
                    <p className="text-center mt-4">検索中...</p>
                ) : result.length > 0 ? (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold">観光地リスト:</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {result.map((spot, index) => (
                                <div key={index} className="bg-gray-100 p-4 rounded-md shadow-md">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedSpots.includes(spot)}
                                            onChange={() => handleCheck(spot)}
                                            className="mr-2"
                                        />
                                        <div>
                                            <h2 className="text-xl font-semibold mb-2">{spot.name}</h2>
                                            <p className="text-gray-700 mb-4">{spot.description}</p>
                                            <div className="flex flex-wrap">
                                                {spot.tags.map((tag: string, tagIndex: number) => (
                                                    <span
                                                        key={tagIndex}
                                                        className="text-sm bg-blue-100 text-blue-800 py-1 px-3 rounded-full mr-2 mb-2"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleComplete}
                            className="mt-4 w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            完了
                        </button>
                    </div>
                ) : (
                    <p className="text-center mt-4">結果がありません</p>
                )}
            </div>
        </div>
    );
}
