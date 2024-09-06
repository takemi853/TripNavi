import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression, LatLngBounds } from 'leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

// カスタムアイコンの設定
const customIcon = new L.Icon({
    iconUrl: '/marker-icon-red.png', // public フォルダのアイコンを参照
    iconRetinaUrl: '/marker-icon-2x-red.png',
    shadowUrl: '/marker-shadow.png',
    iconSize: [25, 41], // デフォルトのサイズ
    iconAnchor: [12, 41], // アンカー位置（アイコンの底を地図上のマーカー位置に合わせる）
    popupAnchor: [1, -34],
    shadowSize: [41, 41], // 影のサイズ
});

interface Spot {
    name: string;
    latitude?: number;
    longitude?: number;
}

interface MapComponentProps {
    spots: Spot[];
}

// 地図の表示範囲を更新するためのコンポーネント
const MapBoundsUpdater: React.FC<{ spots: Spot[] }> = ({ spots }) => {
    const map = useMap();

    useEffect(() => {
        if (spots.length > 0) {
            // 緯度・経度があるスポットのリストを取得
            const bounds = new LatLngBounds(
                spots
                    .filter(spot => spot.latitude !== undefined && spot.longitude !== undefined)
                    .map(spot => [spot.latitude!, spot.longitude!] as LatLngExpression)
            );
            // 地図の表示範囲を全てのスポットが含まれるように設定
            map.fitBounds(bounds);
        }
    }, [spots, map]);

    return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ spots }) => {
    const validSpots = spots.filter(spot => spot.latitude !== undefined && spot.longitude !== undefined);
    const initialPosition: LatLngExpression = validSpots.length > 0
        ? [validSpots[0].latitude as number, validSpots[0].longitude as number]
        : [35.6895, 139.6917]; // デフォルトは東京の位置

    return (
        <MapContainer center={initialPosition} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {validSpots.map((spot, index) => (
                <Marker
                    key={index}
                    position={[spot.latitude!, spot.longitude!] as LatLngExpression}
                    icon={customIcon} // カスタムアイコンを使用
                >
                    <Popup>{spot.name}</Popup>
                </Marker>
            ))}
            {/* 地図の範囲を自動調整するコンポーネント */}
            <MapBoundsUpdater spots={validSpots} />
        </MapContainer>
    );
};

export default MapComponent;
