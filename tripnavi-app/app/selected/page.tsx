'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation'; // useRouterを使用して戻る機能を追加

export default function SelectedSpots() {
    const [selectedSpots, setSelectedSpots] = useState<any[]>([]);
    const searchParams = useSearchParams(); // クエリパラメータの取得
    const router = useRouter(); // useRouterを使用して戻る機能を実装

    useEffect(() => {
        const spots = searchParams.get('spots');
        if (spots) {
            setSelectedSpots(JSON.parse(spots)); // クエリパラメータから取得した文字列をパース
        }
    }, [searchParams]);

    const handleBack = () => {
        router.back(); // 前のページに戻る
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-green-200 to-blue-300">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-center mb-6">選択された観光地</h1>
                {selectedSpots.length > 0 ? (
                    <div className="space-y-6">
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
                ) : (
                    <p className="text-center mt-6">選択された観光地がありません</p>
                )}

                {/* 戻るボタンを追加 */}
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
