import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
    const { location } = await request.json();

    if (!location) {
        return NextResponse.json({ success: false, message: '場所を入力してください' }, { status: 400 });
    }

    try {
        const apiKey = process.env.OPENAI_API_KEY;
        const prompt = `Give me the top tourist attractions in ${location}.`;

        const response = await axios.post(
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

        const touristSpots = response.data.choices[0].message.content;
        return NextResponse.json({ success: true, data: touristSpots }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: '観光地の取得に失敗しました' }, { status: 500 });
    }
}
