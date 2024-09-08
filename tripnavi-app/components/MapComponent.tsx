'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression, LatLngBounds, Icon } from 'leaflet';
import { useEffect, useState } from 'react';

// 動的に Leaflet をインポートしてアイコンを設定
const dynamicImportLeaflet = async (): Promise<Icon> => {
    const L = await import('leaflet');
    return new L.Icon({
        iconUrl: '/marker-icon-red.png',
        iconRetinaUrl: '/marker-icon-2x-red.png',
        shadowUrl: '/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });
};

interface Spot {
    name: string;
    latitude?: number;
    longitude?: number;
}

interface MapComponentProps {
    spots: Spot[];
}

// 地図の表示範囲を更新するコンポーネント
const MapBoundsUpdater: React.FC<{ spots: Spot[] }> = ({ spots }) => {
    const map = useMap();

    useEffect(() => {
        const validSpots = spots.filter(spot => spot.latitude !== undefined && spot.longitude !== undefined);
        if (validSpots.length > 0) {
            const bounds = validSpots.reduce((bounds, spot) => {
                return bounds.extend([spot.latitude!, spot.longitude!] as LatLngExpression);
            }, new LatLngBounds([]));
            map.fitBounds(bounds);
        }
    }, [spots, map]);

    return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ spots }) => {
    const [customIcon, setCustomIcon] = useState<Icon | null>(null); // LeafletのIcon型を指定

    useEffect(() => {
        // クライアントサイドでのみ Leaflet のアイコンをインポート
        dynamicImportLeaflet().then(setCustomIcon);
    }, []);

    // 緯度・経度が正しく設定されているスポットのみを有効スポットとして扱う
    const validSpots = spots.filter(
        spot => spot.latitude !== undefined && spot.longitude !== undefined && spot.latitude !== null && spot.longitude !== null
    );

    // 初期位置の設定: 有効なスポットが存在しない場合のためにデフォルト位置を設定
    const initialPosition: LatLngExpression = validSpots.length > 0
        ? [validSpots[0].latitude!, validSpots[0].longitude!] // 型安全にするため、事前にチェック
        : [35.6895, 139.6917]; // デフォルト位置: 東京

    return (
        customIcon ? (
            <MapContainer center={initialPosition} zoom={13} style={{ height: '400px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {validSpots.map((spot, index) => (
                    <Marker
                        key={index}
                        position={[spot.latitude!, spot.longitude!] as LatLngExpression}
                        icon={customIcon}
                    >
                        <Popup>{spot.name}</Popup>
                    </Marker>
                ))}
                {/* 地図の範囲を自動的に更新するコンポーネント */}
                <MapBoundsUpdater spots={validSpots} />
            </MapContainer>
        ) : (
            <p>Loading map...</p> // アイコンがロードされるまでの代替コンテンツ
        )
    );
};

export default MapComponent;
