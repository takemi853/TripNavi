"use client";
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { MapPin, Navigation, Search, Plane } from 'lucide-react'

export default function TripNavi() {
  const [routeStart, setRouteStart] = useState('')
  const [routeEnd, setRouteEnd] = useState('')
  const [spotLocation, setSpotLocation] = useState('')

  const handleRouteSearch = () => {
    console.log(`Searching route from ${routeStart} to ${routeEnd}`)
  }

  const handleSpotSearch = () => {
    console.log(`Searching spots near ${spotLocation}`)
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
            <TabsTrigger value="route" className="text-lg py-3">
              <Navigation className="mr-2 h-5 w-5" />
              ルート検索
            </TabsTrigger>
            <TabsTrigger value="spot" className="text-lg py-3">
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
                    <Input id="start" placeholder="例: 東京駅" value={routeStart} onChange={(e) => setRouteStart(e.target.value)} className="border-blue-200 focus:border-blue-500" />
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
              <Card className="shadow-lg">
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
                  <Button onClick={handleSpotSearch} className="w-full bg-purple-600 hover:bg-purple-700">
                    <Search className="mr-2 h-5 w-5" />
                    スポットを検索
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </div>
  )
}