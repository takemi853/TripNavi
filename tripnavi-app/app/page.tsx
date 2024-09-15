"use client";
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { MapPin, Navigation, Search, Plane, Loader2, CheckCircle } from 'lucide-react'

import { getCoordinates } from '../helpers/getCoordinates';  // ヘルパーファイルをインポート
import { v4 as uuidv4 } from 'uuid';


// スポットの型定義
type Spot = {
    id: string;
    name: string;
    description: string;
    latitude?: number | null;
    longitude?: number | null;
  }
  
  // ルートの型定義
  type Route = {
    id: string;
    start: string;
    end: string;
    duration: string;
    distance: string;
  }

export default function TripNavi() {
  const [routeStart, setRouteStart] = useState('')
  const [routeEnd, setRouteEnd] = useState('')
  const [spotLocation, setSpotLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [spotResults, setSpotResults] = useState<Spot[]>([])
  const [routeResults, setRouteResults] = useState<Route[]>([])
  const [selectedSpots, setSelectedSpots] = useState<Spot[]>([])

  const handleRouteSearch = async () => {
    setLoading(true)
    // ここで実際のAPI呼び出しを行います
    // この例では、ダミーデータを使用しています
    await new Promise(resolve => setTimeout(resolve, 1000)) // APIリクエストをシミュレート
    const dummyResults: Route[] = [
      { id: '1', start: routeStart, end: routeEnd, duration: '2時間30分', distance: '250km' },
      { id: '2', start: routeStart, end: routeEnd, duration: '3時間', distance: '280km' },
    ]
    setRouteResults(dummyResults)
    setLoading(false)
  }

  const handleSpotSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true)
    // console.log('Sending request to /api/get-tourist-spots with location:', spotLocation);
    try {
        const response = await fetch('/api/get-tourist-spots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location: spotLocation }),
        });

        const data = await response.json();
        if (data.success) {
            const spots = JSON.parse(data.data);
            // console.log("Fetched tourist spots:", spots); // 取得した観光地のリストをログに出力

            // 各観光地の緯度・経度を取得し、リストに追加
        //     const spotsWithCoordinates = await Promise.all(spots.map(async (spot: Spot) => {
        //       const coordinates = await getCoordinates(spot.name);
              
        //       // 緯度・経度が取得できない場合はnullを設定
        //       const updatedSpot: Spot = {
        //           ...spot,
        //           id: spot.id || uuidv4(),
        //           latitude: coordinates ? coordinates.latitude : null,
        //           longitude: coordinates ? coordinates.longitude : null,
        //       };
          
        //       console.log(`Updated spot with coordinates:`, updatedSpot); // 更新後の観光地情報をログに出力
        //       return updatedSpot;
        //   }));
          const spotsWithCoordinates = await Promise.all(spots.map(async (spot: Spot) => {
            const coordinates = await getCoordinates(spot.name);
        
            const updatedSpot: Spot = {
                ...spot,
                id: uuidv4(), // 常に新しいUUIDを割り当てる
                latitude: coordinates ? coordinates.latitude : null,
                longitude: coordinates ? coordinates.longitude : null,
            };
        
            console.log(`Updated spot with ID: ${updatedSpot.id} and coordinates:`, updatedSpot); // IDを含めてログ出力
            console.log(`Spot ID: ${updatedSpot.id}, Name: ${updatedSpot.name}`);
            console.log('Selected spots after update:', selectedSpots);

            return updatedSpot;
        }));
            
            setSpotResults(spotsWithCoordinates);
            localStorage.setItem('touristSpots', JSON.stringify(spotsWithCoordinates)); // 緯度・経度付きの観光地リストを保存
        } else {
            console.warn("No tourist spots found");
            setSpotResults([]);
        }
    } catch (error) {
        console.error("Error fetching tourist spots:", error);
        setSpotResults([]);
    } finally {
        setLoading(false);
    }
  }

 // スポット選択のハンドラー
 const handleSpotSelection = (spot: Spot) => {
    setSelectedSpots((prevSelectedSpots) => {
        const isAlreadySelected = prevSelectedSpots.some((s) => s.id === spot.id);
        console.log('Spot clicked:', spot.name, 'Currently selected:', isAlreadySelected);

        if (isAlreadySelected) {
            console.log('Removing spot:', spot.name);
            return prevSelectedSpots.filter((s) => s.id !== spot.id);
        } else {
            console.log('Adding spot:', spot.name);
            return [...prevSelectedSpots, spot];
        }
    });
};

  const handleComplete = () => {
    console.log('Selected spots:', selectedSpots)
    // ここで選択されたスポットを使って次の処理を行います（例：ルート探索ページへの遷移）
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto p-4">
        <header className="text-center py-8 mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center">
            <Plane className="mr-2 h-8 w-8" />
            TripNavi
          </h1>
          <p className="text-blue-100">あなたの旅をナビゲート</p>
        </header>
        <Tabs defaultValue="route" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="route" className="text-lg py-3 min-h-[45px]">
              <Navigation className="mr-2 h-5 w-5" />
              ルート検索
            </TabsTrigger>
            <TabsTrigger value="spot" className="text-lg py-3 min-h-[45px]">
              <MapPin className="mr-2 h-5 w-5" />
              スポット検索
            </TabsTrigger>
          </TabsList>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TabsContent value="route">
              <Card className="shadow-lg">
                <CardHeader className="bg-blue-50">
                  <CardTitle className="text-2xl text-blue-700">ルート検索</CardTitle>
                  <CardDescription>出発地と目的地を入力してください。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="start" className="text-blue-600">出発地</Label>
                    <Input id="start" placeholder="例: 東京駅" value={routeStart} onChange={(e) => setRouteStart(e.target.value)} className="border-blue-200 focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end" className="text-blue-600">目的地</Label>
                    <Input id="end" placeholder="例: 大阪城" value={routeEnd} onChange={(e) => setRouteEnd(e.target.value)} className="border-blue-200 focus:border-blue-500" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleRouteSearch} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Search className="mr-2 h-5 w-5" />
                    ルートを検索
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="spot">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-lg mb-8">
                <CardHeader className="bg-purple-50">
                  <CardTitle className="text-2xl text-purple-700">スポット検索</CardTitle>
                  <CardDescription>検索したい場所を入力してください。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-purple-600">場所</Label>
                    <Input id="location" placeholder="例: 京都" value={spotLocation} onChange={(e) => setSpotLocation(e.target.value)} className="border-purple-200 focus:border-purple-500" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSpotSearch} className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Search className="mr-2 h-5 w-5" />}
                    {loading ? '検索中...' : 'スポットを検索'}
                  </Button>
                </CardFooter>
              </Card>
              {spotResults.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold mb-4 text-purple-700">検索結果</h3>
                  {spotResults.map((spot) => (
                    <Card 
                        key={spot.id} 
                        className={`shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
                            selectedSpots.some(s => s.id === spot.id) ? 'border-purple-600' : ''
                        }`}
                        onClick={() => handleSpotSelection(spot)}
                    >
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // カード全体のクリックイベントを防ぐ
                                        handleSpotSelection(spot);
                                    }}
                                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                        selectedSpots.some(s => s.id === spot.id)
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-200 text-gray-400 hover:bg-purple-100'
                                    }`}
                                >
                                    <CheckCircle className="w-5 h-5" />
                                </button>
                                <CardTitle className="text-lg font-semibold">{spot.name}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">{spot.description}</p>
                        </CardContent>
                    </Card>
                
                  ))}
                  <div className="mt-6 space-y-4">
                    <Button onClick={handleComplete} className="w-full bg-green-600 hover:bg-green-700">
                      選択したスポットで計画を立てる
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </div>
  )
}