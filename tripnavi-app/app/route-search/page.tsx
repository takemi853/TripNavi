'use client';

import { useState } from 'react';

const RouteSearch = () => {
    const [locations, setLocations] = useState<string[]>(['']);
    const [loading, setLoading] = useState(false);
    const [routeResult, setRouteResult] = useState<any | null>(null);

    const addLocation = () => {
        setLocations([...locations, '']);
    };

    const removeLocation = (index: number) => {
        const newLocations = [...locations];
        newLocations.splice(index, 1);
        setLocations(newLocations);
    };

    const updateLocation = (index: number, value: string) => {
        const newLocations = [...locations];
        newLocations[index] = value;
        setLocations(newLocations);
    };

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
            console.log('APIからのレスポンス:', data);  // APIレスポンスを確認
            if (data.success) {
                const parsedRoute = JSON.parse(data.route);
                setRouteResult(parsedRoute);
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
                    routeResult && routeResult.route && Array.isArray(routeResult.route) && routeResult.route.length > 0 ? (
                        <div className="mt-6 bg-gray-100 p-4 rounded-md shadow">
                            <h3 className="text-lg font-semibold">提案されたルート:</h3>
                            {routeResult.route.map((stop: any, index: number) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                                    <h4 className="font-semibold text-blue-600">{index + 1}. {stop.destination}</h4>
                                    <p>交通手段: {stop.transport}</p>
                                    <p>距離: {stop.distance}</p>
                                    <p>所要時間: {stop.time_required}</p>
                                    <p>滞在時間: {stop.stay_duration} </p>
                                </div>
                            ))}
                            <div>
                                <p className="font-bold">到着地点: {routeResult.end}</p>
                            </div>
                            <div className="mt-4">
                                <p className="font-bold">全体の移動距離: {routeResult.total_distance}</p>
                                <p className="font-bold">全体の移動時間: {routeResult.total_time}</p>
                            </div>
                        </div>
                    ) : (
                        routeResult && <p className="text-center mt-4">ルートが見つかりませんでした。</p>
                    )
                )}
            </div>
        </div>
    );
};

export default RouteSearch;
