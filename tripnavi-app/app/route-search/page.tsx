'use client';

import { useState } from 'react';

const RouteSearch = () => {
    const [locations, setLocations] = useState<string[]>(['']);
    const [loading, setLoading] = useState(false);
    const [routeResult, setRouteResult] = useState<string | null>(null);

    // 観光場所を追加
    const addLocation = () => {
        setLocations([...locations, '']);
    };

    // 観光場所を削除
    const removeLocation = (index: number) => {
        const newLocations = [...locations];
        newLocations.splice(index, 1);
        setLocations(newLocations);
    };

    // 各観光場所の入力値を更新
    const updateLocation = (index: number, value: string) => {
        const newLocations = [...locations];
        newLocations[index] = value;
        setLocations(newLocations);
    };

    // フォームの送信時に ChatGPT API を呼び出してルートを取得
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/get-route', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ locations }),
            });

            const data = await response.json();
            if (data.success) {
                setRouteResult(data.route);
            } else {
                setRouteResult('ルートの取得に失敗しました。');
            }
        } catch (error) {
            console.error('Error fetching route:', error);
            setRouteResult('ルートの取得に失敗しました。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-green-200 to-blue-300">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-center mb-4">ルート検索</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {locations.map((location, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => updateLocation(index, e.target.value)}
                                placeholder={`場所 ${index + 1}`}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {locations.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeLocation(index)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    削除
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addLocation}
                        className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        場所を追加
                    </button>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {loading ? '検索中...' : 'ルート検索'}
                    </button>
                </form>

                {loading ? (
                    <p className="text-center mt-4">検索中...</p>
                ) : (
                    routeResult && (
                        <div className="mt-6 bg-gray-100 p-4 rounded-md shadow">
                            <h3 className="text-lg font-semibold">提案されたルート:</h3>
                            <p>{routeResult}</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default RouteSearch;
