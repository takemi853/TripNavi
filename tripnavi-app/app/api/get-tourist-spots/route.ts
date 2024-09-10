import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import mongoose from 'mongoose';
import { LogModel } from '../../../models/log';  // モデルのインポート

// MongoDBへの接続
const connectDB = async () => {
    console.log("MongoDBの接続状態:", mongoose.connection.readyState);
    if (mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("MongoDBに接続しました");
        } catch (error) {
            console.error("MongoDB接続エラー:", error);
            throw new Error("データベース接続に失敗しました");
        }
    } else {
        console.log("既にMongoDBに接続されています");
    }
};


export async function POST(request: NextRequest) {
    console.log("APIリクエストを受け取りました");
    await connectDB();  // データベースに接続
    console

    try {
        const { lat, lon, location } = await request.json();

        // 緯度・経度、または場所の名前が存在するかチェック
        if ((!lat || !lon) && !location) {
            console.log("緯度・経度または場所の名前が入力されていません");
            return NextResponse.json({ success: false, message: '緯度・経度または場所の名前を入力してください' }, { status: 400 });
        }

        const apiKey = process.env.OPENAI_API_KEY;

        // APIキーが未設定の場合
        if (!apiKey) {
            console.error("OpenAI APIキーが設定されていません");
            return NextResponse.json({ success: false, message: 'APIキーが設定されていません' }, { status: 500 });
        }

        // プロンプトを生成
        let prompt: string;
        if (lat && lon) {
            prompt = `緯度${lat}、経度${lon}の周辺にある有名な観光地のリストを作成してください。各観光地の名前、簡単な説明、そしてその場所がどのような人におすすめかをタグとして日本語で提供してください。\
                        json形式: [ { "name": "観光地の名前", "description": "観光地の簡単な説明", "tags": ["おすすめの人のタグ", "複数のタグがある場合はカンマで区切る"] } ]」`;
        } else if (location) {
            prompt = `場所「${location}」周辺にある有名な観光地のリストを、以下の形式で返してください。各観光地に対して名前、簡単な説明、そしてその場所がどのような人におすすめかをタグとして提供してください。 \
                        json形式: [ { "name": "観光地の名前", "description": "観光地の簡単な説明", "tags": ["おすすめの人のタグ", "複数のタグがある場合はカンマで区切る"] } ]」`;
        } else {
            return NextResponse.json({ success: false, message: '有効な入力がありません' }, { status: 400 });
        }

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
                model: 'gpt-3.5-turbo',  // 必要に応じてモデルを変更
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
        // リクエストとレスポンスをデータベースに保存
        const log = new LogModel({
            request: { lat: lat || null, lon: lon || null, location: location || null },  
            response: { success: true, data: touristSpots },
            timestamp: new Date()
        });
        await log.save();
        console.log("観光地リスト:", touristSpots);
        return NextResponse.json({ success: true, data: touristSpots }, { status: 200 });

    } catch (error: unknown) {
        // エラーメッセージの詳細を取得
        console.error("エラー詳細:", (error as Error).message);
        const { lat, lon, location } = await request.json().catch(() => ({}));
        const log = new LogModel({
            request: { lat: lat || null, lon: lon || null, location: location || null },
            response: { success: false, message: 'APIリクエストエラー' },
            timestamp: new Date()
        });
        await log.save();

        // エラーがAPIリクエストの失敗によるものかをチェック
        if (error instanceof Error && error.hasOwnProperty('response')) {
            // console.error("APIリクエストエラー:", (error as any).response?.data || error.message);
            return NextResponse.json({ success: false, message: 'OpenAI APIへのリクエストに失敗しました' }, { status: 500 });
        }

        // その他のエラーの場合
        console.error("不明なエラー:", error);
        return NextResponse.json({ success: false, message: '観光地の取得に失敗しました' }, { status: 500 });
    }
}

