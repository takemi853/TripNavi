import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
    const { locations } = await request.json();

    if (!locations || locations.length === 0) {
        return NextResponse.json({ success: false, message: '場所を入力してください' }, { status: 400 });
    }

    try {
        const apiKey = process.env.OPENAI_API_KEY;
        
        // ChatGPT APIを呼び出すためのプロンプト
        // const prompt = `以下の観光地を回る最適なルートを提案してください: ${locations.join(', ')}`;
        const prompt = `次の観光地を回る最適なルートを提案してください: ${locations.join(', ')}。各観光地の位置情報（緯度・経度）、交通手段、距離・所要時間、滞在時間を考慮して、最適なルートをJSON形式で返してください。以下の形式で出力してください。

        {
          "start": "出発地点名",
          "route": [
            {
              "destination": "観光地名",
              "transport": "交通手段（車、電車、バス、徒歩など）",
              "distance": "次の目的地までの距離（km）",
              "time_required": "次の目的地までの所要時間（分）",
              "stay_duration": "この場所での滞在時間（分）"
            }
            // その他の観光地の情報も同様に追加
          ],
          "end": "到着地点名",
          "total_distance": "全体の移動距離（km）",
          "total_time": "全体の移動時間（分）"
        }`;
        
        interface ChatGPTResponse {
            choices: Array<{
                message: {
                    content: string;
                };
            }>;
        }

        const response = await axios.post<ChatGPTResponse>(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        const route = response.data.choices[0].message.content;
        console.log('Fetched route:', route);
        return NextResponse.json({ success: true, route }, { status: 200 });
    } catch (error) {
        console.error('Error fetching route:', error);
        return NextResponse.json({ success: false, message: 'ルートの取得に失敗しました' }, { status: 500 });
    }
}
