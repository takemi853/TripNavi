'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const RouteSearch = () => {
    const [locations, setLocations] = useState<string[]>(['']);
    const [loading, setLoading] = useState(false);
    const [routeResult, setRouteResult] = useState<any | null>(null);
    const searchParams = useSearchParams();  // URLパラメータを取得

    // 初期ロード時にURLから観光地を取得
    useEffect(() => {
        const spotsParam = searchParams.get('spots');
        if (spotsParam) {
            const parsedSpots = JSON.parse(spotsParam);
            const spotNames = parsedSpots.map((spot: { name: string }) => spot.name);
            setLocations(spotNames);  // 観光地の名前をlocationsにセット
        }
    }, [searchParams]);

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
                    <div className="flex justify-center items-center mt-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-solid"></div>
                        <p className="text-center ml-2">検索中...</p>
                    </div>
                ) : (
                    routeResult && routeResult.route && Array.isArray(routeResult.route) && routeResult.route.length > 0 ? (
                        <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">提案されたルート</h3>
                            {routeResult.route.map((stop: any, index: number) => (
                                <div key={index} className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-lg font-semibold text-blue-600">{index + 1}. {stop.destination}</h4>
                                        <span className="text-sm text-gray-500">滞在時間: {stop.stay_duration ? `${stop.stay_duration} 分` : '不明'}</span>
                                    </div>
                                    <p className="mt-2 text-gray-700">交通手段: <span className="font-medium">{stop.transport}</span></p>
                                    
                                    <p className="text-gray-700">
                                        距離: 
                                        <span className="font-medium">
                                            {stop.distance 
                                                ? (typeof stop.distance === 'number' || !isNaN(Number(stop.distance)) 
                                                    ? `${stop.distance} km`  // 数値または数値文字列の場合に "km" を付ける
                                                    : stop.distance)  // 既に単位が含まれている場合はそのまま表示
                                                : '不明'}
                                        </span>
                                    </p>

                                    <p className="text-gray-700">
                                        移動時間: 
                                        <span className="font-medium">
                                            {stop.time_required 
                                                ? (typeof stop.time_required === 'number' || !isNaN(Number(stop.time_required)) 
                                                    ? stop.time_required >= 60  // 60分以上なら「時間」、それ未満なら「分」
                                                        ? `${Math.floor(stop.time_required / 60)}時間 ${stop.time_required % 60 ? `${stop.time_required % 60}分` : ''}`
                                                        : `${stop.time_required} 分`
                                                    : stop.time_required)  // 既に単位が含まれている場合はそのまま表示
                                                : '不明'}
                                        </span>
                                    </p>

                                </div>
                            ))}
                            <div className="bg-blue-50 p-4 rounded-lg mt-6">
                                <p className="text-lg font-bold text-gray-800">到着地点: {routeResult.end}</p>
                            </div>
                            <div className="mt-4">
                                <p className="text-lg font-bold text-gray-800">
                                    全体の移動距離: <span className="text-blue-600">{routeResult.total_distance ? `${routeResult.total_distance} km` : '不明'}</span>
                                </p>
                                <p className="text-lg font-bold text-gray-800">
                                    全体の移動時間: 
                                    <span className="text-blue-600">
                                        {typeof routeResult.total_time === 'number' 
                                            ? routeResult.total_time >= 60 
                                                ? `${Math.floor(routeResult.total_time / 60)}時間${routeResult.total_time % 60 !== 0 ? ` ${routeResult.total_time % 60}分` : ''}`
                                                : `${routeResult.total_time} 分`
                                            : routeResult.total_time  // フォーマットされた文字列をそのまま表示
                                        }
                                    </span>
                                </p>
                            </div>
                        </div>

                    ) : (
                        routeResult && <p className="text-center mt-4 text-red-600">ルートが見つかりませんでした。</p>
                    )
                )}

            </div>
        </div>
    );
};

export default RouteSearch;


// 'use client';

// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';

// interface Spot {
//     name: string;
//     latitude?: number;
//     longitude?: number;
//     description: string;
//     tags: string[];
// }

// export default function RouteSearch() {
//     const [spots, setSpots] = useState<Spot[]>([]);
//     const [inputValue, setInputValue] = useState(''); // 入力フィールドの状態
//     const searchParams = useSearchParams();

//     useEffect(() => {
//         const spotsParam = searchParams.get('spots');
//         if (spotsParam) {
//             const spotsData = JSON.parse(spotsParam);
//             setSpots(spotsData);

//             // 観光地名を抽出して入力フィールドに設定
//             const spotNames = spotsData.map((spot: Spot) => spot.name).join(', ');
//             setInputValue(spotNames);
//         }
//     }, [searchParams]);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setInputValue(e.target.value);
//     };

//     return (
//         <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
//             <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
//                 <h1 className="text-3xl font-bold text-center mb-6">ルート検索</h1>

//                 {/* 入力フィールド */}
//                 <input
//                     type="text"
//                     value={inputValue}
//                     onChange={handleInputChange}
//                     className="w-full p-3 border border-gray-300 rounded-md mb-4"
//                     placeholder="観光地を入力してください"
//                 />

//                 {/* 観光地一覧の表示 */}
//                 {spots && spots.length > 0 ? (
//                     <div className="space-y-6">
//                         {spots.map((spot, index) => (
//                             <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
//                                 <h2 className="text-xl font-semibold text-gray-900">{spot.name}</h2>
//                                 <p className="text-gray-600 mt-2">{spot.description}</p>
//                                 <div className="flex flex-wrap mt-4">
//                                     {spot.tags.map((tag: string, tagIndex: number) => (
//                                         <span
//                                             key={tagIndex}
//                                             className="text-xs font-medium bg-blue-100 text-blue-600 py-1 px-3 rounded-full mr-2 mb-2"
//                                         >
//                                             {tag}
//                                         </span>
//                                     ))}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <p className="text-center mt-6">観光地情報が見つかりません</p>
//                 )}
//             </div>
//         </div>
//     );
// }
