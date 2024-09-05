import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
    console.log("APIリクエストを受け取りました");

    try {
        const { location } = await request.json();

        if (!location) {
            console.log("場所が入力されていません");
            return NextResponse.json({ success: false, message: '場所を入力してください' }, { status: 400 });
        }

        const apiKey = process.env.OPENAI_API_KEY;
        
        // APIキーが未設定の場合
        if (!apiKey) {
            console.error("OpenAI APIキーが設定されていません");
            return NextResponse.json({ success: false, message: 'APIキーが設定されていません' }, { status: 500 });
        }

        const prompt = `Give me the top tourist attractions in ${location}.`;

        // OpenAI APIのレスポンスの型定義
        interface OpenAIResponse {
            choices: Array<{
                message: {
                    content: string;
                };
            }>;
        }

        // OpenAI APIのリクエスト
        const response = await axios.post<OpenAIResponse>(
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

        // OpenAI APIからのレスポンスをログ出力（デバッグ用）
        console.log("OpenAI APIレスポンス:", response.data);

        const touristSpots = response.data.choices[0].message.content;
        return NextResponse.json({ success: true, data: touristSpots }, { status: 200 });

    } catch (error: any) {
        // エラーメッセージの詳細を取得
        console.error("エラー詳細:", error.message);

        // エラーがAPIリクエストの失敗によるものかをチェック
        if (error instanceof Error && 'response' in error) {
            console.error("APIリクエストエラー:", (error as any).response?.data || error.message);
            return NextResponse.json({ success: false, message: 'OpenAI APIへのリクエストに失敗しました' }, { status: 500 });
        }

        // その他のエラーの場合
        console.error("不明なエラー:", error);
        return NextResponse.json({ success: false, message: '観光地の取得に失敗しました' }, { status: 500 });
    }
}
