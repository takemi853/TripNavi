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
        const prompt = `以下の観光地を回る最適なルートを提案してください: ${locations.join(', ')}`;

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
        return NextResponse.json({ success: true, route }, { status: 200 });
    } catch (error) {
        console.error('Error fetching route:', error);
        return NextResponse.json({ success: false, message: 'ルートの取得に失敗しました' }, { status: 500 });
    }
}
