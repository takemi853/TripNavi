'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // useSearchParamsを使用

export default function SelectedSpots() {
    const [selectedSpots, setSelectedSpots] = useState<any[]>([]);
    const searchParams = useSearchParams(); // クエリパラメータの取得

    useEffect(() => {
        const spots = searchParams.get('spots');
        if (spots) {
            setSelectedSpots(JSON.parse(spots)); // クエリパラメータから取得した文字列をパース
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-green-200 to-blue-300">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-center mb-4">選択された観光地</h1>
                {selectedSpots.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {selectedSpots.map((spot, index) => (
                            <div key={index} className="bg-gray-100 p-4 rounded-md shadow-md">
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
                        ))}
                    </div>
                ) : (
                    <p className="text-center mt-4">選択された観光地がありません</p>
                )}
            </div>
        </div>
    );
}
