'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import qs from 'query-string';

// 動的に `MapComponent` をインポートし、SSR を無効化
const MapComponent = dynamic(() => import('../../components/MapComponent'), {
    ssr: false,  // サーバーサイドレンダリングを無効化
});

interface Spot {
    name: string;
    latitude?: number;
    longitude?: number;
    description: string;
    tags: string[];
}

export default function SelectedSpots() {
    const [selectedSpots, setSelectedSpots] = useState<Spot[]>([]);
    const router = useRouter();

    useEffect(() => {
        const savedSelectedSpots = localStorage.getItem('selectedSpots');
        if (savedSelectedSpots) {
            setSelectedSpots(JSON.parse(savedSelectedSpots));
        }
    }, []);

    const handleBack = () => {
        router.push('/');
    };

    // ルート検索ページに遷移する際に選択された観光地をパラメータとして渡す
    const handleRouteSearch = () => {
        const query = {
            spots: JSON.stringify(selectedSpots),
        };
        const url = qs.stringifyUrl({ url: '/route-search', query });
        router.push(url);
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-green-200 to-blue-300">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-center mb-6">選択された観光地</h1>

                {selectedSpots && selectedSpots.length > 0 ? (
                    <>
                        {/* 動的にロードされた地図コンポーネントをここで使用 */}
                        <MapComponent spots={selectedSpots} />
                        <div className="space-y-6 mt-6">
                            {selectedSpots.map((spot, index) => (
                                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
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
                            ))}
                        </div>
                        <button
                            onClick={handleRouteSearch}
                            className="mt-4 w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            ルート検索
                        </button>
                    </>
                ) : (
                    <p className="text-center mt-6">選択された観光地がありません</p>
                )}

                <button
                    onClick={handleBack}
                    className="mt-8 w-full py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    元に戻る
                </button>
            </div>
        </div>
    );
}
