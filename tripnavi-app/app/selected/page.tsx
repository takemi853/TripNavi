'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SelectedSpots() {
    const [selectedSpots, setSelectedSpots] = useState<any[]>([]); // 選択された観光地リスト
    const router = useRouter();

    // ページロード時に localStorage から選択された観光地を復元
    useEffect(() => {
        const savedSelectedSpots = localStorage.getItem('selectedSpots');
        if (savedSelectedSpots) {
            setSelectedSpots(JSON.parse(savedSelectedSpots)); // 選択リストを復元
        }

        // ログを削除して、次回表示時に過去のデータが残らないようにする
        return () => {
            localStorage.removeItem('selectedSpots'); // 選択された観光地のログを削除
        };
    }, []);

    const handleBack = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-green-200 to-blue-300">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-center mb-6">選択された観光地</h1>
                {selectedSpots && selectedSpots.length > 0 ? (
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
